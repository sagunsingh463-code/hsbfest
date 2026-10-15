import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, validateAndSanitizeQuery, SECURITY_HEADERS } from '@/lib/security';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Generate unique Request ID for traceability and security logs
  const requestId = crypto.randomUUID();

  // 1. API Route Protection (/api/*)
  if (pathname.startsWith('/api/')) {
    // Get client identifier: prefer forwarded-for IP, otherwise fallback
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // A. Rate Limiting Check
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Too many flight lookup requests.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfterSeconds: rateCheck.resetInSeconds,
          requestId,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetInSeconds),
            'X-RateLimit-Limit': String(rateCheck.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateCheck.resetInSeconds),
            'X-Request-Id': requestId,
            ...SECURITY_HEADERS,
          },
        }
      );
    }

    // B. Search Query Threat Inspection (WAF Filter)
    const rawQuery = searchParams.get('q') || searchParams.get('flightNumber');
    if (rawQuery) {
      const securityCheck = validateAndSanitizeQuery(rawQuery);
      if (!securityCheck.isValid) {
        return NextResponse.json(
          {
            error: securityCheck.errorMessage,
            code: 'SECURITY_VALIDATION_FAILED',
            threatType: securityCheck.threatType,
            requestId,
          },
          {
            status: 400,
            headers: {
              'X-Request-Id': requestId,
              ...SECURITY_HEADERS,
            },
          }
        );
      }
    }

    // Pass through with security and rate-limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(rateCheck.limit));
    response.headers.set('X-RateLimit-Remaining', String(rateCheck.remaining));
    response.headers.set('X-Request-Id', requestId);

    Object.entries(SECURITY_HEADERS).forEach(([key, val]) => {
      response.headers.set(key, val);
    });

    return response;
  }

  // 2. Page & Static asset security headers
  const response = NextResponse.next();
  response.headers.set('X-Request-Id', requestId);
  Object.entries(SECURITY_HEADERS).forEach(([key, val]) => {
    response.headers.set(key, val);
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
