import React, { useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  Clock,
  Navigation,
  LifeBuoy,
  X,
  CheckCircle2,
  ShieldAlert,
  Droplets,
  CloudRain,
  Mountain,
  Compass,
  ArrowRight,
  History,
  Eye,
  Check,
  Calendar,
  Users,
  AlertCircle
} from 'lucide-react';
import { useAlerts, UnifiedAlert, AlertLevel } from '../context/AlertsContext';

interface AlertsPageProps {
  onNavigate: (page: string) => void;
  onSelectZoneForMap?: (zoneId: string) => void;
  currentRole?: 'citizen' | 'authority' | 'superadmin';
}

// Backward compatibility types
export type AlertData = UnifiedAlert;
export interface AlertHistoryItem {
  date: string;
  location: string;
  risk: string;
  status: 'Active' | 'Resolved';
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  onNavigate,
  onSelectZoneForMap,
  currentRole = 'citizen'
}) => {
  const { alerts, activeAlerts, resolvedAlerts, markAsRead } = useAlerts();

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Emergency' | 'Warning' | 'Watch' | 'Normal'>('All');
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [activeModalAlert, setActiveModalAlert] = useState<UnifiedAlert | null>(null);

  // Filter alerts based on selection
  const filteredActiveAlerts = activeAlerts.filter((alert) => {
    if (selectedFilter === 'All') return true;
    return alert.level === selectedFilter;
  });

  const handleOpenDetails = (alert: UnifiedAlert) => {
    setActiveModalAlert(alert);
    if (!alert.isRead) {
      markAsRead(alert.id);
    }
  };

  const handleViewLocation = (zoneId?: string) => {
    if (zoneId && onSelectZoneForMap) {
      onSelectZoneForMap(zoneId);
    }
    onNavigate('risk-map');
  };

  const getLevelBadge = (level: AlertLevel) => {
    switch (level) {
      case 'Emergency':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black tracking-wide uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>🔴 EMERGENCY</span>
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-black tracking-wide uppercase shadow-xs">
            <span>🟠 WARNING</span>
          </span>
        );
      case 'Watch':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black tracking-wide uppercase shadow-xs">
            <span>🟡 WATCH</span>
          </span>
        );
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black tracking-wide uppercase shadow-xs">
            <span>🟢 NORMAL</span>
          </span>
        );
    }
  };

  const getBorderClass = (level: AlertLevel) => {
    switch (level) {
      case 'Emergency':
        return 'border-2 border-red-500 hover:border-red-600 shadow-sm';
      case 'Warning':
        return 'border-2 border-orange-400 hover:border-orange-500 shadow-2xs';
      case 'Watch':
        return 'border border-amber-300 dark:border-amber-700/60 hover:border-amber-400 shadow-2xs';
      case 'Normal':
        return 'border border-emerald-300 dark:border-emerald-700/60 shadow-2xs';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ==================================================
            1. PAGE HEADER
            Title: "Alerts & Warnings"
            Subtitle: "View active landslide warnings and safety advisories for monitored areas."
            Show: "X Active Alerts"
            Filter: All, Emergency, Warning, Watch, Normal
            ================================================== */}
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Alerts & Warnings
              </h1>
              {/* Badge: Active Alerts Count */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span>{activeAlerts.length} Active Alerts</span>
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Real-time multi-hazard telemetry warnings and automated safety advisories for North-Eastern hill states.
            </p>
          </div>

          {/* Quick Route / Emergency Jump */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="alerts-find-safe-route-header-btn"
              onClick={() => onNavigate('safe-routes')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Find Safe Route</span>
            </button>
            <button
              id="alerts-emergency-help-header-btn"
              onClick={() => onNavigate('emergency')}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Emergency Help</span>
            </button>
          </div>
        </div>

        {/* View Mode Toggle: Active Alerts vs Alert History */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl">
          <div className="flex items-center gap-1">
            <button
              id="alerts-tab-active-btn"
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Active Alerts ({activeAlerts.length})</span>
            </button>
            <button
              id="alerts-tab-history-btn"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="w-4 h-4 text-emerald-500" />
              <span>Alert History ({resolvedAlerts.length})</span>
            </button>
          </div>

          <div className="px-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            {currentRole === 'authority' || currentRole === 'superadmin' ? (
              <span className="font-semibold text-slate-700 dark:text-slate-300">🏛️ Authority Monitoring Console</span>
            ) : (
              <span className="font-semibold text-slate-700 dark:text-slate-300">👤 Monitored Area: Sikkim (Zone 04)</span>
            )}
          </div>
        </div>

        {/* ACTIVE ALERTS VIEW */}
        {activeTab === 'active' && (
          <div className="space-y-5">
            {/* Filter Pills: All, Emergency, Warning, Watch, Normal */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">Filter by Level:</span>
                {(['All', 'Emergency', 'Warning', 'Watch', 'Normal'] as const).map((filter) => {
                  const isSelected = selectedFilter === filter;
                  const count =
                    filter === 'All'
                      ? activeAlerts.length
                      : activeAlerts.filter((a) => a.level === filter).length;

                  return (
                    <button
                      key={filter}
                      id={`filter-${filter.toLowerCase()}-btn`}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{filter}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {currentRole === 'citizen' && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  Showing alerts sorted by urgency level
                </span>
              )}
            </div>

            {/* List of Alerts */}
            {filteredActiveAlerts.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No Active Alerts Matching "{selectedFilter}"
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  All monitored sensors in this category report safe slope equilibrium and normal precipitation.
                </p>
                <button
                  onClick={() => setSelectedFilter('All')}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Show All Alerts
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActiveAlerts.map((alert) => {
                  const isEmergency = alert.level === 'Emergency';
                  const isWarning = alert.level === 'Warning';

                  return (
                    <div
                      key={alert.id}
                      id={`alert-card-${alert.id}`}
                      className={`bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 transition-all duration-200 ${getBorderClass(
                        alert.level
                      )}`}
                    >
                      {/* Top Bar: Level, ID, Badge, Timestamp */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getLevelBadge(alert.level)}

                          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold">
                            {alert.id}
                          </span>

                          {alert.isCurrentArea && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                              📍 Monitored Local Area
                            </span>
                          )}

                          {!alert.isRead && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                              New
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{alert.timestamp}</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] uppercase ${
                            alert.currentStep === 'Action Taken'
                              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                              : alert.currentStep === 'Team Assigned'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                          }`}>
                            {alert.currentStep}
                          </span>
                        </div>
                      </div>

                      {/* Main Title & Affected Highway */}
                      <div className="mt-3">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {alert.title}
                        </h2>
                        {alert.affectedRoad && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                            Corridor: <span className="font-bold text-slate-700 dark:text-slate-300">{alert.affectedRoad}</span>
                          </p>
                        )}
                      </div>

                      {/* Metrics Grid: Location, Probability, Expected, Slope/Rainfall */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        {/* Location */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Location
                          </span>
                          <div className="text-sm font-black text-slate-900 dark:text-white mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            <span className="truncate">{alert.location}</span>
                          </div>
                        </div>

                        {/* Landslide Probability */}
                        <div className={`p-3 rounded-xl border ${
                          isEmergency
                            ? 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'
                            : isWarning
                            ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50'
                            : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                        }`}>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                            Risk Probability
                          </span>
                          <div className={`text-2xl font-black mt-0.5 ${
                            isEmergency
                              ? 'text-red-600 dark:text-red-400'
                              : isWarning
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {alert.probability}%
                          </div>
                        </div>

                        {/* Expected Window */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Prediction Window
                          </span>
                          <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{alert.expectedTime}</span>
                          </div>
                        </div>

                        {/* Cause / Slope */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Slope / Rainfall
                          </span>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 leading-snug">
                            {alert.slope} • {alert.rainfall}
                          </div>
                        </div>
                      </div>

                      {/* Recommended Safety Action Box */}
                      <div className={`p-3.5 rounded-xl border mt-3 flex items-start gap-2.5 ${
                        isEmergency
                          ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-950 dark:text-red-200'
                          : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-950 dark:text-amber-200'
                      }`}>
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <div className="text-xs sm:text-sm font-medium leading-relaxed">
                          <span className="font-bold">Recommended Safety Action: </span>
                          <span>{alert.recommendedAction}</span>
                        </div>
                      </div>

                      {/* Authority status badge if action in progress */}
                      {alert.assignedTeam && (
                        <div className="mt-3 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs flex flex-wrap items-center justify-between gap-2 text-blue-900 dark:text-blue-200">
                          <span className="font-bold flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Assigned Response: {alert.assignedTeam}</span>
                          </span>
                          {alert.responseAction !== 'No Action' && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[11px]">
                              Active Action: {alert.responseAction}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Card Actions Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          id={`alert-details-btn-${alert.id}`}
                          onClick={() => handleOpenDetails(alert)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Complete Details</span>
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                          {(currentRole === 'authority' || currentRole === 'superadmin') && (
                            <button
                              id={`alert-manage-btn-${alert.id}`}
                              onClick={() => onNavigate('alert-management')}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                              <span>Manage in Console</span>
                            </button>
                          )}

                          {/* View Location */}
                          <button
                            id={`alert-view-location-btn-${alert.id}`}
                            onClick={() => handleViewLocation(alert.zoneId)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>View Location</span>
                          </button>

                          {/* Find Safe Route */}
                          <button
                            id={`alert-safe-route-btn-${alert.id}`}
                            onClick={() => onNavigate('safe-routes')}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Find Safe Route</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ALERT HISTORY VIEW */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Alert History & Resolved Logs</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chronological log of verified, managed, and resolved landslide advisories across all monitored sectors.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                Total Logs: {resolvedAlerts.length}
              </span>
            </div>

            {resolvedAlerts.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs">
                No archived alerts in this session.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Alert ID</th>
                      <th className="py-2.5 px-3">Location & Corridor</th>
                      <th className="py-2.5 px-3">Severity</th>
                      <th className="py-2.5 px-3">Resolution Note</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {resolvedAlerts.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {item.id}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{item.location}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.state}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {item.level} ({item.probability}%)
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {item.resolutionNote || 'All clear verified.'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Resolved</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            id={`history-view-btn-${item.id}`}
                            onClick={() => handleOpenDetails(item)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Quick Navigation Footer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
            <span className="font-bold text-slate-800 dark:text-slate-200">Need real-time safe navigation?</span> Safe routes automatically avoid all active red/orange hazard zones.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('safe-routes')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              Safe Routes
            </button>
            <button
              onClick={() => onNavigate('emergency')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              Emergency Help
            </button>
          </div>
        </div>

      </div>

      {/* ==================================================
          COMPLETE DETAILS MODAL
          Required fields:
          - Alert level
          - Location
          - Risk probability
          - Rainfall
          - Soil moisture
          - Slope
          - Prediction window
          - Timestamp
          - Recommended safety action
          ================================================== */}
      {activeModalAlert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Telemetry Alert Report
                  </span>
                  {getLevelBadge(activeModalAlert.level)}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {activeModalAlert.title}
                </h3>
              </div>
              <button
                id="alert-modal-close-btn"
                onClick={() => setActiveModalAlert(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Close details modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Fields (9 mandatory parameters) */}
            <div className="space-y-3 text-xs">
              {/* Top Details Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Alert Level */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                    Alert Level
                  </span>
                  <span className={`text-sm font-black mt-0.5 block ${
                    activeModalAlert.level === 'Emergency'
                      ? 'text-red-600 dark:text-red-400'
                      : activeModalAlert.level === 'Warning'
                      ? 'text-orange-600 dark:text-orange-400'
                      : activeModalAlert.level === 'Watch'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {activeModalAlert.level.toUpperCase()}
                  </span>
                </div>

                {/* 2. Location */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                    Location & State
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                    {activeModalAlert.location}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {activeModalAlert.state} • Zone ID: {activeModalAlert.zoneId}
                  </span>
                </div>

                {/* 3. Risk Probability */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                    Risk Probability
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {activeModalAlert.probability}%
                    </span>
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          activeModalAlert.probability >= 80
                            ? 'bg-red-600'
                            : activeModalAlert.probability >= 60
                            ? 'bg-orange-500'
                            : activeModalAlert.probability >= 40
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${activeModalAlert.probability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* 4. Prediction Window */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                    Prediction Window
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{activeModalAlert.expectedTime}</span>
                  </span>
                </div>

                {/* 5. Rainfall */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                    Rainfall Accumulation
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                    <span>{activeModalAlert.rainfall}</span>
                  </span>
                </div>

                {/* 6. Soil Moisture */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                    Soil Moisture
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    <span>{activeModalAlert.soilMoisture}</span>
                  </span>
                </div>

                {/* 7. Slope */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                    Terrain Slope
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5 text-amber-600" />
                    <span>{activeModalAlert.slope}</span>
                  </span>
                </div>

                {/* 8. Timestamp */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                    Telemetry Timestamp
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {activeModalAlert.timestamp}
                  </span>
                </div>
              </div>

              {/* Status & Cause */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">Workflow Status:</span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {activeModalAlert.isResolved ? 'Resolved' : activeModalAlert.currentStep}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Geological Trigger: </span>
                  <span>{activeModalAlert.cause}</span>
                </div>
              </div>

              {/* 9. Recommended Safety Action */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                  Recommended Safety Action
                </span>
                <p className="leading-relaxed font-semibold">
                  {activeModalAlert.recommendedAction}
                </p>
              </div>

              {/* Resolution Note if resolved */}
              {activeModalAlert.isResolved && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs">
                  <span className="font-bold block">Resolution Notice:</span>
                  <span>{activeModalAlert.resolutionNote || 'Hazard evaluated and cleared by Disaster Management cell.'}</span>
                </div>
              )}
            </div>

            {/* Modal Navigation Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
              {(currentRole === 'authority' || currentRole === 'superadmin') && (
                <button
                  id="modal-manage-alert-btn"
                  onClick={() => {
                    setActiveModalAlert(null);
                    onNavigate('alert-management');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Authority Actions</span>
                </button>
              )}

              {/* View on Risk Map */}
              <button
                id="modal-view-risk-map-btn"
                onClick={() => {
                  setActiveModalAlert(null);
                  handleViewLocation(activeModalAlert.zoneId);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>View on Risk Map</span>
              </button>

              {/* Find Safe Route */}
              <button
                id="modal-find-safe-route-btn"
                onClick={() => {
                  setActiveModalAlert(null);
                  onNavigate('safe-routes');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Find Safe Route</span>
              </button>

              {/* Emergency Help */}
              <button
                id="modal-emergency-help-btn"
                onClick={() => {
                  setActiveModalAlert(null);
                  onNavigate('emergency');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>Emergency Help</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
