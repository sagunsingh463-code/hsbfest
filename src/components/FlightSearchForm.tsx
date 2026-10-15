'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, Filter, ShieldCheck } from 'lucide-react';

interface FlightSearchFormProps {
  query: string;
  onSearch: (searchTerm: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  isLoading: boolean;
  onOpenSecurityModal?: () => void;
}

const POPULAR_FLIGHTS = [
  { code: 'AA100', route: 'JFK → LHR', label: 'American 100' },
  { code: 'UA881', route: 'ORD → HND', label: 'United 881' },
  { code: 'DL404', route: 'ATL → CDG', label: 'Delta 404' },
  { code: 'BA249', route: 'LHR → GIG', label: 'British Airways 249' },
  { code: 'EK202', route: 'JFK → DXB', label: 'Emirates 202' },
  { code: 'SQ321', route: 'LHR → SIN', label: 'Singapore 321' },
  { code: 'AI101', route: 'DEL → JFK', label: 'Air India 101' },
  { code: 'AF006', route: 'CDG → JFK', label: 'Air France 006' },
];

const STATUS_FILTERS = ['All', 'In Flight', 'Scheduled', 'On Time', 'Delayed', 'Landed'];

export default function FlightSearchForm({
  query,
  onSearch,
  selectedStatus,
  onStatusChange,
  isLoading,
  onOpenSecurityModal,
}: FlightSearchFormProps) {
  const [inputValue, setInputValue] = useState(query);

  // Sync when prop updates (e.g. from threat simulation or reset)
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  const handleQuickSelect = (code: string) => {
    setInputValue(code);
    onSearch(code);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 mb-8 transition-all">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="flight-input"
            className="block text-sm font-semibold text-slate-800"
          >
            Look Up Flight Number
          </label>
          
          {onOpenSecurityModal && (
            <button
              type="button"
              onClick={onOpenSecurityModal}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 transition cursor-pointer font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>WAF & Rate Limiter Active</span>
            </button>
          )}
        </div>
        
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          
          <input
            id="flight-input"
            type="text"
            value={inputValue}
            maxLength={60}
            onChange={(e) => {
              setInputValue(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="e.g. AA100, UA881, DL404, or airline/city..."
            className="w-full pl-11 pr-28 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition"
                title="Clear input"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm shadow-blue-500/30 transition flex items-center gap-1.5 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </form>

      {/* Popular Quick Search Chips */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Lookup Examples:</span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {POPULAR_FLIGHTS.map((item) => {
            const isSelected = inputValue.toUpperCase() === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleQuickSelect(item.code)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                }`}
              >
                <span className="font-bold">{item.code}</span>
                <span className="text-[11px] opacity-75 hidden sm:inline">({item.route})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Status:</span>
        </div>

        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          {STATUS_FILTERS.map((status) => {
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
