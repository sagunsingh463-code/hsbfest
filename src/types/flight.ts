export interface FlightLocation {
  city: string;
  airportCode: string;
  airportName: string;
  country: string;
  terminal?: string;
  gate?: string;
  timezone: string; // e.g. "EDT (UTC-4)"
  timezoneName: string; // e.g. "America/New_York"
  utcOffsetHours: number;
}

export interface Flight {
  id: string;
  flightNumber: string; // e.g. "AA100"
  airline: string; // e.g. "American Airlines"
  airlineCode: string; // "AA"
  aircraft: string; // e.g. "Boeing 777-300ER"
  status: 'Scheduled' | 'On Time' | 'In Flight' | 'Delayed' | 'Landed';
  departure: {
    location: FlightLocation;
    time: string; // Local departure time e.g. "18:30" (6:30 PM)
    date: string; // e.g. "Oct 15, 2026"
    dayOfWeek: string;
    isoUtc: string; // ISO string in UTC
  };
  arrival: {
    location: FlightLocation;
    time: string; // Local arrival time e.g. "06:45" (6:45 AM)
    date: string; // e.g. "Oct 16, 2026"
    dayOfWeek: string;
    isoUtc: string; // ISO string in UTC
    dayShift?: string; // e.g. "+1 Day"
  };
  duration: string; // e.g. "7h 15m"
  distance: string; // e.g. "3,451 mi"
  timeZoneDiff: string; // e.g. "+5 hours ahead"
  progressPercent: number; // 0 to 100
  baggageClaim?: string;
}

export interface FlightApiResponse {
  query: string;
  sanitizedQuery?: string;
  total: number;
  flights: Flight[];
  timestamp: string;
  security?: {
    status: 'clean' | 'threat_blocked' | 'sanitized';
    wafInspection: string;
    rateLimitRemaining?: number;
  };
  error?: string;
  code?: string;
  threatType?: string;
}
