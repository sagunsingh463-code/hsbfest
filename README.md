# ✈️ AeroLookup — Flight Tracker & Timezone Web App

A Next.js web application for looking up flight schedules, route locations, start/end times, and international time zones, protected with an enterprise-grade multi-layer security architecture.

---

## ✨ Core Features

- **Flight Lookup by Number**: Search by full or partial flight number (e.g. `AA100`, `UA881`, `DL404`, `BA249`, `EK202`, `SQ321`, `AF006`, `AI101`, `QF1`, `WN1420`).
- **Complete Flight Schedule & Locations**:
  - **Start Time (Departure)**: Local departure time, date, day of week, and ISO UTC timestamp.
  - **End Time (Arrival)**: Local arrival time, date, day of week, next-day indicators (`+1 Day`), and ISO UTC timestamp.
  - **Start Location (Origin)**: Airport IATA code (`JFK`), full airport name, city, country, terminal, and gate.
  - **End Location (Destination)**: Airport IATA code (`LHR`), full airport name, city, country, terminal, and gate.
  - **Time Zones & Conversion**:
    - Departure Timezone: e.g. `EDT (UTC-4) - America/New_York`
    - Arrival Timezone: e.g. `BST (UTC+1) - Europe/London`
    - Timezone Offset Difference: e.g. `+5 hrs destination ahead`
  - **Interactive Route Timeline**: Flight duration, distance, and animated in-flight progress bar.
- **Search Results Displayed Under Form Input**:
  - Real-time reactive updates as the user types or clicks quick-search chips.
  - Filter by status (`All`, `In Flight`, `Scheduled`, `On Time`, `Delayed`, `Landed`).
  - Sort by flight number, departure time, or flight duration.

---

## 🛡️ Security Features & Protections

The application incorporates a defense-in-depth security model across the Edge, Server, and Client layers:

### 1. Web Application Firewall (WAF) & Input Sanitization
- **Threat Signatures Filter**: Queries are inspected for:
  - **Cross-Site Scripting (XSS)**: Blocks `<script>`, event handlers (`onload=`, `onerror=`), `javascript:`, `eval()`.
  - **SQL Injection**: Blocks SQL keywords (`UNION`, `SELECT`, `' OR '1'='1`, `DROP`).
  - **System Command Injection**: Blocks shell execution characters (`|`, `&`, `rm`, `cat`, `$()`).
  - **Directory Traversal**: Blocks `../`, `..\`, `%2e%2e`.
- **Character Stripping & Boundary Checks**: Strips raw HTML brackets and enforces a maximum input limit of 50 characters (`LENGTH_OVERFLOW`).

### 2. Sliding-Window Rate Limiting & DoS Protection
- **Capped API Traffic**: Enforces a sliding window maximum of **35 requests per 60 seconds** per client IP.
- **RFC-Compliant Headers**: Returns `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After` on `HTTP 429 Too Many Requests`.

### 3. Hardened HTTP Security Headers
Configured at both the framework level (`next.config.ts`) and Edge Middleware (`src/middleware.ts`):
- `X-Frame-Options: DENY` (prevents clickjacking attacks)
- `X-Content-Type-Options: nosniff` (prevents MIME-confusion attacks)
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (enforces HTTPS)
- `Referrer-Policy: strict-origin-when-cross-origin` (prevents sensitive referrer leakage)
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (disables unnecessary browser device APIs)
- `X-XSS-Protection: 1; mode=block`

### 4. Zero-Trust Gateway & Audit Traceability
- **Cryptographic Request ID**: Every request generates a unique `X-Request-Id` UUID for traceability.
- **Edge Middleware Shield**: Intercepts requests before reaching downstream route handlers.

### 5. Interactive Threat Sandbox
- An integrated **Security Inspector Modal** in the UI allows users and auditors to test payloads (XSS, SQLi, Command Injection, Buffer Overflow) and watch the WAF intercept and display security alerts in real time.

---

## 🚀 Running the App

The project is located at `c:\New folder\flight-lookup-app`.

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Security Features Live

### Test 1: Valid Lookup
```bash
curl -i "http://localhost:3000/api/flights?flightNumber=AA100"
# Returns HTTP 200 with X-RateLimit headers and flight schedule data
```

### Test 2: XSS Injection Interception
```bash
curl -i "http://localhost:3000/api/flights?q=%3Cscript%3Ealert(1)%3C/script%3E"
# Returns HTTP 400 Bad Request
# {"error":"Cross-Site Scripting (XSS) payload detected.","code":"SECURITY_VALIDATION_FAILED","threatType":"XSS"}
```

### Test 3: SQL Injection Interception
```bash
curl -i "http://localhost:3000/api/flights?q=%27%20OR%20%271%27=%271"
# Returns HTTP 400 Bad Request
# {"error":"Potential SQL injection pattern detected.","code":"SECURITY_VALIDATION_FAILED","threatType":"SQL_INJECTION"}
```
