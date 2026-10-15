'use client';

import React, { useState } from 'react';
import { Flight } from '@/types/flight';
import FlightCard from './FlightCard';
import { AlertCircle, ArrowUpDown, RefreshCw, ShieldAlert, Lock } from 'lucide-react';

export interface SecurityAlert {
  title: string;
  message: string;
  code?: string;
  threatType?: string;
}

interface FlightListProps {
  flights: Flight[];
  query: string;
  isLoading: boolean;
  onResetSearch: () => void;
  selectedStatus: string;
  securityAlert?: SecurityAlert | null;
}

export default function FlightList({
  flights,
  query,
  isLoading,
  onResetSearch,
  selectedStatus,
  securityAlert,
}: FlightListProps) {
  const [sortBy, setSortBy] = useState<'default' | 'flightNumber' | 'duration' | 'departure'>('default');

  // Filter by status if selected
  const filteredFlights = flights.filter((flight) => {
    if (selectedStatus === 'All') return true;
    return flight.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  // Sort flights
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortBy === 'flightNumber') {
      return a.flightNumber.localeCompare(b.flightNumber);
    }
    if (sortBy === 'departure') {
      return a.departure.time.localeCompare(b.departure.time);
    }
    if (sortBy === 'duration') {
      return a.duration.localeCompare(b.duration);
    }
    return 0;
  });

  return (
    <section className="w-full">
      {/* Security Threat Intercept Alert Banner (if threat blocked) */}
      {securityAlert && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 mb-6 text-rose-950 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-rose-900">
                  {securityAlert.title}
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase bg-rose-200/80 text-rose-800 px-2 py-0.5 rounded">
                  {securityAlert.code || 'BLOCKED'}
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-1 font-medium">
                {securityAlert.message}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={onResetSearch}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition cursor-pointer shadow-xs"
                >
                  Clear Malicious Input
                </button>
                <span className="text-[11px] text-rose-600 font-mono">
                  Protected by Next.js WAF & Input Sanitizer
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Search Results</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {isLoading ? 'Searching...' : `${sortedFlights.length} found`}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {query ? (
              <span>
                Matching flight query: <strong className="text-slate-800 font-mono">"{query}"</strong>
              </span>
            ) : (
              <span>Showing all available scheduled flights</span>
            )}
            {selectedStatus !== 'All' && (
              <span className="ml-1 text-blue-600 font-medium">({selectedStatus} only)</span>
            )}
          </p>
        </div>

        {/* Sort Selector */}
        {sortedFlights.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-700 py-1.5 px-3 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              <option value="default">Default Order</option>
              <option value="flightNumber">Flight Number</option>
              <option value="departure">Departure Time</option>
              <option value="duration">Flight Duration</option>
            </select>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                  <div className="space-y-1.5">
                    <div className="w-24 h-4 bg-slate-200 rounded" />
                    <div className="w-32 h-3 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="w-20 h-6 bg-slate-100 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-2">
                  <div className="w-16 h-8 bg-slate-200 rounded" />
                  <div className="w-28 h-4 bg-slate-100 rounded" />
                  <div className="w-24 h-3 bg-slate-100 rounded" />
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-20 h-4 bg-slate-100 rounded" />
                  <div className="w-full h-1 bg-slate-200 rounded" />
                </div>
                <div className="space-y-2 md:text-right flex flex-col md:items-end">
                  <div className="w-16 h-8 bg-slate-200 rounded" />
                  <div className="w-28 h-4 bg-slate-100 rounded" />
                  <div className="w-24 h-3 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sortedFlights.length === 0 && !securityAlert && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No Flights Found
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
            We couldn't find any flights matching{' '}
            <strong className="text-slate-700">"{query || selectedStatus}"</strong> in the mock database.
            Try searching for a flight number like <span className="font-mono text-blue-600 font-semibold">AA100</span>,{' '}
            <span className="font-mono text-blue-600 font-semibold">UA881</span>,{' '}
            <span className="font-mono text-blue-600 font-semibold">DL404</span>, or reset your filters.
          </p>
          <button
            type="button"
            onClick={onResetSearch}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset & View All Flights</span>
          </button>
        </div>
      )}

      {/* Flight Cards List */}
      {!isLoading && sortedFlights.length > 0 && (
        <div className="space-y-4">
          {sortedFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}
    </section>
  );
}
