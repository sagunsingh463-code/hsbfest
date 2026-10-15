'use client';

import { useState, useEffect } from 'react';
import { Plane, Clock, Globe, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenSecurityModal?: () => void;
}

export default function Header({ onOpenSecurityModal }: HeaderProps) {
  const [utcTime, setUtcTime] = useState<string>('');
  const [localTime, setLocalTime] = useState<string>('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setUtcTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setLocalTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Plane className="w-5 h-5 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                AeroLookup
              </span>
              <span className="text-xs px-2 py-0.5 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                v1.0 Mock API
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Real-time flight schedules, locations & time zones
            </p>
          </div>
        </div>

        {/* Live Clock & Security Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Security Shield Button */}
          {onOpenSecurityModal && (
            <button
              type="button"
              onClick={onOpenSecurityModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 font-medium transition cursor-pointer"
              title="Click to view active security features"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Security Shield:</span>
              <span className="font-bold text-emerald-700">Active</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-mono">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500 hidden md:inline">UTC:</span>
            <span className="font-semibold">{utcTime || '--:--:--'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-500 hidden md:inline">Local:</span>
            <span className="font-semibold">{localTime || '--:--:--'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
