import { NextRequest, NextResponse } from 'next/server';
import { searchFlights, MOCK_FLIGHTS } from '@/data/mockFlights';
import { FlightApiResponse } from '@/types/flight';
import { validateAndSanitizeQuery } from '@/lib/security';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawFlightNumber = searchParams.get('flightNumber') || searchParams.get('q') || '';

  // 1. Sanitize & inspect query
  const securityCheck = validateAndSanitizeQuery(rawFlightNumber);

  if (!securityCheck.isValid) {
    return NextResponse.json(
      {
        error: securityCheck.errorMessage || 'Invalid or unsafe input detected',
        code: 'SECURITY_VALIDATION_FAILED',
        threatType: securityCheck.threatType,
        query: rawFlightNumber,
        total: 0,
        flights: [],
        timestamp: new Date().toISOString(),
        security: {
          status: 'threat_blocked',
          wafInspection: `Blocked: ${securityCheck.threatType}`,
        },
      },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }

  // 2. Simulate slight network latency (150ms)
  await new Promise((resolve) => setTimeout(resolve, 150));

  const cleanQuery = securityCheck.sanitized;
  const results = cleanQuery ? searchFlights(cleanQuery) : MOCK_FLIGHTS;

  const response: FlightApiResponse = {
    query: rawFlightNumber,
    sanitizedQuery: cleanQuery,
    total: results.length,
    flights: results,
    timestamp: new Date().toISOString(),
    security: {
      status: cleanQuery !== rawFlightNumber ? 'sanitized' : 'clean',
      wafInspection: 'Passed (Zero Threat Patterns Detected)',
    },
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
