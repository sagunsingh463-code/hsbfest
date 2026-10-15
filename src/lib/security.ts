/**
 * Security utilities: Input Sanitization, Threat Detection, Rate Limiting & Security Audit
 */

export interface SecurityCheckResult {
  isValid: boolean;
  sanitized: string;
  threatType?: 'XSS' | 'SQL_INJECTION' | 'COMMAND_INJECTION' | 'PATH_TRAVERSAL' | 'LENGTH_OVERFLOW';
  errorMessage?: string;
}

// Malicious pattern signatures
const THREAT_PATTERNS = [
  {
    type: 'XSS' as const,
    regex: /(<script|script>|javascript:|onerror=|onload=|eval\(|<iframe|<img|<svg|vbscript:)/i,
    message: 'Cross-Site Scripting (XSS) payload detected.',
  },
  {
    type: 'SQL_INJECTION' as const,
    regex: /(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bDELETE\b|--|;\s*--|\/\*|\*\/|'\s*OR\s*'|"\s*OR\s*")/i,
    message: 'Potential SQL injection pattern detected.',
  },
  {
    type: 'COMMAND_INJECTION' as const,
    regex: /(\|\||&&|;\s*rm\b|;\s*cat\b|;\s*powershell|;\s*cmd|`|\$\()/i,
    message: 'System command injection pattern detected.',
  },
  {
    type: 'PATH_TRAVERSAL' as const,
    regex: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\/)/i,
    message: 'Directory traversal pattern detected.',
  },
];

/**
 * Validates and sanitizes flight search input
 */
export function validateAndSanitizeQuery(rawInput: string | null | undefined): SecurityCheckResult {
  if (!rawInput) {
    return { isValid: true, sanitized: '' };
  }

  // 1. Check length overflow (Flight numbers rarely exceed 15 chars, max limit 50 chars)
  if (rawInput.length > 50) {
    return {
      isValid: false,
      sanitized: rawInput.slice(0, 50),
      threatType: 'LENGTH_OVERFLOW',
      errorMessage: 'Query exceeds maximum allowed length of 50 characters.',
    };
  }

  // 2. Scan for threat patterns
  for (const pattern of THREAT_PATTERNS) {
    if (pattern.regex.test(rawInput)) {
      return {
        isValid: false,
        sanitized: '',
        threatType: pattern.type,
        errorMessage: pattern.message,
      };
    }
  }

  // 3. HTML Entity Encode / Sanitize
  const sanitized = rawInput
    .replace(/[<>'"]/g, '') // Strip HTML brackets and quotes
    .trim();

  return {
    isValid: true,
    sanitized,
  };
}

/**
 * In-Memory Sliding Window Rate Limiter
 * 30 requests per 60 seconds per IP
 */
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS_PER_WINDOW = 35; // 35 requests/min

export function checkRateLimit(clientId: string): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(clientId) || { timestamps: [] };

  // Filter timestamps within current window
  const validTimestamps = record.timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = validTimestamps[0];
    const resetInSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldestTimestamp)) / 1000);
    return {
      allowed: false,
      limit: MAX_REQUESTS_PER_WINDOW,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(clientId, { timestamps: validTimestamps });

  return {
    allowed: true,
    limit: MAX_REQUESTS_PER_WINDOW,
    remaining: MAX_REQUESTS_PER_WINDOW - validTimestamps.length,
    resetInSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
  };
}

/**
 * Standard Security Headers
 */
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};
