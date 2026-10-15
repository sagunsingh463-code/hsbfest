'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import FlightSearchForm from '@/components/FlightSearchForm';
import FlightList, { SecurityAlert } from '@/components/FlightList';
import SecurityBadgeModal from '@/components/SecurityBadgeModal';
import { Flight, FlightApiResponse } from '@/types/flight';
import { Plane, Compass, Globe, Sparkles, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [securityAlert, setSecurityAlert] = useState<SecurityAlert | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  // Fetch flights from mock API with security inspection handling
  const fetchFlights = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const url = searchQuery
        ? `/api/flights?q=${encodeURIComponent(searchQuery)}`
        : '/api/flights';
      const res = await fetch(url);

      if (res.status === 400) {
        const errorData = await res.json();
        setSecurityAlert({
          title: 'WAF Intercept: Malicious Query Blocked',
          message:
            errorData.error ||
            'Potential injection or unauthorized characters blocked by server firewall.',
          code: errorData.code || 'THREAT_DETECTED',
          threatType: errorData.threatType,
        });
        setFlights([]);
        return;
      }

      if (res.status === 429) {
        const errorData = await res.json();
        setSecurityAlert({
          title: 'Rate Limit Exceeded',
          message:
            errorData.error ||
            'Too many requests sent in a short window. Please wait a moment before trying again.',
          code: 'RATE_LIMIT_429',
        });
        setFlights([]);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch flight data');
      }

      const data: FlightApiResponse = await res.json();
      setSecurityAlert(null); // Clear any previous alert
      setFlights(data.flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchFlights('');
  }, [fetchFlights]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    fetchFlights(newQuery);
  };

  const handleResetSearch = () => {
    setQuery('');
    setSelectedStatus('All');
    setSecurityAlert(null);
    fetchFlights('');
  };

  const handleSimulateThreat = (threatPayload: string) => {
    setQuery(threatPayload);
    fetchFlights(threatPayload);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Header onOpenSecurityModal={() => setIsSecurityModalOpen(true)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Hero Section */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Flight & Timezone Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Any Flight in Seconds
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Enter a flight number to view departure & arrival times, local time zones,
            UTC offsets, terminal gates, and airport locations.
          </p>

          {/* Quick Metrics & Security Status Banner */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Global Timezone Conversion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Origin & Destination Gates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-indigo-600" />
              <span>Real-Time Status</span>
            </div>
            <button
              type="button"
              onClick={() => setIsSecurityModalOpen(true)}
              className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 transition cursor-pointer font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>WAF, CSP & Rate-Limiter Protected</span>
            </button>
          </div>
        </div>

        {/* 1. Form Input Section */}
        <FlightSearchForm
          query={query}
          onSearch={handleSearch}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          isLoading={isLoading}
          onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        />

        {/* 2. Search Results Displayed Under Form Input (As Specified) */}
        <FlightList
          flights={flights}
          query={query}
          isLoading={isLoading}
          onResetSearch={handleResetSearch}
          selectedStatus={selectedStatus}
          securityAlert={securityAlert}
        />
      </main>

      {/* Security Inspector Modal */}
      <SecurityBadgeModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSimulateThreat={handleSimulateThreat}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">AeroLookup</span>
            <span>—</span>
            <span>Flight & Timezone Lookup Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Security Inspector & Threat Sandbox
            </button>
            <p>
              Protected with strict CSP, Rate Limiting & Input Sanitization.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
