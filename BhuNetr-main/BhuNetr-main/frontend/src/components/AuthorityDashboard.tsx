import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  RefreshCw
} from 'lucide-react';

import { LanguageCode } from '../types';
import { getTranslation } from '../data/translations';

interface AuthorityDashboardProps {
  onNavigate: (page: string) => void;
  onSelectZoneForMap?: (zoneId: string) => void;
  selectedLanguage?: LanguageCode;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  onNavigate,
  onSelectZoneForMap,
  selectedLanguage = 'en'
}) => {
  const t = getTranslation(selectedLanguage);

  // 2. RISK SUMMARY DATA
  // Critical = red, High = orange, Watch = yellow, Normal = green
  const summaryCards = [
    {
      label: `${t.critical} (${t.currentRisk})`,
      count: '02',
      caption: 'Immediate attention',
      borderColor: 'border-red-200',
      badgeColor: 'bg-red-100 text-red-700 border-red-200',
      countColor: 'text-red-700'
    },
    {
      label: `${t.high} (${t.currentRisk})`,
      count: '05',
      caption: 'Closely monitored',
      borderColor: 'border-orange-200',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      countColor: 'text-orange-600'
    },
    {
      label: `${t.watch}`,
      count: '12',
      caption: 'Under observation',
      borderColor: 'border-yellow-200',
      badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      countColor: 'text-yellow-600'
    },
    {
      label: `${t.activeAlerts}`,
      count: '03',
      caption: 'Require attention',
      borderColor: 'border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      countColor: 'text-blue-700'
    }
  ];

  // 3. CURRENT HIGH RISK ZONES TABLE DATA
  const highRiskZones = [
    {
      location: 'Zone 04',
      state: 'Sikkim',
      risk: 'CRITICAL',
      probability: '91%',
      prediction: '12–24 hours',
      riskBadge: 'bg-red-600 text-white'
    },
    {
      location: 'Zone 12',
      state: 'Arunachal Pradesh',
      risk: 'HIGH',
      probability: '78%',
      prediction: '24–48 hours',
      riskBadge: 'bg-orange-500 text-white'
    },
    {
      location: 'Zone 07',
      state: 'Meghalaya',
      risk: 'WATCH',
      probability: '54%',
      prediction: '48 hours',
      riskBadge: 'bg-yellow-400 text-slate-900 font-bold'
    },
    {
      location: 'Zone 03',
      state: 'Nagaland',
      risk: 'HIGH',
      probability: '74%',
      prediction: '24–48 hours',
      riskBadge: 'bg-orange-500 text-white'
    }
  ];

  // 4. RISK MAP: Markers across North Eastern India
  const mapMarkers = [
    { id: 'z4', label: 'Zone 04 (Sikkim)', x: '18%', y: '36%', risk: '🔴 Critical', color: 'bg-red-600' },
    { id: 'z12', label: 'Zone 12 (Arunachal)', x: '74%', y: '25%', risk: '🟠 High', color: 'bg-orange-500' },
    { id: 'z7', label: 'Zone 07 (Meghalaya)', x: '36%', y: '68%', risk: '🟡 Watch', color: 'bg-yellow-400' },
    { id: 'z3', label: 'Zone 03 (Nagaland)', x: '82%', y: '56%', risk: '🟠 High', color: 'bg-orange-500' },
    { id: 'z1', label: 'Zone 01 (Assam)', x: '52%', y: '48%', risk: '🟢 Low', color: 'bg-emerald-600' },
    { id: 'z5', label: 'Zone 05 (Mizoram)', x: '68%', y: '84%', risk: '🟢 Low', color: 'bg-emerald-600' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

        {/* 1. DASHBOARD HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Risk Monitoring Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Monitor landslide risk, active warnings and vulnerable infrastructure across the North Eastern Region.
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Last updated: 2 minutes ago</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Authority</span>
            </span>
            <button
              id="authority-header-logout-btn"
              onClick={() => onNavigate('login')}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* 2. RISK SUMMARY */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-slate-900 rounded-2xl border ${card.borderColor} dark:border-slate-800 p-4 sm:p-5 shadow-2xs flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {card.label}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                    Active
                  </span>
                </div>
                <div className={`text-3xl sm:text-4xl font-black tracking-tight ${card.countColor}`}>
                  {card.count}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  {card.caption}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. CURRENT HIGH RISK ZONES */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                Current High Risk Zones
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Priority sectors classified by failure probability and imminent prediction window
              </p>
            </div>
            <button
              id="view-all-zones-btn"
              onClick={() => onNavigate('risk-map')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 text-xs font-bold transition-colors w-fit cursor-pointer"
            >
              <span>View All Zones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Location</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Risk</th>
                  <th className="py-3 px-4">Probability</th>
                  <th className="py-3 px-4">Prediction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {highRiskZones.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onNavigate('risk-map')}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">
                      {row.location}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {row.state}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${row.riskBadge}`}>
                        {row.risk}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                      {row.probability}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">
                      {row.prediction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. RISK MAP (Simplified North Eastern India Map Placeholder) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Landslide Risk Map
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                North Eastern India regional hazard distribution and sensor clusters
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Legend:</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">🟢 Low</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">🟡 Watch</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">🟠 High</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">🔴 Critical</span>
              </div>
            </div>
          </div>

          {/* Map canvas container */}
          <div className="mt-4 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-4 relative min-h-[300px] flex flex-col justify-between overflow-hidden">
            {/* Top map info */}
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 w-fit">
              <span className="font-semibold">North Eastern India Hazard Grid (8 States)</span>
            </div>

            {/* Simplified Map Area with Markers */}
            <div className="relative w-full h-[240px] my-2">
              <svg className="w-full h-full absolute inset-0 opacity-40 dark:opacity-20" viewBox="0 0 600 240">
                <path d="M 40,160 Q 120,60 220,120 T 420,70 T 560,140" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
                <path d="M 80,200 Q 180,100 280,160 T 480,110 T 580,180" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="50" y="70" fill="#94a3b8" fontSize="12" fontWeight="bold">Sikkim</text>
                <text x="360" y="50" fill="#94a3b8" fontSize="12" fontWeight="bold">Arunachal Pradesh</text>
                <text x="220" y="110" fill="#94a3b8" fontSize="12" fontWeight="bold">Assam</text>
                <text x="130" y="180" fill="#94a3b8" fontSize="12" fontWeight="bold">Meghalaya</text>
                <text x="440" y="130" fill="#94a3b8" fontSize="12" fontWeight="bold">Nagaland</text>
                <text x="340" y="210" fill="#94a3b8" fontSize="11">Mizoram</text>
                <text x="430" y="180" fill="#94a3b8" fontSize="11">Manipur</text>
              </svg>

              {/* Simplified Markers */}
              {mapMarkers.map((marker) => (
                <div
                  key={marker.id}
                  style={{ left: marker.x, top: marker.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
                  onClick={() => onNavigate('risk-map')}
                >
                  <span className={`w-4 h-4 rounded-full ${marker.color} border-2 border-white dark:border-slate-900 shadow-md flex items-center justify-center`}></span>
                  <span className="mt-1 text-[10px] font-bold px-1.5 py-0.5 bg-white/95 dark:bg-slate-900/95 rounded-md text-slate-800 dark:text-slate-200 shadow-2xs border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                    {marker.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom bar with View Full Map button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs p-2.5 rounded-lg">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Displaying 6 active sensor zones across Sikkim, Arunachal Pradesh, Meghalaya, and Nagaland.
              </span>
              <button
                id="view-full-map-btn"
                onClick={() => onNavigate('risk-map')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 5. ACTIVE ALERTS */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Active Alerts
              </h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                3 Active Advisories
              </span>
            </div>
            <button
              id="goto-alert-management-btn"
              onClick={() => onNavigate('alert-management')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 text-xs font-bold transition-colors w-fit cursor-pointer"
            >
              <span>Alert Management</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Alert 1: CRITICAL */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-red-200 dark:border-red-800/80 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-black">
                    <span>🔴</span>
                    <span>CRITICAL</span>
                  </span>
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
                    Prob: 91%
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  High landslide probability detected near NH-10, Sikkim.
                </p>

                <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div>Probability: <strong className="text-slate-900 dark:text-white">91%</strong></div>
                  <div>Expected: <strong className="text-slate-900 dark:text-white">Next 12–24 hours</strong></div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  id="view-alert-1-btn"
                  onClick={() => onNavigate('alerts')}
                  className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View</span>
                </button>
                <button
                  id="manage-alert-1-btn"
                  onClick={() => onNavigate('alert-management')}
                  className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Alert 2: HIGH */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-orange-200 dark:border-orange-800/80 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 text-xs font-black">
                    <span>🟠</span>
                    <span>HIGH</span>
                  </span>
                  <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                    Prob: 78%
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  Heavy rainfall detected in Arunachal Pradesh Zone 12.
                </p>

                <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div>Probability: <strong className="text-slate-900 dark:text-white">78%</strong></div>
                  <div>Expected: <strong className="text-slate-900 dark:text-white">Next 24–48 hours</strong></div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  id="view-alert-2-btn"
                  onClick={() => onNavigate('alerts')}
                  className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View</span>
                </button>
                <button
                  id="manage-alert-2-btn"
                  onClick={() => onNavigate('alert-management')}
                  className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Alert 3: WATCH */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-200 dark:border-amber-800/80 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-black">
                    <span>🟡</span>
                    <span>WATCH</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    Prob: 54%
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  Increased soil moisture detected in Meghalaya Zone 07.
                </p>

                <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div>Probability: <strong className="text-slate-900 dark:text-white">54%</strong></div>
                  <div>Expected: <strong className="text-slate-900 dark:text-white">Next 48 hours</strong></div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  id="view-alert-3-btn"
                  onClick={() => onNavigate('alerts')}
                  className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View</span>
                </button>
                <button
                  id="manage-alert-3-btn"
                  onClick={() => onNavigate('alert-management')}
                  className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-slate-900 bg-amber-400 hover:bg-amber-500 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. INFRASTRUCTURE AT RISK */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Infrastructure at Risk
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Key transport and institutional assets surveyed within alert corridors
              </p>
            </div>

            <button
              id="view-infrastructure-risk-btn"
              onClick={() => onNavigate('infrastructure-risk')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 text-xs font-bold transition-colors w-fit cursor-pointer"
            >
              <span>View Infrastructure Risk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {/* 🛣 Roads */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-xs font-bold">🛣 Roads</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                12
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">12 at risk</span>
            </div>

            {/* 🌉 Bridges */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-xs font-bold">🌉 Bridges</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                4
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">4 at risk</span>
            </div>

            {/* 🏫 Schools */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-xs font-bold">🏫 Schools</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                3
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">3 at risk</span>
            </div>

            {/* 🏥 Hospitals */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-xs font-bold">🏥 Hospitals</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                1
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">1 at risk</span>
            </div>
          </div>
        </div>

        {/* 7. QUICK ACTIONS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* View Critical Zones */}
            <button
              id="action-view-critical-zones-btn"
              onClick={() => onNavigate('risk-map')}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 bg-white dark:bg-slate-800 hover:bg-red-50/50 dark:hover:bg-red-950/30 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
            >
              <span className="text-lg leading-none">⚠️</span>
              <span>{t.critical}</span>
            </button>

            {/* Manage Alerts */}
            <button
              id="action-manage-alerts-btn"
              onClick={() => onNavigate('alert-management')}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
            >
              <span className="text-lg leading-none">📢</span>
              <span>{t.alertManagement}</span>
            </button>

            {/* View Risk Map */}
            <button
              id="action-view-risk-map-btn"
              onClick={() => onNavigate('risk-map')}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
            >
              <span className="text-lg leading-none">🗺️</span>
              <span>{t.riskMap}</span>
            </button>

            {/* Emergency Response */}
            <button
              id="action-emergency-response-btn"
              onClick={() => onNavigate('emergency')}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 bg-white dark:bg-slate-800 hover:bg-red-50/50 dark:hover:bg-red-950/30 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
            >
              <span className="text-lg leading-none">🚨</span>
              <span>{t.emergencyHelp}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
