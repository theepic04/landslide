export interface HistoricalIncident {
  id: string;
  date: string;
  rawDate: string; // ISO format for easy chronological sorting/filtering
  location: string;
  district: string;
  state: string;
  severity: 'Normal' | 'Watch' | 'Warning' | 'Emergency';
  rainfall: string; // e.g. "124 mm / 24h"
  rainfallMm: number;
  impact: string;
  status: 'Resolved' | 'Under Monitoring' | 'Restabilized' | 'Debris Cleared';
  estimatedAffectedArea: string;
  infrastructureImpact: string;
  description: string;
}

export interface MonthlyIncidentData {
  month: string; // "Oct 24", "Nov 24", etc.
  fullMonth: string; // "October 2024"
  year: number;
  incidents: number;
  criticalIncidents: number;
  rainfallMm: number;
}

export interface StateLandslideData {
  state: string;
  incidents: number;
  highRiskCount: number;
  colorHex: string;
}

export interface HistorySummaryStats {
  totalLandslides: number;
  highCriticalIncidents: number;
  mostAffectedState: string;
  highestRiskMonth: string;
}

// 8 Official North Eastern Region (NER) States and their major districts
export const NER_STATES = [
  'Arunachal Pradesh',
  'Assam',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Sikkim',
  'Tripura'
] as const;

export const NER_DISTRICTS_BY_STATE: Record<string, string[]> = {
  'Arunachal Pradesh': ['Papum Pare', 'West Kameng', 'Tawang', 'Lower Subansiri', 'Changlang'],
  'Assam': ['Dima Hasao', 'Karbi Anglong', 'Kamrup Metropolitan', 'Cachar', 'Goalpara'],
  'Manipur': ['Imphal West', 'Churachandpur', 'Senapati', 'Tamenglong', 'Ukhrul'],
  'Meghalaya': ['East Khasi Hills', 'West Khasi Hills', 'Ri-Bhoi', 'West Garo Hills', 'South West Khasi Hills'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib', 'Serchhip'],
  'Nagaland': ['Kohima', 'Mokokchung', 'Dimapur', 'Wokha', 'Phek'],
  'Sikkim': ['East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim', 'Pakyong', 'Soreng'],
  'Tripura': ['North Tripura', 'South Tripura', 'West Tripura', 'Dhalai', 'Unakoti']
};

// Summary metrics (mock realistic values)
export const MOCK_HISTORY_SUMMARY: HistorySummaryStats = {
  totalLandslides: 142,
  highCriticalIncidents: 38,
  mostAffectedState: 'Sikkim',
  highestRiskMonth: 'July'
};

// State-wise landslide distribution for all 8 NER states
export const MOCK_STATE_LANDSLIDES: StateLandslideData[] = [
  { state: 'Sikkim', incidents: 39, highRiskCount: 14, colorHex: '#ef4444' },
  { state: 'Meghalaya', incidents: 28, highRiskCount: 8, colorHex: '#f97316' },
  { state: 'Arunachal Pradesh', incidents: 23, highRiskCount: 6, colorHex: '#f59e0b' },
  { state: 'Nagaland', incidents: 18, highRiskCount: 4, colorHex: '#eab308' },
  { state: 'Mizoram', incidents: 15, highRiskCount: 3, colorHex: '#3b82f6' },
  { state: 'Assam', incidents: 11, highRiskCount: 2, colorHex: '#6366f1' },
  { state: 'Manipur', incidents: 6, highRiskCount: 1, colorHex: '#8b5cf6' },
  { state: 'Tripura', incidents: 2, highRiskCount: 0, colorHex: '#10b981' }
];

// 24-Month continuous incident trend (Oct 2024 to Sep 2026)
export const MOCK_24_MONTH_INCIDENTS: MonthlyIncidentData[] = [
  { month: 'Oct 24', fullMonth: 'October 2024', year: 2024, incidents: 4, criticalIncidents: 1, rainfallMm: 110 },
  { month: 'Nov 24', fullMonth: 'November 2024', year: 2024, incidents: 1, criticalIncidents: 0, rainfallMm: 40 },
  { month: 'Dec 24', fullMonth: 'December 2024', year: 2024, incidents: 0, criticalIncidents: 0, rainfallMm: 18 },
  { month: 'Jan 25', fullMonth: 'January 2025', year: 2025, incidents: 1, criticalIncidents: 0, rainfallMm: 25 },
  { month: 'Feb 25', fullMonth: 'February 2025', year: 2025, incidents: 1, criticalIncidents: 0, rainfallMm: 45 },
  { month: 'Mar 25', fullMonth: 'March 2025', year: 2025, incidents: 2, criticalIncidents: 0, rainfallMm: 80 },
  { month: 'Apr 25', fullMonth: 'April 2025', year: 2025, incidents: 5, criticalIncidents: 1, rainfallMm: 175 },
  { month: 'May 25', fullMonth: 'May 2025', year: 2025, incidents: 10, criticalIncidents: 3, rainfallMm: 340 },
  { month: 'Jun 25', fullMonth: 'June 2025', year: 2025, incidents: 13, criticalIncidents: 4, rainfallMm: 480 },
  { month: 'Jul 25', fullMonth: 'July 2025', year: 2025, incidents: 15, criticalIncidents: 5, rainfallMm: 520 },
  { month: 'Aug 25', fullMonth: 'August 2025', year: 2025, incidents: 8, criticalIncidents: 2, rainfallMm: 310 },
  { month: 'Sep 25', fullMonth: 'September 2025', year: 2025, incidents: 7, criticalIncidents: 2, rainfallMm: 290 },
  { month: 'Oct 25', fullMonth: 'October 2025', year: 2025, incidents: 3, criticalIncidents: 1, rainfallMm: 120 },
  { month: 'Nov 25', fullMonth: 'November 2025', year: 2025, incidents: 0, criticalIncidents: 0, rainfallMm: 35 },
  { month: 'Dec 25', fullMonth: 'December 2025', year: 2025, incidents: 0, criticalIncidents: 0, rainfallMm: 20 },
  { month: 'Jan 26', fullMonth: 'January 2026', year: 2026, incidents: 1, criticalIncidents: 0, rainfallMm: 30 },
  { month: 'Feb 26', fullMonth: 'February 2026', year: 2026, incidents: 1, criticalIncidents: 0, rainfallMm: 55 },
  { month: 'Mar 26', fullMonth: 'March 2026', year: 2026, incidents: 3, criticalIncidents: 1, rainfallMm: 95 },
  { month: 'Apr 26', fullMonth: 'April 2026', year: 2026, incidents: 6, criticalIncidents: 1, rainfallMm: 190 },
  { month: 'May 26', fullMonth: 'May 2026', year: 2026, incidents: 11, criticalIncidents: 3, rainfallMm: 390 },
  { month: 'Jun 26', fullMonth: 'June 2026', year: 2026, incidents: 16, criticalIncidents: 5, rainfallMm: 540 },
  { month: 'Jul 26', fullMonth: 'July 2026', year: 2026, incidents: 18, criticalIncidents: 6, rainfallMm: 560 },
  { month: 'Aug 26', fullMonth: 'August 2026', year: 2026, incidents: 12, criticalIncidents: 3, rainfallMm: 330 },
  { month: 'Sep 26', fullMonth: 'September 2026', year: 2026, incidents: 4, criticalIncidents: 0, rainfallMm: 180 }
];

// 12 Realistic Historical Incidents across NER states (marked as prototype demo data)
export const MOCK_HISTORICAL_INCIDENTS: HistoricalIncident[] = [
  {
    id: 'INC-2026-081',
    date: '18 Aug 2026',
    rawDate: '2026-08-18',
    location: 'Gangtok (KM 22 NH-10)',
    district: 'East Sikkim',
    state: 'Sikkim',
    severity: 'Emergency',
    rainfall: '142 mm / 24h',
    rainfallMm: 142,
    impact: 'Full highway blockage; single lane restored after 14 hrs',
    status: 'Debris Cleared',
    estimatedAffectedArea: '1,450 sq. meters',
    infrastructureImpact: 'NH-10 arterial corridor severed, optical fiber trunk severed, 2 electric utility poles downed',
    description: 'Catastrophic slope failure along the steep cutting near KM 22 Singtam-Gangtok section after 36 hours of continuous precipitation. Debris volume exceeded 3,200 metric tonnes.'
  },
  {
    id: 'INC-2026-079',
    date: '29 Jul 2026',
    rawDate: '2026-07-29',
    location: 'Shillong (Nongpoh Ridge, GS Road)',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    severity: 'Warning',
    rainfall: '118 mm / 24h',
    rainfallMm: 118,
    impact: 'Mudflow deposits on outer lane; precautionary speed limit imposed',
    status: 'Resolved',
    estimatedAffectedArea: '680 sq. meters',
    infrastructureImpact: 'GS Road outer lane drainage clogged, retaining wall toe erosion monitored',
    description: 'Surface rotational slide triggered by heavy downpour along the sandstone-shale transition zone. Excavators deployed by Meghalaya PWD to clear saturated mud.'
  },
  {
    id: 'INC-2026-072',
    date: '14 Jul 2026',
    rawDate: '2026-07-14',
    location: 'Aizawl (Sairang Bypass Corridor)',
    district: 'Aizawl',
    state: 'Mizoram',
    severity: 'Emergency',
    rainfall: '135 mm / 24h',
    rainfallMm: 135,
    impact: 'Road embankment subsided; heavy vehicles rerouted through bypass',
    status: 'Under Monitoring',
    estimatedAffectedArea: '1,100 sq. meters',
    infrastructureImpact: 'Lower hillside retaining gabion shifted 35 cm, regional water delivery pipe burst',
    description: 'Deep-seated translational slide along steep slope following torrential monsoon activity. Geotechnical stabilization and wire-mesh anchoring underway.'
  },
  {
    id: 'INC-2026-068',
    date: '02 Jul 2026',
    rawDate: '2026-07-02',
    location: 'Kohima (Zubza NH-29 Bypass)',
    district: 'Kohima',
    state: 'Nagaland',
    severity: 'Warning',
    rainfall: '98 mm / 24h',
    rainfallMm: 98,
    impact: 'Boulders and clay blocked both lanes for 8 hours',
    status: 'Resolved',
    estimatedAffectedArea: '520 sq. meters',
    infrastructureImpact: 'Culvert structural crack, telecom sub-station cable conduit displaced',
    description: 'Rockfall and mudwash originated from an unlined hillside terrace during intense localized storm. Cleared with heavy earthmovers by BRO task force.'
  },
  {
    id: 'INC-2026-061',
    date: '21 Jun 2026',
    rawDate: '2026-06-21',
    location: 'Itanagar (Hollongi Link Road)',
    district: 'Papum Pare',
    state: 'Arunachal Pradesh',
    severity: 'Warning',
    rainfall: '104 mm / 24h',
    rainfallMm: 104,
    impact: 'Slurry runoff over road surface; traffic slowed to single lane',
    status: 'Resolved',
    estimatedAffectedArea: '400 sq. meters',
    infrastructureImpact: 'Roadside masonry drain fractured over a 30m length',
    description: 'Topsoil wash-off and minor slip caused by sudden rainfall burst in Papum Pare foothills. Slope regraded with sandbags.'
  },
  {
    id: 'INC-2026-055',
    date: '11 Jun 2026',
    rawDate: '2026-06-11',
    location: 'Gyalshing Slopes (Pelling Road)',
    district: 'West Sikkim',
    state: 'Sikkim',
    severity: 'Watch',
    rainfall: '76 mm / 24h',
    rainfallMm: 76,
    impact: 'Minor pebble fall; caution flags installed for night motorists',
    status: 'Restabilized',
    estimatedAffectedArea: '220 sq. meters',
    infrastructureImpact: 'Safety roadside parapet pushed outward 10 cm',
    description: 'Superficial debris movement across an agricultural terrace above the road. No structural damage to primary asphalt pavement.'
  },
  {
    id: 'INC-2026-048',
    date: '28 May 2026',
    rawDate: '2026-05-28',
    location: 'Imphal (Kangpokpi Ridge Highway)',
    district: 'Imphal West',
    state: 'Manipur',
    severity: 'Watch',
    rainfall: '68 mm / 24h',
    rainfallMm: 68,
    impact: 'Soil slip along embankment; barricaded for immediate drainage works',
    status: 'Resolved',
    estimatedAffectedArea: '180 sq. meters',
    infrastructureImpact: 'Shoulder verge erosion along highway edge',
    description: 'Pre-monsoon soil wash along unpaved highway verge. Drainage trenches opened to prevent progressive slope saturation.'
  },
  {
    id: 'INC-2026-041',
    date: '17 May 2026',
    rawDate: '2026-05-17',
    location: 'Haflong (Jatinga Valley Sector)',
    district: 'Dima Hasao',
    state: 'Assam',
    severity: 'Emergency',
    rainfall: '128 mm / 24h',
    rainfallMm: 128,
    impact: 'Railway track ballast destabilized; passenger trains halted for 18 hrs',
    status: 'Debris Cleared',
    estimatedAffectedArea: '1,800 sq. meters',
    infrastructureImpact: 'Lumding-Badarpur railway section track foundation undermined by mudflow',
    description: 'Heavy pre-monsoon deluge caused extensive slope failure along unstable shale cliffs in Jatinga valley. Railway engineering staff performed emergency track packing.'
  },
  {
    id: 'INC-2026-035',
    date: '04 May 2026',
    rawDate: '2026-05-04',
    location: 'Mawkdok Canyon Overlook',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    severity: 'Normal',
    rainfall: '52 mm / 24h',
    rainfallMm: 52,
    impact: 'Minor soil creep into roadside ditch; zero disruption to transit',
    status: 'Resolved',
    estimatedAffectedArea: '95 sq. meters',
    infrastructureImpact: 'None; normal drainage channel intercepted runoff successfully',
    description: 'Controlled runoff movement observed during routine patrol. Retaining structures held firmly with no tension cracks.'
  },
  {
    id: 'INC-2026-022',
    date: '12 Apr 2026',
    rawDate: '2026-04-12',
    location: 'Bhalukpong (Kameng River Escarpment)',
    district: 'West Kameng',
    state: 'Arunachal Pradesh',
    severity: 'Watch',
    rainfall: '72 mm / 24h',
    rainfallMm: 72,
    impact: 'Loose rock fragments scattered on roadside; cleared in 40 mins',
    status: 'Resolved',
    estimatedAffectedArea: '150 sq. meters',
    infrastructureImpact: 'Minor surface pitting on outer bituminous shoulder',
    description: 'Weathering of steep sedimentary rockface caused rock detachment following mild unseasonal downpour.'
  },
  {
    id: 'INC-2026-015',
    date: '25 Mar 2026',
    rawDate: '2026-03-25',
    location: 'Jampui Hills (Vanghmun Pass)',
    district: 'North Tripura',
    state: 'Tripura',
    severity: 'Normal',
    rainfall: '38 mm / 24h',
    rainfallMm: 38,
    impact: 'Slight silt accumulation in roadside stormwater drain',
    status: 'Resolved',
    estimatedAffectedArea: '80 sq. meters',
    infrastructureImpact: 'None',
    description: 'Low-intensity soil displacement during spring shower. Catchment drains functioned nominally without obstruction.'
  },
  {
    id: 'INC-2026-009',
    date: '08 Feb 2026',
    rawDate: '2026-02-08',
    location: 'Dikchu Foothills (North Sikkim Road)',
    district: 'North Sikkim',
    state: 'Sikkim',
    severity: 'Watch',
    rainfall: '44 mm / 24h',
    rainfallMm: 44,
    impact: 'Muck and debris spilled across 15m road section; one-way traffic maintained',
    status: 'Restabilized',
    estimatedAffectedArea: '260 sq. meters',
    infrastructureImpact: 'Temporary barrier damaged by sliding boulders',
    description: 'Freeze-thaw weathering followed by winter rain triggered minor scree slide on northern slope flank.'
  }
];
