import React, { useState } from 'react';
import {
  Navigation,
  MapPin,
  AlertTriangle,
  Home,
  Hospital,
  Flame,
  LifeBuoy,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Phone,
  Compass,
  CornerDownRight,
  Info,
  X
} from 'lucide-react';

interface SafeRoutesPageProps {
  onNavigate: (page: string) => void;
}

export const SafeRoutesPage: React.FC<SafeRoutesPageProps> = ({ onNavigate }) => {
  const [selectedFacility, setSelectedFacility] = useState<'shelter' | 'hospital' | 'services'>('shelter');
  const [routeViewMode, setRouteViewMode] = useState<boolean>(true);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const handleFacilityAction = (facilityName: string, actionType: string) => {
    setFeedbackNotice(`${actionType}: Routing to ${facilityName}`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ==================================================
            1. PAGE HEADER
            ================================================== */}
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Safe Routes
            </h1>
            {/* Subtitle */}
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Find the nearest safe route and emergency shelter.
            </p>
          </div>

          {/* Location Badge & Emergency Help quick jump */}
          <div className="flex items-center gap-2.5">
            {/* Show current mock location: 📍 Gangtok, Sikkim */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>📍 Gangtok, Sikkim</span>
            </div>

            <button
              id="safe-routes-emergency-jump-btn"
              onClick={() => onNavigate('emergency')}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Emergency Help</span>
            </button>
          </div>
        </div>

        {/* ==================================================
            PROMINENT WARNING: 🟠 HIGH RISK AREA
            "Some routes near your location may be unsafe due to landslide risk."
            ================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-300 dark:border-orange-800/80 text-orange-900 dark:text-orange-200 flex items-start gap-3.5 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-orange-200 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-orange-700 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm sm:text-base font-black text-orange-950 dark:text-orange-200 tracking-wide uppercase">
                🟠 HIGH RISK AREA
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-200/80 dark:bg-orange-900/80 text-[11px] font-bold text-orange-900 dark:text-orange-300">
                Landslide Hazard Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-orange-900 dark:text-orange-200 font-medium mt-1 leading-relaxed">
              Some routes near your location may be unsafe due to landslide risk.
            </p>
          </div>
        </div>

        {/* Temporary Feedback Notification */}
        {feedbackNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{feedbackNotice}</span>
            </span>
            <button
              onClick={() => setFeedbackNotice(null)}
              className="p-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ==================================================
            4. SAFE ROUTE INFORMATION (RECOMMENDED ROUTE)
            ================================================== */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Primary Evacuation Corridor
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                Recommended Route
              </h2>
            </div>

            {/* Status: 🟢 SAFE */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 self-start sm:self-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wide">
                🟢 SAFE
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 my-4">
            {/* Distance: 2.1 km */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Distance</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                2.1 km
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">To Community Hall</span>
            </div>

            {/* Estimated Time: 12 min */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Estimated Time</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>12 min</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Vehicular / 22 min walk</span>
            </div>

            {/* Pathway Status */}
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Corridor Condition</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                Indira Bypass Link
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Active Police Escort</span>
            </div>
          </div>

          {/* Warning: "Avoid NH-10 near the high-risk zone." */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Avoid NH-10 near the high-risk zone. Rockfall & mudflow reported.</span>
          </div>

          {/* Button: "View Route" */}
          <button
            id="view-recommended-route-btn"
            onClick={() => {
              setSelectedFacility('shelter');
              setRouteViewMode(true);
              handleFacilityAction('Gangtok Community Hall', 'Highlighted Route');
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>View Route</span>
          </button>
        </div>

        {/* ==================================================
            2. SAFE ROUTE MAP (VISUALIZATION MOCKUP)
            ================================================== */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Safe Route Navigation Map
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Visualizing safe bypass path connecting your location to Gangtok Community Hall shelter.
              </p>
            </div>

            {/* Target Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-center">
              <button
                onClick={() => setSelectedFacility('shelter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedFacility === 'shelter'
                    ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🏠 Shelter
              </button>
              <button
                onClick={() => setSelectedFacility('hospital')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedFacility === 'hospital'
                    ? 'bg-white dark:bg-slate-700 text-blue-800 dark:text-blue-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🏥 Hospital
              </button>
              <button
                onClick={() => setSelectedFacility('services')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedFacility === 'services'
                    ? 'bg-white dark:bg-slate-700 text-red-800 dark:text-red-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🚒 Services
              </button>
            </div>
          </div>

          {/* Legend Items */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-200 dark:ring-blue-900"></span>
              <span>📍 Your Location</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span>🟠 High Risk Zone</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span>🔴 Blocked Road</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span>🟢 Safe Route</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-700 dark:text-emerald-400">🏠</span>
              <span>Safe Shelter</span>
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 overflow-hidden relative">
            <svg
              viewBox="0 0 760 380"
              className="w-full h-auto max-h-[380px] select-none"
              style={{ minHeight: '260px' }}
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="safe-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeOpacity="0.2" strokeWidth="0.75" />
                </pattern>

                {/* High Risk Zone Radial Gradient */}
                <radialGradient id="highRiskGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#f97316" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                </radialGradient>

                {/* Shelter Glow */}
                <radialGradient id="shelterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              {/* Grid Background */}
              <rect width="760" height="380" fill="url(#safe-grid)" rx="12" />

              {/* Terrain Contour Elevation Shapes (Gangtok Hills) */}
              <path
                d="M 20,60 Q 200,30 420,50 T 740,40 L 740,360 L 20,360 Z"
                fill="#f8fafc"
                className="dark:fill-slate-900"
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
              <path
                d="M 60,110 Q 240,80 460,95 T 720,80 L 720,340 L 60,340 Z"
                fill="#f1f5f9"
                className="dark:fill-slate-800/80"
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4,4"
              />

              {/* ----------------------------------------------------
                  🟠 HIGH RISK ZONE (NH-10 Landslide Hazard Slip Area)
                  ---------------------------------------------------- */}
              <ellipse cx="360" cy="180" rx="140" ry="85" fill="url(#highRiskGradient)" />
              <ellipse
                cx="360"
                cy="180"
                rx="140"
                ry="85"
                fill="none"
                stroke="#f97316"
                strokeWidth="1.5"
                strokeDasharray="5,4"
              />

              {/* High Risk Zone Label */}
              <g transform="translate(360, 180)">
                <rect x="-85" y="-14" width="170" height="28" rx="6" fill="#fff7ed" stroke="#fdba74" strokeWidth="1" />
                <text x="0" y="4" fill="#c2410c" fontSize="11" fontWeight="bold" textAnchor="middle">
                  🟠 HIGH RISK ZONE (Rockfall)
                </text>
              </g>

              {/* ----------------------------------------------------
                  🔴 BLOCKED ROAD (NH-10 Direct Highway segment)
                  ---------------------------------------------------- */}
              <path
                d="M 170,220 L 270,185 L 420,175 L 560,170"
                stroke="#ef4444"
                strokeWidth="6"
                strokeDasharray="8,5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Blocked Road Warning Sign */}
              <g transform="translate(340, 145)">
                <rect x="-70" y="-12" width="140" height="24" rx="6" fill="#fee2e2" stroke="#f87171" strokeWidth="1" />
                <text x="0" y="3" fill="#b91c1c" fontSize="10" fontWeight="bold" textAnchor="middle">
                  🔴 BLOCKED: NH-10 Corridor
                </text>
              </g>

              {/* ----------------------------------------------------
                  🟢 SAFE ROUTE (Indira Bypass to Community Hall)
                  ---------------------------------------------------- */}
              <path
                d="M 170,220 L 220,290 L 360,310 L 510,270 L 590,200 L 610,135"
                stroke="#10b981"
                strokeWidth="12"
                strokeOpacity="0.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 170,220 L 220,290 L 360,310 L 510,270 L 590,200 L 610,135"
                stroke="#16a34a"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Path Route Waypoints */}
              <circle cx="220" cy="290" r="4" fill="#16a34a" stroke="#ffffff" strokeWidth="1.5" />
              <text x="220" y="315" fill="#15803d" fontSize="10" fontWeight="bold" textAnchor="middle">
                Tibet Road Turn
              </text>

              <circle cx="360" cy="310" r="4" fill="#16a34a" stroke="#ffffff" strokeWidth="1.5" />
              <text x="360" y="335" fill="#15803d" fontSize="10" fontWeight="bold" textAnchor="middle">
                Indira Bypass (Cleared & Patrolled)
              </text>

              <circle cx="510" cy="270" r="4" fill="#16a34a" stroke="#ffffff" strokeWidth="1.5" />
              <text x="510" y="295" fill="#15803d" fontSize="10" fontWeight="bold" textAnchor="middle">
                Ridge Crossing
              </text>

              {/* ----------------------------------------------------
                  📍 YOUR LOCATION PIN
                  ---------------------------------------------------- */}
              <g transform="translate(170, 220)">
                <circle r="16" fill="#3b82f6" opacity="0.25" className="animate-pulse" />
                <circle r="9" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                <rect x="-55" y="-36" width="110" height="26" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="0" y="-19" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  📍 Your Location
                </text>
                <text x="0" y="-8" fill="#93c5fd" fontSize="8" fontWeight="600" textAnchor="middle">
                  Gangtok Sector 4
                </text>
              </g>

              {/* ----------------------------------------------------
                  🏠 SAFE SHELTER (Gangtok Community Hall)
                  ---------------------------------------------------- */}
              <circle cx="610" cy="135" r="30" fill="url(#shelterGlow)" />
              <g transform="translate(610, 135)">
                <circle r="12" fill="#16a34a" stroke="#ffffff" strokeWidth="2.5" />
                <rect x="-80" y="-42" width="160" height="32" rx="6" fill="#14532d" stroke="#16a34a" strokeWidth="1.5" />
                <text x="0" y="-23" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  🏠 Gangtok Community Hall
                </text>
                <text x="0" y="-12" fill="#86efac" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  Safe Shelter (1.8 km) • Open
                </text>
              </g>

              {/* 🏥 Secondary Marker: District Hospital (2.4 km) */}
              <g transform="translate(660, 260)">
                <circle r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <rect x="-65" y="-30" width="130" height="22" rx="5" fill="#1e3a8a" />
                <text x="0" y="-16" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  🏥 District Hospital (2.4 km)
                </text>
              </g>

              {/* 🚒 Secondary Marker: Emergency Centre (3.2 km) */}
              <g transform="translate(480, 75)">
                <circle r="7" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                <rect x="-75" y="-28" width="150" height="20" rx="5" fill="#7f1d1d" />
                <text x="0" y="-15" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  🚒 Response Centre (3.2 km)
                </text>
              </g>
            </svg>

            {/* Map bottom note */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
              <span className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Indira Bypass is confirmed active and clear by SDRF ground patrol.</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                Elevation Gain: +85 m • Surface: Asphalt
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            3. NEAREST SAFE FACILITIES (THREE SIMPLE CARDS)
            ================================================== */}
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Nearest Safe Facilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: 🏠 Nearest Shelter */}
            <div className={`bg-white dark:bg-slate-900 rounded-2xl border-2 p-5 shadow-2xs flex flex-col justify-between transition-all ${
              selectedFacility === 'shelter' ? 'border-emerald-600 ring-2 ring-emerald-100 dark:ring-emerald-950' : 'border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                      🏠
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Nearest Shelter
                    </span>
                  </div>
                  {/* Status: Open */}
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] font-black text-emerald-700 dark:text-emerald-300 uppercase">
                    Open
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Gangtok Community Hall
                  </h3>
                  {/* 1.8 km */}
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                    1.8 km
                  </div>
                  {/* Capacity: 500 people */}
                  <div className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Capacity: <span className="font-bold text-slate-900 dark:text-white">500 people</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Food, clean drinking water, emergency generators & medical post.
                  </div>
                </div>
              </div>

              {/* Button: "View Route" */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  id="shelter-view-route-btn"
                  onClick={() => {
                    setSelectedFacility('shelter');
                    handleFacilityAction('Gangtok Community Hall', 'Navigation set');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View Route</span>
                </button>
              </div>
            </div>

            {/* Card 2: 🏥 Nearest Hospital */}
            <div className={`bg-white dark:bg-slate-900 rounded-2xl border-2 p-5 shadow-2xs flex flex-col justify-between transition-all ${
              selectedFacility === 'hospital' ? 'border-blue-600 ring-2 ring-blue-100 dark:ring-blue-950' : 'border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                      🏥
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Nearest Hospital
                    </span>
                  </div>
                  {/* Emergency: Available */}
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[11px] font-black text-blue-700 dark:text-blue-300 uppercase">
                    Available
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    District Hospital
                  </h3>
                  {/* 2.4 km */}
                  <div className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1">
                    2.4 km
                  </div>
                  {/* Emergency: Available */}
                  <div className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Emergency: <span className="font-bold text-slate-900 dark:text-white">Available</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    24/7 Trauma ward, ambulance fleet and oxygen reserves on standby.
                  </div>
                </div>
              </div>

              {/* Button: "Get Directions" */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  id="hospital-get-directions-btn"
                  onClick={() => {
                    setSelectedFacility('hospital');
                    handleFacilityAction('District Hospital', 'Directions Loaded');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>

            {/* Card 3: 🚒 Emergency Services */}
            <div className={`bg-white dark:bg-slate-900 rounded-2xl border-2 p-5 shadow-2xs flex flex-col justify-between transition-all ${
              selectedFacility === 'services' ? 'border-red-600 ring-2 ring-red-100 dark:ring-red-950' : 'border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">
                      🚒
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Emergency Services
                    </span>
                  </div>
                  {/* Status: Available */}
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-[11px] font-black text-red-700 dark:text-red-300 uppercase">
                    Available
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Local Emergency Response Centre
                  </h3>
                  {/* 3.2 km */}
                  <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">
                    3.2 km
                  </div>
                  {/* Status: Available */}
                  <div className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Status: <span className="font-bold text-slate-900 dark:text-white">Available</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    SDRF Rapid Action Taskforce, earth movers & disaster relief unit.
                  </div>
                </div>
              </div>

              {/* Button: "Contact" */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  id="services-contact-btn"
                  onClick={() => {
                    setSelectedFacility('services');
                    onNavigate('emergency');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span>Contact</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            QUICK NAVIGATION ACTIONS
            ================================================== */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
            <span className="font-bold text-slate-800 dark:text-slate-200">Need immediate intervention?</span> Emergency helplines and triage are available 24/7.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('emergency')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              Open Emergency Help
            </button>
            <button
              onClick={() => onNavigate('citizen-dashboard')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              Citizen Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
