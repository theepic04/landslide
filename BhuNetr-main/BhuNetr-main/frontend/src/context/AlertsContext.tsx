import React, { createContext, useContext, useState, useEffect } from 'react';

export type AlertLevel = 'Emergency' | 'Warning' | 'Watch' | 'Normal';

export type WorkflowStep =
  | 'Alert Generated'
  | 'Authority Notified'
  | 'Acknowledged'
  | 'Team Assigned'
  | 'Field Verification'
  | 'Action Taken'
  | 'Resolved';

export type FieldVerificationStatus =
  | 'Pending'
  | 'Verified'
  | 'Not Verified'
  | 'Needs Further Inspection';

export type ResponseActionType =
  | 'No Action'
  | 'Road Closure'
  | 'Evacuation'
  | 'Monitoring';

export type ResponseTeamType =
  | 'District Emergency Team'
  | 'Road & Infrastructure Team'
  | 'Local Rescue Team';

export interface AlertTimelineEvent {
  step: WorkflowStep;
  timestamp: string;
  note: string;
}

export interface UnifiedAlert {
  id: string; // e.g. LS-2026-004
  level: AlertLevel;
  title: string;
  location: string;
  state: string;
  district?: string;
  zoneId: string; // e.g. zone-04
  probability: number; // percentage (0-100)
  expectedTime: string; // e.g. "Next 12–24 Hours"
  cause: string;
  message: string;
  rainfall: string; // e.g. "92 mm / 24h"
  soilMoisture: string; // e.g. "81%"
  slope: string; // e.g. "37°"
  temperature?: string; // e.g. "24°C"
  timestamp: string; // generated time e.g. "Today, 18:30"
  recommendedAction: string;
  isCurrentArea?: boolean; // monitored area for citizen (e.g. Sikkim)
  affectedRoad?: string;

  // Notification status
  isRead: boolean;

  // Authority Workflow State
  currentStep: WorkflowStep;
  assignedTeam: ResponseTeamType | null;
  fieldVerification: FieldVerificationStatus;
  responseAction: ResponseActionType;
  isResolved: boolean;
  resolvedAt?: string;
  resolutionNote?: string;
  timeline: AlertTimelineEvent[];
}

export interface AlertsContextType {
  alerts: UnifiedAlert[];
  activeAlerts: UnifiedAlert[];
  resolvedAlerts: UnifiedAlert[];
  unreadCount: number;
  selectedFilter: 'All' | 'Emergency' | 'Warning' | 'Watch' | 'Normal';
  setSelectedFilter: (filter: 'All' | 'Emergency' | 'Warning' | 'Watch' | 'Normal') => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  acknowledgeAlert: (id: string) => void;
  assignResponseTeam: (id: string, team: ResponseTeamType) => void;
  updateFieldVerification: (id: string, status: FieldVerificationStatus) => void;
  setResponseAction: (id: string, action: ResponseActionType) => void;
  resolveAlert: (id: string, note?: string) => void;
  getAlertById: (id: string) => UnifiedAlert | undefined;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
  resetAlertsToDefault: () => void;
}

const STORAGE_KEY = 'bhunetra_unified_alerts_v2';

export const INITIAL_UNIFIED_ALERTS: UnifiedAlert[] = [
  // 1. EMERGENCY ALERT: Sikkim Zone 04 (Singtam / NH-10)
  {
    id: 'LS-2026-004',
    level: 'Emergency',
    title: 'Critical Landslide Risk Detected',
    location: 'Zone 04, Sikkim',
    state: 'Sikkim',
    district: 'East Sikkim',
    zoneId: 'zone-04',
    probability: 91,
    expectedTime: 'Next 12–24 Hours',
    cause: 'Heavy rainfall + saturated upper slope strata',
    message: 'Immediate precautionary action may be required. Follow official instructions and avoid high-risk areas along NH-10.',
    rainfall: '92 mm / 24h',
    soilMoisture: '81%',
    slope: '37°',
    temperature: '24°C',
    timestamp: 'Today, 18:30',
    recommendedAction: 'Avoid the affected route and move toward a safe location if instructed by authorities. Shelter camp established at Paljor Stadium.',
    isCurrentArea: true,
    affectedRoad: 'National Highway 10 (Singtam-Dikchu belt)',
    isRead: false,
    currentStep: 'Authority Notified',
    assignedTeam: null,
    fieldVerification: 'Pending',
    responseAction: 'No Action',
    isResolved: false,
    timeline: [
      { step: 'Alert Generated', timestamp: 'Today, 18:25', note: 'Sensor cluster SG-04 triggered 14mm displacement' },
      { step: 'Authority Notified', timestamp: 'Today, 18:30', note: 'Emergency dispatch alert sent to Sikkim Control Room' }
    ]
  },
  // 2. WARNING ALERT: Arunachal Pradesh Zone 12 (Tawang Route)
  {
    id: 'LS-2026-003',
    level: 'Warning',
    title: 'High Landslide Risk Advisory',
    location: 'Zone 12, Arunachal Pradesh',
    state: 'Arunachal Pradesh',
    district: 'West Kameng',
    zoneId: 'zone-12',
    probability: 78,
    expectedTime: 'Next 24–48 Hours',
    cause: 'Heavy continuous rainfall & high pore pressure',
    message: 'Elevated slope instability detected. Heavy runoff across mountain passes. Exercise extreme caution.',
    rainfall: '68 mm / 24h',
    soilMoisture: '74%',
    slope: '32°',
    temperature: '21°C',
    timestamp: 'Today, 15:10',
    recommendedAction: 'Limit non-essential travel along hillside passes and keep emergency supplies ready.',
    isCurrentArea: false,
    affectedRoad: 'Bhalukpong-Bomdila-Tawang Highway',
    isRead: false,
    currentStep: 'Acknowledged',
    assignedTeam: null,
    fieldVerification: 'Pending',
    responseAction: 'Monitoring',
    isResolved: false,
    timeline: [
      { step: 'Alert Generated', timestamp: 'Today, 15:05', note: 'Rainfall threshold 65mm exceeded' },
      { step: 'Authority Notified', timestamp: 'Today, 15:10', note: 'Notice broadcast to district administration' },
      { step: 'Acknowledged', timestamp: 'Today, 15:30', note: 'Duty officer acknowledged advisory' }
    ]
  },
  // 3. WARNING ALERT: Assam Zone 15 (Dima Hasao)
  {
    id: 'LS-2026-005',
    level: 'Warning',
    title: 'Hill Cutting & Seepage Risk',
    location: 'Zone 15, Assam',
    state: 'Assam',
    district: 'Dima Hasao',
    zoneId: 'zone-15',
    probability: 69,
    expectedTime: 'Next 24–48 Hours',
    cause: 'Continuous precipitation creating rapid slope saturation',
    message: 'Rail cutting embankment seepage detected. Saturated strata prone to slumping.',
    rainfall: '55 mm / 24h',
    soilMoisture: '68%',
    slope: '24°',
    temperature: '28°C',
    timestamp: 'Today, 13:20',
    recommendedAction: 'Engineering patrols deployed along railway corridor. Maintain distance from steep cuttings.',
    isCurrentArea: false,
    affectedRoad: 'Haflong - Jatinga Hill Corridor',
    isRead: false,
    currentStep: 'Authority Notified',
    assignedTeam: null,
    fieldVerification: 'Pending',
    responseAction: 'Monitoring',
    isResolved: false,
    timeline: [
      { step: 'Alert Generated', timestamp: 'Today, 13:15', note: 'Soil pore pressure sensor triggered alert' },
      { step: 'Authority Notified', timestamp: 'Today, 13:20', note: 'Forwarded to District Disaster Cell' }
    ]
  },
  // 4. WATCH ALERT: Meghalaya Zone 07 (East Khasi Hills)
  {
    id: 'LS-2026-002',
    level: 'Watch',
    title: 'Increased Landslide Risk Watch',
    location: 'Zone 07, Meghalaya',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    zoneId: 'zone-07',
    probability: 54,
    expectedTime: 'Next 48 Hours',
    cause: 'Precipitation accumulation leading to saturated topsoil',
    message: 'Surface fissures noted after localized cloudburst spell near Cherrapunji escarpment.',
    rainfall: '42 mm / 24h',
    soilMoisture: '65%',
    slope: '28°',
    temperature: '26°C',
    timestamp: 'Today, 11:45',
    recommendedAction: 'Monitor regional weather broadcasts and check drainage clear paths around hillside residences.',
    isCurrentArea: false,
    affectedRoad: 'Sohra-Shella Road',
    isRead: false,
    currentStep: 'Authority Notified',
    assignedTeam: null,
    fieldVerification: 'Pending',
    responseAction: 'Monitoring',
    isResolved: false,
    timeline: [
      { step: 'Alert Generated', timestamp: 'Today, 11:40', note: 'Telemetry threshold warning' },
      { step: 'Authority Notified', timestamp: 'Today, 11:45', note: 'Sent to Meghalaya SDMA' }
    ]
  },
  // 5. NORMAL STATUS: Manipur Zone 02 (Noney & Tupul Valley Corridor)
  {
    id: 'LS-2026-001',
    level: 'Normal',
    title: 'Slope Conditions Stable - Routine Telemetry',
    location: 'Zone 02, Manipur',
    state: 'Manipur',
    district: 'Noney',
    zoneId: 'zone-02',
    probability: 22,
    expectedTime: 'Next 5 Days',
    cause: 'Normal seasonal moisture levels with zero ground velocity',
    message: 'Sensors across Noney rail bridges and hill cuts report normal drainage and stable bedrock anchors.',
    rainfall: '18 mm / 24h',
    soilMoisture: '32%',
    slope: '20°',
    temperature: '25°C',
    timestamp: 'Today, 08:00',
    recommendedAction: 'Standard operational protocol. No defensive countermeasures required.',
    isCurrentArea: false,
    affectedRoad: 'Imphal-Jiribam Highway',
    isRead: true,
    currentStep: 'Authority Notified',
    assignedTeam: null,
    fieldVerification: 'Verified',
    responseAction: 'No Action',
    isResolved: false,
    timeline: [
      { step: 'Alert Generated', timestamp: 'Today, 08:00', note: 'Routine automated health telemetry nominal' }
    ]
  },
  // 6. HISTORICAL RESOLVED ALERT: Nagaland Zone 03 (Zubza Slope)
  {
    id: 'LS-2026-H01',
    level: 'Warning',
    title: 'Tensional Ground Crack Resolved',
    location: 'Zone 03, Nagaland',
    state: 'Nagaland',
    district: 'Kohima',
    zoneId: 'zone-03',
    probability: 65,
    expectedTime: 'Past Event',
    cause: 'Heavy rains induced surface tensile fractures',
    message: 'Tensional ground cracks stabilized with tarpaulin covering and drainage channels restored.',
    rainfall: '72 mm / 24h',
    soilMoisture: '71%',
    slope: '31°',
    temperature: '23°C',
    timestamp: '03 Sep 2026, 14:00',
    recommendedAction: 'Area inspected by geotechnical team. Traffic reopened with 30 km/h speed restriction.',
    isCurrentArea: false,
    affectedRoad: 'Dimapur-Kohima Highway',
    isRead: true,
    currentStep: 'Resolved',
    assignedTeam: 'Road & Infrastructure Team',
    fieldVerification: 'Verified',
    responseAction: 'Road Closure',
    isResolved: true,
    resolvedAt: '03 Sep 2026, 17:30',
    resolutionNote: 'Stabilization complete. Drainage functional and sensors nominal.',
    timeline: [
      { step: 'Alert Generated', timestamp: '03 Sep 2026, 14:00', note: 'Displacement detected' },
      { step: 'Authority Notified', timestamp: '03 Sep 2026, 14:15', note: 'Alert transmitted' },
      { step: 'Acknowledged', timestamp: '03 Sep 2026, 14:20', note: 'Officer acknowledged' },
      { step: 'Team Assigned', timestamp: '03 Sep 2026, 14:30', note: 'Road & Infrastructure Team deployed' },
      { step: 'Field Verification', timestamp: '03 Sep 2026, 15:10', note: 'Ground survey verified fissure' },
      { step: 'Action Taken', timestamp: '03 Sep 2026, 15:45', note: 'Temporary road closure applied' },
      { step: 'Resolved', timestamp: '03 Sep 2026, 17:30', note: 'Retaining work and drainage cleared' }
    ]
  },
  // 7. HISTORICAL RESOLVED ALERT: Mizoram Zone 05 (Aizawl West)
  {
    id: 'LS-2026-H02',
    level: 'Watch',
    title: 'Saturated Sump Runoff Cleared',
    location: 'Zone 05, Mizoram',
    state: 'Mizoram',
    district: 'Aizawl',
    zoneId: 'zone-05',
    probability: 48,
    expectedTime: 'Past Event',
    cause: 'Blocked roadside masonry culverts',
    message: 'Localized ponding water drained through culvert flushing. Hill slope moisture returned to baseline.',
    rainfall: '38 mm / 24h',
    soilMoisture: '60%',
    slope: '22°',
    temperature: '26°C',
    timestamp: '01 Sep 2026, 10:30',
    recommendedAction: 'Culvert cleared by municipality. Normal vehicle movement restored.',
    isCurrentArea: false,
    affectedRoad: 'Aizawl-Sairang Road',
    isRead: true,
    currentStep: 'Resolved',
    assignedTeam: 'Local Rescue Team',
    fieldVerification: 'Verified',
    responseAction: 'Monitoring',
    isResolved: true,
    resolvedAt: '01 Sep 2026, 16:00',
    resolutionNote: 'Municipal drainage clearing completed. Water table normalized.',
    timeline: [
      { step: 'Alert Generated', timestamp: '01 Sep 2026, 10:30', note: 'Runoff sensor alert' },
      { step: 'Authority Notified', timestamp: '01 Sep 2026, 10:45', note: 'Dispatched to Aizawl Control' },
      { step: 'Acknowledged', timestamp: '01 Sep 2026, 11:00', note: 'Acknowledged' },
      { step: 'Team Assigned', timestamp: '01 Sep 2026, 11:30', note: 'Local Rescue Team assigned' },
      { step: 'Field Verification', timestamp: '01 Sep 2026, 12:15', note: 'Culvert blockage verified' },
      { step: 'Action Taken', timestamp: '01 Sep 2026, 13:00', note: 'Culvert cleared' },
      { step: 'Resolved', timestamp: '01 Sep 2026, 16:00', note: 'Resolved by District Engineer' }
    ]
  }
];

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<UnifiedAlert[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Fallback to initial
      }
    }
    return INITIAL_UNIFIED_ALERTS;
  });

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Emergency' | 'Warning' | 'Watch' | 'Normal'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch {
      // ignore in restricted mode
    }
  }, [alerts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  };

  const clearToast = () => setToastMessage(null);

  const resetAlertsToDefault = () => {
    setAlerts(INITIAL_UNIFIED_ALERTS);
    showToast('Alert system reset to default mock state.');
  };

  const activeAlerts = alerts.filter((a) => !a.isResolved);
  const resolvedAlerts = alerts.filter((a) => a.isResolved);

  // Unread count: only unread active alerts
  const unreadCount = alerts.filter((a) => !a.isRead && !a.isResolved).length;

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert))
    );
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
    showToast('All notifications marked as read.');
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          const nowStr = 'Just now';
          const newTimeline = [...alert.timeline];
          if (!newTimeline.some((t) => t.step === 'Acknowledged')) {
            newTimeline.push({
              step: 'Acknowledged',
              timestamp: nowStr,
              note: 'Alert acknowledged by On-Duty Authority Officer.'
            });
          }
          return {
            ...alert,
            currentStep: 'Acknowledged' as WorkflowStep,
            isRead: true,
            timeline: newTimeline
          };
        }
        return alert;
      })
    );
    showToast(`Alert ${id} acknowledged. Status updated.`);
  };

  const assignResponseTeam = (id: string, team: ResponseTeamType) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          const nowStr = 'Just now';
          const newTimeline = [...alert.timeline];
          newTimeline.push({
            step: 'Team Assigned',
            timestamp: nowStr,
            note: `${team} assigned to ${alert.location}.`
          });
          return {
            ...alert,
            assignedTeam: team,
            currentStep: 'Team Assigned' as WorkflowStep,
            timeline: newTimeline
          };
        }
        return alert;
      })
    );
    showToast(`Assigned ${team} to alert ${id}.`);
  };

  const updateFieldVerification = (id: string, status: FieldVerificationStatus) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          const nowStr = 'Just now';
          const newTimeline = [...alert.timeline];
          newTimeline.push({
            step: 'Field Verification',
            timestamp: nowStr,
            note: `Field verification updated to: ${status}.`
          });
          return {
            ...alert,
            fieldVerification: status,
            currentStep: 'Field Verification' as WorkflowStep,
            timeline: newTimeline
          };
        }
        return alert;
      })
    );
    showToast(`Field verification for ${id} set to "${status}".`);
  };

  const setResponseAction = (id: string, action: ResponseActionType) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          const nowStr = 'Just now';
          const newTimeline = [...alert.timeline];
          newTimeline.push({
            step: 'Action Taken',
            timestamp: nowStr,
            note: `Emergency action applied: ${action}.`
          });
          return {
            ...alert,
            responseAction: action,
            currentStep: 'Action Taken' as WorkflowStep,
            timeline: newTimeline
          };
        }
        return alert;
      })
    );
    showToast(`Emergency response action "${action}" initiated for ${id}.`);
  };

  const resolveAlert = (id: string, note?: string) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          const nowStr = 'Just now';
          const finalNote = note || 'Hazard cleared and verified stable by incident commander.';
          const newTimeline = [...alert.timeline];
          newTimeline.push({
            step: 'Resolved',
            timestamp: nowStr,
            note: finalNote
          });
          return {
            ...alert,
            isResolved: true,
            isRead: true,
            currentStep: 'Resolved' as WorkflowStep,
            resolvedAt: nowStr,
            resolutionNote: finalNote,
            timeline: newTimeline
          };
        }
        return alert;
      })
    );
    showToast(`Alert ${id} resolved successfully and moved to Alert History.`);
  };

  const getAlertById = (id: string) => {
    return alerts.find((a) => a.id === id);
  };

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        activeAlerts,
        resolvedAlerts,
        unreadCount,
        selectedFilter,
        setSelectedFilter,
        markAsRead,
        markAllAsRead,
        acknowledgeAlert,
        assignResponseTeam,
        updateFieldVerification,
        setResponseAction,
        resolveAlert,
        getAlertById,
        toastMessage,
        showToast,
        clearToast,
        resetAlertsToDefault
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = (): AlertsContextType => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};
