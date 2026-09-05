import React, { useState, useEffect } from 'react';
import { useAlerts } from '../context/AlertsContext';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Search,
  Check,
  X,
  Radio,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  CloudRain,
  Droplets,
  Thermometer,
  Compass,
  History,
  AlertOctagon,
  LifeBuoy,
  FileCheck
} from 'lucide-react';

interface AuthorityAlertManagementProps {
  onNavigate?: (page: string) => void;
  selectedAlertId?: string;
}

export interface ManagementAlert {
  id: string; // LS-2026-004
  level: 'Critical' | 'High' | 'Watch' | 'Resolved';
  levelLabel: string;
  title: string;
  location: string;
  zoneCode: string;
  probability: number;
  expected: string;
  status: 'Awaiting Action' | 'Acknowledged' | 'Under Observation' | 'Action In Progress' | 'Resolved';
  environmental: {
    rainfall: string;
    soilMoisture: string;
    temperature: string;
    slope: string;
    historicalLandslides: string;
  };
  timeline: {
    alertGenerated: boolean;
    authorityNotified: boolean;
    alertAcknowledged: boolean;
    responseTeamAssigned: boolean;
    fieldVerification: 'pending' | 'requested' | 'verified';
    actionTaken: 'pending' | 'road_closed' | 'evacuation_started' | 'both';
    resolved: boolean;
  };
  responseTeam: {
    team: string;
    officer: string;
    status: 'Available' | 'Assigned';
  };
  fieldVerificationStatus: 'Pending' | 'Verification Requested' | 'Verified';
  emergencyActions: {
    roadClosure: boolean;
    evacuation: boolean;
  };
  isResolved: boolean;
  resolvedMessage?: string;
}

const INITIAL_ALERTS: ManagementAlert[] = [
  // ALERT 1: CRITICAL
  {
    id: 'LS-2026-004',
    level: 'Critical',
    levelLabel: '🔴 CRITICAL',
    title: 'Critical Landslide Risk Detected',
    location: 'Zone 04, Sikkim',
    zoneCode: 'Zone 04',
    probability: 91,
    expected: 'Next 12–24 Hours',
    status: 'Awaiting Action',
    environmental: {
      rainfall: '92 mm / 24h',
      soilMoisture: '81%',
      temperature: '24°C',
      slope: '37°',
      historicalLandslides: 'Moderate'
    },
    timeline: {
      alertGenerated: true,
      authorityNotified: true,
      alertAcknowledged: false,
      responseTeamAssigned: false,
      fieldVerification: 'pending',
      actionTaken: 'pending',
      resolved: false
    },
    responseTeam: {
      team: 'District Disaster Response Team',
      officer: 'Duty Officer',
      status: 'Available'
    },
    fieldVerificationStatus: 'Pending',
    emergencyActions: {
      roadClosure: false,
      evacuation: false
    },
    isResolved: false
  },
  // ALERT 2: HIGH
  {
    id: 'LS-2026-003',
    level: 'High',
    levelLabel: '🟠 HIGH',
    title: 'High Landslide Risk',
    location: 'Zone 12, Arunachal Pradesh',
    zoneCode: 'Zone 12',
    probability: 78,
    expected: 'Next 24–48 Hours',
    status: 'Acknowledged',
    environmental: {
      rainfall: '68 mm / 24h',
      soilMoisture: '74%',
      temperature: '21°C',
      slope: '32°',
      historicalLandslides: 'High'
    },
    timeline: {
      alertGenerated: true,
      authorityNotified: true,
      alertAcknowledged: true,
      responseTeamAssigned: false,
      fieldVerification: 'pending',
      actionTaken: 'pending',
      resolved: false
    },
    responseTeam: {
      team: 'District Disaster Response Team',
      officer: 'Duty Officer',
      status: 'Available'
    },
    fieldVerificationStatus: 'Pending',
    emergencyActions: {
      roadClosure: false,
      evacuation: false
    },
    isResolved: false
  },
  // ALERT 3: WATCH
  {
    id: 'LS-2026-002',
    level: 'Watch',
    levelLabel: '🟡 WATCH',
    title: 'Increased Landslide Risk',
    location: 'Zone 07, Meghalaya',
    zoneCode: 'Zone 07',
    probability: 54,
    expected: 'Next 48 Hours',
    status: 'Under Observation',
    environmental: {
      rainfall: '42 mm / 24h',
      soilMoisture: '65%',
      temperature: '26°C',
      slope: '28°',
      historicalLandslides: 'Low'
    },
    timeline: {
      alertGenerated: true,
      authorityNotified: true,
      alertAcknowledged: false,
      responseTeamAssigned: false,
      fieldVerification: 'pending',
      actionTaken: 'pending',
      resolved: false
    },
    responseTeam: {
      team: 'District Disaster Response Team',
      officer: 'Duty Officer',
      status: 'Available'
    },
    fieldVerificationStatus: 'Pending',
    emergencyActions: {
      roadClosure: false,
      evacuation: false
    },
    isResolved: false
  }
];

export const AuthorityAlertManagement: React.FC<AuthorityAlertManagementProps> = ({
  onNavigate,
  selectedAlertId
}) => {
  const {
    acknowledgeAlert: ctxAcknowledgeAlert,
    assignResponseTeam: ctxAssignTeam,
    updateFieldVerification: ctxUpdateFieldVerification,
    setResponseAction: ctxSetResponseAction,
    resolveAlert: ctxResolveAlert
  } = useAlerts();

  const [alerts, setAlerts] = useState<ManagementAlert[]>(INITIAL_ALERTS);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Critical' | 'High' | 'Watch' | 'Resolved'>('All');
  const [selectedId, setSelectedId] = useState<string>(selectedAlertId || 'LS-2026-004');
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  // Dialog State for Confirmation
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    actionType: 'road_closure' | 'evacuation';
    zone: string;
  } | null>(null);

  // Active Alert selected for management
  const activeAlert = alerts.find((a) => a.id === selectedId) || alerts[0];

  const showBanner = (msg: string) => {
    setFeedbackBanner(msg);
    setTimeout(() => {
      setFeedbackBanner(null);
    }, 4500);
  };

  // 6. AUTHORITY ACTIONS (Context + local state sync)
  const handleAcknowledgeAlert = () => {
    ctxAcknowledgeAlert(activeAlert.id);
    setAlerts((prev) =>
      prev.map((item) => {
        if (item.id === activeAlert.id) {
          return {
            ...item,
            status: item.status === 'Awaiting Action' ? 'Acknowledged' : item.status,
            timeline: {
              ...item.timeline,
              alertAcknowledged: true
            }
          };
        }
        return item;
      })
    );
    showBanner(`Alert ${activeAlert.id} acknowledged by Authority. Notification broadcasted.`);
  };

  const handleAssignTeam = () => {
    ctxAssignTeam(activeAlert.id, 'District Emergency Team');
    setAlerts((prev) =>
      prev.map((item) => {
        if (item.id === activeAlert.id) {
          return {
            ...item,
            responseTeam: {
              ...item.responseTeam,
              status: 'Assigned'
            },
            timeline: {
              ...item.timeline,
              alertAcknowledged: true,
              responseTeamAssigned: true
            }
          };
        }
        return item;
      })
    );
    showBanner(`District Disaster Response Team assigned to ${activeAlert.zoneCode}.`);
  };

  const handleRequestFieldVerification = () => {
    ctxUpdateFieldVerification(activeAlert.id, 'Verified');
    setAlerts((prev) =>
      prev.map((item) => {
        if (item.id === activeAlert.id) {
          return {
            ...item,
            fieldVerificationStatus: 'Verified',
            timeline: {
              ...item.timeline,
              fieldVerification: 'verified'
            }
          };
        }
        return item;
      })
    );
    showBanner(`Field verification verified for ${activeAlert.id}.`);
  };

  const handleConfirmEmergencyAction = () => {
    if (!confirmationDialog) return;
    const { actionType, zone } = confirmationDialog;

    ctxSetResponseAction(
      activeAlert.id,
      actionType === 'road_closure' ? 'Road Closure' : 'Evacuation'
    );

    setAlerts((prev) =>
      prev.map((item) => {
        if (item.id === activeAlert.id) {
          const updatedRoad = actionType === 'road_closure' ? true : item.emergencyActions.roadClosure;
          const updatedEvac = actionType === 'evacuation' ? true : item.emergencyActions.evacuation;
          let actionTakenVal: 'road_closed' | 'evacuation_started' | 'both' = 'road_closed';
          if (updatedRoad && updatedEvac) actionTakenVal = 'both';
          else if (updatedEvac) actionTakenVal = 'evacuation_started';

          return {
            ...item,
            status: 'Action In Progress',
            emergencyActions: {
              roadClosure: updatedRoad,
              evacuation: updatedEvac
            },
            timeline: {
              ...item.timeline,
              actionTaken: actionTakenVal
            }
          };
        }
        return item;
      })
    );

    if (actionType === 'road_closure') {
      showBanner(`Road closure initiated for ${zone}. NH traffic redirected.`);
    } else {
      showBanner(`Emergency evacuation initiated for ${zone}. Relief shelters alerted.`);
    }

    setConfirmationDialog(null);
  };

  const handleMarkResolved = () => {
    ctxResolveAlert(activeAlert.id, 'Alert resolved by Authority.');
    setAlerts((prev) =>
      prev.map((item) => {
        if (item.id === activeAlert.id) {
          return {
            ...item,
            level: 'Resolved',
            status: 'Resolved',
            isResolved: true,
            resolvedMessage: 'Alert resolved by Authority.',
            timeline: {
              ...item.timeline,
              resolved: true
            }
          };
        }
        return item;
      })
    );
    showBanner(`Alert ${activeAlert.id} resolved by Authority.`);
  };

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Critical') return alert.level === 'Critical';
    if (selectedFilter === 'High') return alert.level === 'High';
    if (selectedFilter === 'Watch') return alert.level === 'Watch';
    if (selectedFilter === 'Resolved') return alert.status === 'Resolved' || alert.isResolved;
    return true;
  });

  const activeCount = alerts.filter((a) => !a.isResolved && a.status !== 'Resolved').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ==================================================
            1. PAGE HEADER
            Title: "Alert Management"
            Subtitle: "Review active warnings and coordinate emergency response."
            Show: "3 Active Alerts"
            Filters: All, Critical, High, Watch, Resolved
            ================================================== */}
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Alert Management
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span>{activeCount} Active Alerts</span>
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Review active warnings and coordinate emergency response.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>DDMA Operations Portal</span>
            </span>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedbackBanner && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{feedbackBanner}</span>
            </div>
            <button
              onClick={() => setFeedbackBanner(null)}
              className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters: All, Critical, High, Watch, Resolved */}
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Critical', 'High', 'Watch', 'Resolved'] as const).map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <button
                key={filter}
                id={`filter-${filter.toLowerCase()}-btn`}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {filter}
                {filter === 'Critical' && <span className="ml-1 text-red-500 font-black">•</span>}
                {filter === 'High' && <span className="ml-1 text-orange-500 font-black">•</span>}
                {filter === 'Watch' && <span className="ml-1 text-amber-500 font-black">•</span>}
                {filter === 'Resolved' && <span className="ml-1 text-emerald-500 font-black">•</span>}
              </button>
            );
          })}
        </div>

        {/* ==================================================
            2. ACTIVE ALERT LIST
            ================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Regional Alert Queue ({filteredAlerts.length})
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Select an alert to view environmental sensors and execute actions
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredAlerts.map((item) => {
              const isSelected = item.id === activeAlert.id;

              return (
                <div
                  key={item.id}
                  id={`alert-card-${item.id.toLowerCase()}`}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 transition-all border ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-950 shadow-md'
                      : item.level === 'Critical'
                      ? 'border-red-200 dark:border-red-900/60 hover:border-red-400 dark:hover:border-red-700'
                      : item.level === 'High'
                      ? 'border-orange-200 dark:border-orange-900/60 hover:border-orange-400 dark:hover:border-orange-700'
                      : item.level === 'Watch'
                      ? 'border-amber-200 dark:border-amber-900/60 hover:border-amber-400 dark:hover:border-amber-700'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Risk Level badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide uppercase ${
                            item.level === 'Critical'
                              ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                              : item.level === 'High'
                              ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300'
                              : item.level === 'Watch'
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          {item.levelLabel}
                        </span>

                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                          {item.id}
                        </span>

                        {/* Status badge */}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            item.status === 'Awaiting Action'
                              ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300'
                              : item.status === 'Acknowledged'
                              ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                              : item.status === 'Resolved'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          Status: {item.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>

                      {/* Summary Metrics */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Location: <strong className="text-slate-800 dark:text-slate-200">{item.location}</strong></span>
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <span>Probability: <strong className={item.level === 'Critical' ? 'text-red-600 dark:text-red-400 font-black' : item.level === 'High' ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>{item.probability}%</strong></span>
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Expected: <strong className="text-slate-800 dark:text-slate-200">{item.expected}</strong></span>
                        </span>
                      </div>
                    </div>

                    {/* Button: "Manage Alert" */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <button
                        id={`manage-alert-btn-${item.id.toLowerCase()}`}
                        onClick={() => setSelectedId(item.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-700 dark:bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                        }`}
                      >
                        <span>Manage Alert</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            3. ALERT DETAILS (ACTIVE MANAGEMENT PANEL)
            ================================================== */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Active Alert Management Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {activeAlert.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Alert ID: {activeAlert.id}
              </span>
              {activeAlert.isResolved && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  ✓ Incident Resolved
                </span>
              )}
            </div>
          </div>

          {/* 3. Core Specification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Location
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                {activeAlert.location}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Risk Level
              </span>
              <span
                className={`text-sm font-black mt-0.5 block ${
                  activeAlert.level === 'Critical'
                    ? 'text-red-600 dark:text-red-400'
                    : activeAlert.level === 'High'
                    ? 'text-orange-600 dark:text-orange-400'
                    : activeAlert.level === 'Watch'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {activeAlert.level === 'Critical' ? 'CRITICAL' : activeAlert.level.toUpperCase()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Probability
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                {activeAlert.probability}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Prediction Window
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                {activeAlert.expected}
              </span>
            </div>
          </div>

          {/* ==================================================
              4. ENVIRONMENTAL DATA
              ================================================== */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Environmental Data (Field Telemetry)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Rainfall
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{activeAlert.environmental.rainfall}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Soil Moisture
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{activeAlert.environmental.soilMoisture}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Temperature
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{activeAlert.environmental.temperature}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Slope
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{activeAlert.environmental.slope}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Historical Landslides
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{activeAlert.environmental.historicalLandslides}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              5. RESPONSE STATUS (RESPONSE TIMELINE)
              ================================================== */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Response Status & Workflow Timeline
              </h3>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Current step: <strong className="text-slate-800 dark:text-slate-200">{activeAlert.status}</strong>
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
                {/* 1. Alert Generated */}
                <div className="flex sm:flex-col items-center sm:text-center justify-between sm:justify-start gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      1. Alert Generated
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                      Complete
                    </div>
                  </div>
                </div>

                {/* 2. Authority Notified */}
                <div className="flex sm:flex-col items-center sm:text-center justify-between sm:justify-start gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      2. Authority Notified
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                      Complete
                    </div>
                  </div>
                </div>

                {/* 3. Alert Acknowledged */}
                <div className={`flex sm:flex-col items-center sm:text-center justify-between sm:justify-start gap-2 p-2 rounded-lg border shadow-2xs ${
                  activeAlert.timeline.alertAcknowledged
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    activeAlert.timeline.alertAcknowledged
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}>
                    {activeAlert.timeline.alertAcknowledged ? '✓' : '○'}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      3. Alert Acknowledged
                    </div>
                    <div className={`text-[10px] font-bold ${
                      activeAlert.timeline.alertAcknowledged ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {activeAlert.timeline.alertAcknowledged ? 'Complete' : 'Pending'}
                    </div>
                  </div>
                </div>

                {/* 4. Response Team Assigned */}
                <div className={`flex sm:flex-col items-center sm:text-center justify-between sm:justify-start gap-2 p-2 rounded-lg border shadow-2xs ${
                  activeAlert.timeline.responseTeamAssigned
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    activeAlert.timeline.responseTeamAssigned
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}>
                    {activeAlert.timeline.responseTeamAssigned ? '✓' : '○'}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      4. Team Assigned
                    </div>
                    <div className={`text-[10px] font-bold ${
                      activeAlert.timeline.responseTeamAssigned ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {activeAlert.timeline.responseTeamAssigned ? 'Complete' : 'Pending'}
                    </div>
                  </div>
                </div>

                {/* 5. Field Verification */}
                <div className={`flex sm:flex-col items-center sm:text-center justify-between sm:justify-start gap-2 p-2 rounded-lg border shadow-2xs ${
                  activeAlert.fieldVerificationStatus !== 'Pending'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    activeAlert.fieldVerificationStatus !== 'Pending'
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}>
                    {activeAlert.fieldVerificationStatus !== 'Pending' ? '✓' : '○'}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      5. Field Verification
                    </div>
                    <div className={`text-[10px] font-bold ${
                      activeAlert.fieldVerificationStatus !== 'Pending' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {activeAlert.fieldVerificationStatus !== 'Pending' ? 'Complete' : 'Pending'}
                    </div>
                  </div>
                </div>

                {/* 6. Action Taken */}
                <div className={`flex sm:flex-col items-center sm:text-center justify-between sm:justify-start gap-2 p-2 rounded-lg border shadow-2xs ${
                  activeAlert.emergencyActions.roadClosure || activeAlert.emergencyActions.evacuation
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    activeAlert.emergencyActions.roadClosure || activeAlert.emergencyActions.evacuation
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}>
                    {activeAlert.emergencyActions.roadClosure || activeAlert.emergencyActions.evacuation ? '✓' : '○'}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      6. Action Taken
                    </div>
                    <div className={`text-[10px] font-bold ${
                      activeAlert.emergencyActions.roadClosure || activeAlert.emergencyActions.evacuation ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {activeAlert.emergencyActions.roadClosure || activeAlert.emergencyActions.evacuation ? 'Complete' : 'Pending'}
                    </div>
                  </div>
                </div>

                {/* 7. Resolved */}
                <div className={`flex sm:flex-col items-center sm:text-center justify-between sm:justify-start gap-2 p-2 rounded-lg border shadow-2xs ${
                  activeAlert.isResolved
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    activeAlert.isResolved
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}>
                    {activeAlert.isResolved ? '✓' : '○'}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      7. Resolved
                    </div>
                    <div className={`text-[10px] font-bold ${
                      activeAlert.isResolved ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {activeAlert.isResolved ? 'Complete' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              6. AUTHORITY ACTIONS (Response Actions)
              ================================================== */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Response Actions
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Click any action to execute operational update
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* [Acknowledge Alert] */}
              <button
                id="btn-acknowledge-alert"
                onClick={handleAcknowledgeAlert}
                disabled={activeAlert.timeline.alertAcknowledged}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeAlert.timeline.alertAcknowledged
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 cursor-default'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs'
                }`}
              >
                {activeAlert.timeline.alertAcknowledged ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Alert Acknowledged</span>
                  </>
                ) : (
                  <span>Acknowledge Alert</span>
                )}
              </button>

              {/* [Assign Response Team] */}
              <button
                id="btn-assign-response-team"
                onClick={handleAssignTeam}
                disabled={activeAlert.responseTeam.status === 'Assigned'}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeAlert.responseTeam.status === 'Assigned'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 cursor-default'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs'
                }`}
              >
                {activeAlert.responseTeam.status === 'Assigned' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Response Team Assigned</span>
                  </>
                ) : (
                  <span>Assign Response Team</span>
                )}
              </button>

              {/* [Request Field Verification] */}
              <button
                id="btn-request-field-verification"
                onClick={handleRequestFieldVerification}
                disabled={activeAlert.fieldVerificationStatus !== 'Pending'}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeAlert.fieldVerificationStatus !== 'Pending'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 cursor-default'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs'
                }`}
              >
                {activeAlert.fieldVerificationStatus !== 'Pending' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Field Verification Requested</span>
                  </>
                ) : (
                  <span>Request Field Verification</span>
                )}
              </button>

              {/* [Initiate Road Closure] */}
              <button
                id="btn-initiate-road-closure-quick"
                onClick={() =>
                  setConfirmationDialog({
                    isOpen: true,
                    actionType: 'road_closure',
                    zone: activeAlert.zoneCode
                  })
                }
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAlert.emergencyActions.roadClosure
                    ? 'bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-300 border border-orange-300 dark:border-orange-800'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs'
                }`}
              >
                {activeAlert.emergencyActions.roadClosure
                  ? 'Road Closure Active'
                  : 'Initiate Road Closure'}
              </button>

              {/* [Start Evacuation] */}
              <button
                id="btn-start-evacuation-quick"
                onClick={() =>
                  setConfirmationDialog({
                    isOpen: true,
                    actionType: 'evacuation',
                    zone: activeAlert.zoneCode
                  })
                }
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAlert.emergencyActions.evacuation
                    ? 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-300 border border-red-300 dark:border-red-800'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs'
                }`}
              >
                {activeAlert.emergencyActions.evacuation
                  ? 'Evacuation Active'
                  : 'Start Evacuation'}
              </button>

              {/* [Mark Resolved] */}
              <button
                id="btn-mark-resolved-quick"
                onClick={handleMarkResolved}
                disabled={activeAlert.isResolved}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAlert.isResolved
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                }`}
              >
                {activeAlert.isResolved ? '✓ Resolved' : 'Mark Resolved'}
              </button>
            </div>
          </div>

          {/* 7 & 8 Dual Column: RESPONSE TEAM & FIELD VERIFICATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ==================================================
                7. RESPONSE TEAM
                ================================================== */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Response Team</span>
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    activeAlert.responseTeam.status === 'Assigned'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                  }`}
                >
                  Status: {activeAlert.responseTeam.status}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Team: </span>
                  <strong className="text-slate-900 dark:text-white">{activeAlert.responseTeam.team}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Officer: </span>
                  <strong className="text-slate-900 dark:text-white">{activeAlert.responseTeam.officer}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Status: </span>
                  <strong className={activeAlert.responseTeam.status === 'Assigned' ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}>
                    {activeAlert.responseTeam.status}
                  </strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  id="btn-assign-team-panel"
                  onClick={handleAssignTeam}
                  disabled={activeAlert.responseTeam.status === 'Assigned'}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeAlert.responseTeam.status === 'Assigned'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                  }`}
                >
                  {activeAlert.responseTeam.status === 'Assigned' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Team Assigned to {activeAlert.zoneCode}</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-3.5 h-3.5" />
                      <span>Assign Team</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ==================================================
                8. FIELD VERIFICATION
                ================================================== */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Field Verification</span>
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    activeAlert.fieldVerificationStatus === 'Verification Requested'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                      : activeAlert.fieldVerificationStatus === 'Verified'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300'
                  }`}
                >
                  Status: {activeAlert.fieldVerificationStatus}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Status: </span>
                  <strong className="text-slate-900 dark:text-white">{activeAlert.fieldVerificationStatus}</strong>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeAlert.fieldVerificationStatus === 'Verification Requested'
                    ? 'Dispatched geotechnical sub-divisional surveyor to evaluate tension fissures.'
                    : 'Awaiting formal geotechnical on-site verification request.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  id="btn-request-verification-panel"
                  onClick={handleRequestFieldVerification}
                  disabled={activeAlert.fieldVerificationStatus !== 'Pending'}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeAlert.fieldVerificationStatus !== 'Pending'
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 cursor-default'
                      : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-2xs'
                  }`}
                >
                  {activeAlert.fieldVerificationStatus !== 'Pending' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Verification Requested</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Request Verification</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================
              9. EMERGENCY ACTIONS
              ================================================== */}
          <div className="p-5 rounded-xl border-2 border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-red-200 dark:border-red-900/60">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400" />
                <h3 className="text-sm font-black text-red-950 dark:text-red-200 uppercase tracking-wide">
                  Emergency Actions
                </h3>
              </div>
              <span className="text-[11px] font-bold text-red-800 dark:text-red-300">
                High-impact regulatory interventions for {activeAlert.zoneCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Road Closure Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/60 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Road Closure Protocol</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      activeAlert.emergencyActions.roadClosure
                        ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {activeAlert.emergencyActions.roadClosure ? 'Active' : 'Standby'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Directs traffic police and border roads organization to place physical barriers and divert uphill commercial traffic.
                </p>
                <button
                  id="btn-initiate-road-closure-dialog"
                  onClick={() =>
                    setConfirmationDialog({
                      isOpen: true,
                      actionType: 'road_closure',
                      zone: activeAlert.zoneCode
                    })
                  }
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeAlert.emergencyActions.roadClosure
                      ? 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-300 border border-red-300 dark:border-red-800'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-2xs'
                  }`}
                >
                  {activeAlert.emergencyActions.roadClosure
                    ? 'Road Closure Initiated'
                    : 'Initiate Road Closure'}
                </button>
              </div>

              {/* Evacuation Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/60 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Evacuation Order</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      activeAlert.emergencyActions.evacuation
                        ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {activeAlert.emergencyActions.evacuation ? 'Enforced' : 'Standby'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Coordinates siren warnings, bus dispatch to designated transit shelters, and SDRF neighborhood sweep.
                </p>
                <button
                  id="btn-start-evacuation-dialog"
                  onClick={() =>
                    setConfirmationDialog({
                      isOpen: true,
                      actionType: 'evacuation',
                      zone: activeAlert.zoneCode
                    })
                  }
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeAlert.emergencyActions.evacuation
                      ? 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-300 border border-red-300 dark:border-red-800'
                      : 'bg-red-700 hover:bg-red-800 text-white shadow-2xs'
                  }`}
                >
                  {activeAlert.emergencyActions.evacuation
                    ? 'Evacuation Active'
                    : 'Start Evacuation'}
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================
              10. RESOLUTION
              ================================================== */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Resolve Alert
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Once field conditions stabilize and soil moisture reduces below threshold.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeAlert.isResolved ? (
                <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{activeAlert.resolvedMessage || 'Alert resolved by Authority.'}</span>
                </div>
              ) : (
                <button
                  id="btn-resolve-alert-bottom"
                  onClick={handleMarkResolved}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Alert as Resolved</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Quick Context & Help Links for Authority Officers */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            Need geographic coordinates or live route bypass status?
          </span>
          <div className="flex items-center gap-2">
            {onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('risk-map')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer shadow-2xs"
                >
                  View on Risk Map
                </button>
                <button
                  onClick={() => onNavigate('safe-routes')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer shadow-2xs"
                >
                  Safe Routes
                </button>
              </>
            )}
          </div>
        </div>

      </div>

      {/* ==================================================
          CONFIRMATION DIALOG (Small Modal for Emergency Actions)
          ================================================== */}
      {confirmationDialog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {confirmationDialog.actionType === 'road_closure'
                    ? 'Confirm Road Closure'
                    : 'Confirm Emergency Evacuation'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to{' '}
                  {confirmationDialog.actionType === 'road_closure'
                    ? `initiate road closure for ${confirmationDialog.zone}`
                    : `start evacuation for ${confirmationDialog.zone}`}
                  ?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[11px] leading-relaxed">
              This action will dispatch immediate advisories to SDRF units, notify field operators, and flag restricted corridors on the public Risk Map.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                id="btn-dialog-cancel"
                onClick={() => setConfirmationDialog(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-dialog-confirm"
                onClick={handleConfirmEmergencyAction}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-2xs cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
