'use client';

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Zap,
  FileCode,
  Layers,
  X,
  Bug,
  CheckCircle2,
} from 'lucide-react';

interface SecurityBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateThreat: (payload: string) => void;
}

export default function SecurityBadgeModal({
  isOpen,
  onClose,
  onSimulateThreat,
}: SecurityBadgeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                AeroLookup Security Architecture
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Multi-layered defense-in-depth protection for flight lookups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
          {/* Layer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Layer 1: WAF & Input Sanitization */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>1. WAF & Input Sanitization</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Queries are scanned against XSS (`&lt;script&gt;`, event handlers), SQL injection (`UNION`, `' OR '1'='1`), directory traversal (`../`), and command injection signatures.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strict regex filter + HTML stripping</span>
              </div>
            </div>

            {/* Layer 2: Rate Limiting & DoS Shield */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>2. Sliding-Window Rate Limiting</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Protects the flight lookup engine by capping traffic to a maximum of 35 requests per 60 seconds per IP, returning `HTTP 429 Too Many Requests` with retry headers.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>DoS & Scraping prevention enabled</span>
              </div>
            </div>

            {/* Layer 3: Hardened HTTP Headers */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>3. Hardened Security Headers</span>
              </div>
              <ul className="space-y-1 font-mono text-[11px] text-slate-700">
                <li>• <code>X-Frame-Options: DENY</code> (Clickjacking)</li>
                <li>• <code>X-Content-Type-Options: nosniff</code> (MIME)</li>
                <li>• <code>Strict-Transport-Security</code> (HSTS)</li>
                <li>• <code>Permissions-Policy: camera=(), mic=()</code></li>
              </ul>
            </div>

            {/* Layer 4: Next.js Edge Middleware */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>4. Next.js Edge Middleware</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Requests are inspected at the server boundary before reaching route handlers. Generates cryptographically random `X-Request-Id` for end-to-end audit logging.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero-Trust Gateway verification</span>
              </div>
            </div>
          </div>

          {/* Interactive Threat Simulation Sandbox */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
              <Bug className="w-4 h-4 text-rose-600" />
              <span>Interactive Threat Simulation Sandbox</span>
            </div>
            <p className="text-slate-500 mb-3">
              Test the real-time security shield by injecting common attack vectors into the flight lookup input:
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  onSimulateThreat("<script>alert('xss')</script>");
                  onClose();
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg font-mono text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Test XSS Payload
              </button>

              <button
                type="button"
                onClick={() => {
                  onSimulateThreat("' OR '1'='1");
                  onClose();
                }}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-mono text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Test SQL Injection
              </button>

              <button
                type="button"
                onClick={() => {
                  onSimulateThreat("AA100; rm -rf /");
                  onClose();
                }}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg font-mono text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Test Command Injection
              </button>

              <button
                type="button"
                onClick={() => {
                  onSimulateThreat("FLIGHT_NUMBER_THAT_EXCEEDS_MAXIMUM_ALLOWED_LENGTH_SAFETY_LIMIT_OVERFLOW");
                  onClose();
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-mono text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Test Length Overflow
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            Close Security Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
