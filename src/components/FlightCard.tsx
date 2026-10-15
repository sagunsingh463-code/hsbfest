'use client';

import React, { useState } from 'react';
import { Flight } from '@/types/flight';
import {
  Plane,
  Clock,
  MapPin,
  Globe2,
  Calendar,
  Luggage,
  ChevronDown,
  ChevronUp,
  Info,
  Timer,
} from 'lucide-react';

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: Flight['status']) => {
    switch (status) {
      case 'In Flight':
        return 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse';
      case 'On Time':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Scheduled':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delayed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Landed':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden mb-5">
      {/* Flight Card Header */}
      <div className="bg-slate-50/80 px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center tracking-wider shadow-sm">
            {flight.airlineCode}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                {flight.flightNumber}
              </h3>
              <span className="text-slate-400 font-normal text-sm">•</span>
              <span className="text-sm font-semibold text-slate-700">
                {flight.airline}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Aircraft: <span className="text-slate-700">{flight.aircraft}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-3 py-1 font-semibold rounded-full border ${getStatusBadge(
              flight.status
            )}`}
          >
            ● {flight.status}
          </span>
        </div>
      </div>

      {/* Main Flight Route Body */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* 1. START LOCATION & START TIME & TIMEZONE */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Start Location (Origin)</span>
            </div>

            {/* Airport Code & City */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {flight.departure.location.airportCode}
                </span>
                <span className="text-lg font-bold text-slate-800">
                  {flight.departure.location.city}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1" title={flight.departure.location.airportName}>
                {flight.departure.location.airportName}, {flight.departure.location.country}
              </p>
            </div>

            {/* Departure Start Time */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-600">Start Time (Departure):</span>
              </div>
              <div className="text-xl font-bold text-slate-900 font-mono">
                {flight.departure.time}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>
                  {flight.departure.date} ({flight.departure.dayOfWeek})
                </span>
              </div>
            </div>

            {/* Start Time Zone */}
            <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-500">Time Zone:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60 font-mono">
                <Globe2 className="w-3 h-3" />
                {flight.departure.location.timezone}
              </span>
            </div>

            {/* Terminal & Gate */}
            {(flight.departure.location.terminal || flight.departure.location.gate) && (
              <div className="text-xs text-slate-600 flex items-center gap-3 pt-1">
                {flight.departure.location.terminal && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                    Term: <strong className="text-slate-800">{flight.departure.location.terminal}</strong>
                  </span>
                )}
                {flight.departure.location.gate && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                    Gate: <strong className="text-slate-800">{flight.departure.location.gate}</strong>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 2. ROUTE GRAPHIC, DURATION, TIMEZONE DIFFERENCE */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center px-2 py-3 bg-slate-50/60 rounded-xl border border-slate-100">
            {/* Duration */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <Timer className="w-3.5 h-3.5 text-slate-500" />
              <span>Duration: {flight.duration}</span>
            </div>

            {/* Progress Route Line */}
            <div className="w-full relative my-3 px-3">
              <div className="h-1 bg-slate-200 rounded-full w-full relative overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${flight.progressPercent}%` }}
                />
              </div>

              {/* Airplane Icon */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                style={{
                  left: `${Math.max(10, Math.min(90, flight.progressPercent || 50))}%`,
                }}
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Plane className="w-3.5 h-3.5 transform rotate-45" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full px-2 text-[11px] text-slate-400 font-mono mb-2">
              <span>{flight.departure.location.airportCode}</span>
              <span className="text-slate-500">{flight.distance}</span>
              <span>{flight.arrival.location.airportCode}</span>
            </div>

            {/* Key Requirement: Time Zones Difference Highlight */}
            <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
              <Globe2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{flight.timeZoneDiff}</span>
            </div>
          </div>

          {/* 3. END LOCATION & END TIME & TIMEZONE */}
          <div className="md:col-span-4 space-y-2 md:text-right">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider md:justify-end">
              <MapPin className="w-3.5 h-3.5" />
              <span>End Location (Destination)</span>
            </div>

            {/* Airport Code & City */}
            <div>
              <div className="flex items-baseline gap-2 md:justify-end">
                <span className="text-lg font-bold text-slate-800 order-2 md:order-1">
                  {flight.arrival.location.city}
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono order-1 md:order-2">
                  {flight.arrival.location.airportCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1" title={flight.arrival.location.airportName}>
                {flight.arrival.location.airportName}, {flight.arrival.location.country}
              </p>
            </div>

            {/* Arrival End Time */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="text-xs text-slate-500 flex items-center gap-1.5 md:justify-end">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-600">End Time (Arrival):</span>
              </div>
              <div className="text-xl font-bold text-slate-900 font-mono flex items-center gap-1.5 md:justify-end">
                <span>{flight.arrival.time}</span>
                {flight.arrival.dayShift && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-sans">
                    {flight.arrival.dayShift}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 md:justify-end">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>
                  {flight.arrival.date} ({flight.arrival.dayOfWeek})
                </span>
              </div>
            </div>

            {/* End Time Zone */}
            <div className="pt-1.5 flex items-center gap-1.5 flex-wrap md:justify-end">
              <span className="text-xs font-semibold text-slate-500">Time Zone:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
                <Globe2 className="w-3 h-3" />
                {flight.arrival.location.timezone}
              </span>
            </div>

            {/* Terminal & Gate */}
            {(flight.arrival.location.terminal || flight.arrival.location.gate) && (
              <div className="text-xs text-slate-600 flex items-center gap-3 pt-1 md:justify-end">
                {flight.arrival.location.terminal && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                    Term: <strong className="text-slate-800">{flight.arrival.location.terminal}</strong>
                  </span>
                )}
                {flight.arrival.location.gate && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                    Gate: <strong className="text-slate-800">{flight.arrival.location.gate}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Toggleable Deep-Dive Details Drawer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {flight.baggageClaim && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                <Luggage className="w-3.5 h-3.5 text-slate-500" />
                Baggage: {flight.baggageClaim}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer"
          >
            <span>
              {isExpanded ? 'Hide Timezone & Route Details' : 'View Detailed Timezone & Flight Data'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Expanded Drawer */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-dashed border-slate-200 bg-slate-50/70 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              Comprehensive Timezone & Schedule Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Origin Timezone Breakdown */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-slate-500 font-medium mb-1">Departure Timezone</div>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  {flight.departure.location.timezone}
                </div>
                <div className="text-slate-500 mt-1">
                  IANA: <code className="text-slate-700">{flight.departure.location.timezoneName}</code>
                </div>
                <div className="text-slate-500 mt-0.5">
                  UTC Offset: <span className="font-semibold text-slate-700">{flight.departure.location.utcOffsetHours >= 0 ? `+${flight.departure.location.utcOffsetHours}` : flight.departure.location.utcOffsetHours}h</span>
                </div>
                <div className="text-slate-500 mt-1 pt-1 border-t border-slate-100">
                  UTC Scheduled: <span className="font-mono text-slate-700">{flight.departure.isoUtc}</span>
                </div>
              </div>

              {/* Time Difference Summary */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-slate-500 font-medium mb-1">Route & Flight Path</div>
                  <div className="text-sm font-bold text-slate-900">
                    {flight.departure.location.city} → {flight.arrival.location.city}
                  </div>
                  <div className="text-slate-500 mt-1">
                    Air Distance: <span className="font-medium text-slate-800">{flight.distance}</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Estimated Air Time: <span className="font-medium text-slate-800">{flight.duration}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 text-amber-700 font-semibold">
                  Shift: {flight.timeZoneDiff}
                </div>
              </div>

              {/* Destination Timezone Breakdown */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-slate-500 font-medium mb-1">Arrival Timezone</div>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  {flight.arrival.location.timezone}
                </div>
                <div className="text-slate-500 mt-1">
                  IANA: <code className="text-slate-700">{flight.arrival.location.timezoneName}</code>
                </div>
                <div className="text-slate-500 mt-0.5">
                  UTC Offset: <span className="font-semibold text-slate-700">{flight.arrival.location.utcOffsetHours >= 0 ? `+${flight.arrival.location.utcOffsetHours}` : flight.arrival.location.utcOffsetHours}h</span>
                </div>
                <div className="text-slate-500 mt-1 pt-1 border-t border-slate-100">
                  UTC Scheduled: <span className="font-mono text-slate-700">{flight.arrival.isoUtc}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
