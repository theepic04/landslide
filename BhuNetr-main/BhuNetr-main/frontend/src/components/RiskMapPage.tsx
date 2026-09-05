import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  X,
  Droplets,
  CloudRain,
  Thermometer,
  Mountain,
  Clock,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Filter,
  CheckCircle2,
  Info,
  Layers,
  HelpCircle
} from 'lucide-react';
import { RiskZone, LanguageCode } from '../types';
import {
  PROTOTYPE_MAP_LOCATIONS,
  MapRiskLocation,
  NER_STATES,
  searchMapLocations,
  mapLocationToRiskZone
} from '../data/mapRiskData';
import { GeographicRiskMap } from './GeographicRiskMap';
import { getTranslation } from '../data/translations';

interface RiskMapPageProps {
  onNavigate: (page: string) => void;
  preSelectedZone?: RiskZone | null;
  currentRole?: 'citizen' | 'authority';
  selectedLanguage?: LanguageCode;
}

export const RiskMapPage: React.FC<RiskMapPageProps> = ({
  onNavigate,
  preSelectedZone,
  currentRole = 'citizen',
  selectedLanguage = 'en'
}) => {
  const t = getTranslation(selectedLanguage);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [authorityHighCriticalOnly, setAuthorityHighCriticalOnly] = useState<boolean>(false);

  // Selected map location (defaults to Sikkim Zone 04 or preSelectedZone)
  const initialLocation = useMemo(() => {
    if (preSelectedZone) {
      const match = PROTOTYPE_MAP_LOCATIONS.find((l) => l.id === preSelectedZone.id);
      if (match) return match;
    }
    return PROTOTYPE_MAP_LOCATIONS[0];
  }, [preSelectedZone]);

  const [selectedLocation, setSelectedLocation] = useState<MapRiskLocation>(initialLocation);

  // Sync if preSelectedZone changes
  useEffect(() => {
    if (preSelectedZone) {
      const match = PROTOTYPE_MAP_LOCATIONS.find((l) => l.id === preSelectedZone.id);
      if (match) {
        setSelectedLocation(match);
      }
    }
  }, [preSelectedZone]);

  // Geolocation state (Current Location)
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name?: string;
    isLive?: boolean;
    fallbackNotice?: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Details Modal
  const [showRiskModal, setShowRiskModal] = useState(false);

  // Single-shot Geolocation handler with graceful fallback
  const handleUseMyLocation = () => {
    setIsLocating(true);
    setLocationNotice(null);

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // Check if coordinates roughly fall near NER (latitude ~21-30, longitude ~88-98)
          const isNearNER = lat >= 21.0 && lat <= 30.0 && lng >= 87.5 && lng <= 98.0;

          setUserLocation({
            lat,
            lng,
            name: isNearNER ? 'Your Location (NER Region)' : 'Your Detected Device Location',
            isLive: true
          });
          setLocationNotice('Geolocation centered on your current position.');
        },
        (err) => {
          setIsLocating(false);
          // Graceful fallback to default mock location (Gangtok, Sikkim)
          const fallback = PROTOTYPE_MAP_LOCATIONS.find((l) => l.id === 'zone-04') || PROTOTYPE_MAP_LOCATIONS[0];
          setUserLocation({
            lat: fallback.coordinates.lat,
            lng: fallback.coordinates.lng,
            name: 'Gangtok, Sikkim (Default Sample Reference)',
            isLive: false,
            fallbackNotice: 'Location permission was denied or unavailable. Centered to regional reference point in East Sikkim.'
          });
          setSelectedLocation(fallback);
          setLocationNotice('Location permission unavailable. Centered to default reference in Gangtok, Sikkim.');
        },
        { timeout: 7000, maximumAge: 300000, enableHighAccuracy: false }
      );
    } else {
      setIsLocating(false);
      const fallback = PROTOTYPE_MAP_LOCATIONS.find((l) => l.id === 'zone-04') || PROTOTYPE_MAP_LOCATIONS[0];
      setUserLocation({
        lat: fallback.coordinates.lat,
        lng: fallback.coordinates.lng,
        name: 'Gangtok, Sikkim (Default Sample Reference)',
        isLive: false,
        fallbackNotice: 'Browser geolocation is unavailable. Using default regional reference point.'
      });
      setSelectedLocation(fallback);
      setLocationNotice('Geolocation not supported. Centered to default reference.');
    }
  };

  // Filter locations
  const filteredLocations = useMemo(() => {
    let result = PROTOTYPE_MAP_LOCATIONS;

    // Search query filter
    if (searchQuery.trim()) {
      result = searchMapLocations(searchQuery, result);
    }

    // State filter
    if (selectedState !== 'All States') {
      result = result.filter((loc) => loc.state.toLowerCase() === selectedState.toLowerCase());
    }

    // Risk level filter
    if (selectedRiskFilter !== 'All') {
      result = result.filter(
        (loc) => loc.riskLevel.toLowerCase() === selectedRiskFilter.toLowerCase()
      );
    }

    // Authority Priority Filter
    if (currentRole === 'authority' && authorityHighCriticalOnly) {
      result = result.filter(
        (loc) => loc.riskLevel === 'Critical' || loc.riskLevel === 'High'
      );
    }

    return result;
  }, [searchQuery, selectedState, selectedRiskFilter, currentRole, authorityHighCriticalOnly]);

  // Handle Search Submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const matched = searchMapLocations(searchQuery, PROTOTYPE_MAP_LOCATIONS);
    if (matched.length > 0) {
      setSelectedLocation(matched[0]);
    }
  };

  // Helper badge color
  const getRiskBadgeClasses = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'watch':
        return 'bg-yellow-400 text-slate-900 font-bold';
      case 'low':
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#080f1e] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-150">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* ==================================================
            PAGE HEADER & CONTROLS
            ================================================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1e3256]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#f8fafc] tracking-tight">
                {t.riskMap}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Prototype v2.4
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-[#cbd5e1] max-w-2xl">
              Geographic landslide risk interface covering all 8 North Eastern States of India (OpenStreetMap Base).
            </p>
          </div>

          {/* Search bar + Use My Location */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
              <div className="relative flex-1 sm:w-64">
                <input
                  id="risk-map-search-input"
                  type="text"
                  placeholder={t.searchPlaceholder || "Search location, state, corridor..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-[#14223b] border border-slate-300 dark:border-[#243c63] focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 dark:text-[#f1f5f9] placeholder-slate-400 dark:placeholder-slate-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                id="risk-map-search-btn"
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                {t.search}
              </button>
            </form>

            <button
              id="use-my-location-btn"
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer disabled:opacity-60"
            >
              <Navigation className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Current Location'}</span>
            </button>
          </div>
        </div>

        {/* NOTIFICATION / FALLBACK NOTICE BANNER */}
        {locationNotice && (
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{locationNotice}</span>
            </div>
            <button
              onClick={() => setLocationNotice(null)}
              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ==================================================
            COMPACT MAP LEGEND & FILTERS (Clean, above the map)
            ================================================== */}
        <div className="bg-white dark:bg-[#121d33] rounded-2xl border border-slate-200 dark:border-[#1e3256] p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.legend}:</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span>Watch</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span>Critical</span>
            </div>

            {currentRole === 'authority' && (
              <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 font-bold border-l border-slate-200 dark:border-slate-700 pl-3">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Active Alert</span>
              </div>
            )}
          </div>

          {/* Filters: Risk Level & State */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-500 dark:text-slate-400 mr-1">Risk:</span>
              {['All', 'Critical', 'High', 'Watch', 'Low'].map((lvl) => (
                <button
                  key={lvl}
                  id={`filter-risk-${lvl.toLowerCase()}`}
                  onClick={() => setSelectedRiskFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    selectedRiskFilter === lvl
                      ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-[#16243d] text-slate-600 dark:text-[#cbd5e1] hover:bg-slate-200 dark:hover:bg-[#1e3254]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* State Filter covering all 8 NER States */}
            <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
              <span className="font-bold text-slate-500 dark:text-slate-400">State:</span>
              <select
                id="filter-state-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-[#14223b] border border-slate-300 dark:border-[#243c63] font-semibold text-slate-800 dark:text-[#f1f5f9] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
              >
                {NER_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Authority Priority Filter Toggle */}
            {currentRole === 'authority' && (
              <button
                type="button"
                id="authority-priority-toggle-btn"
                onClick={() => setAuthorityHighCriticalOnly(!authorityHighCriticalOnly)}
                className={`ml-0 sm:ml-2 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  authorityHighCriticalOnly
                    ? 'bg-red-700 text-white'
                    : 'bg-slate-100 dark:bg-[#16243d] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                <ShieldAlert className="w-3 h-3" />
                <span>High & Critical Only</span>
              </button>
            )}
          </div>
        </div>

        {/* ==================================================
            MAIN CONTENT: GEOGRAPHIC MAP (LEFT) + DETAILS PANEL (RIGHT)
            ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ==================================================
              GEOGRAPHIC MAP VIEW (8 Cols on Desktop)
              ================================================== */}
          <div className="lg:col-span-8 bg-white dark:bg-[#121d33] rounded-2xl border border-slate-200 dark:border-[#1e3256] shadow-2xs p-4 sm:p-5 flex flex-col justify-between">
            
            {/* Header above map */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#182842] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide">
                  North Eastern Region • Geographic Hazard Network
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                {filteredLocations.length} locations active on map
              </span>
            </div>

            {/* Real Geographic Map Component */}
            <GeographicRiskMap
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onSelectLocation={(loc) => setSelectedLocation(loc)}
              selectedState={selectedState}
              userLocation={userLocation}
              currentRole={currentRole}
              showAuthorityOverlay={authorityHighCriticalOnly}
              className="shadow-inner"
            />

            {/* Subtext below map */}
            <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>All 8 NER States: Sikkim, Arunachal, Assam, Meghalaya, Nagaland, Manipur, Mizoram, Tripura</span>
              </span>
              <span className="text-[11px] italic">
                * Prototype / sample data points for interface testing
              </span>
            </div>
          </div>

          {/* ==================================================
              LOCATION DETAILS PANEL (4 Cols on Desktop)
              ================================================== */}
          <div className="lg:col-span-4 bg-white dark:bg-[#121d33] rounded-2xl border-2 border-slate-200 dark:border-[#1e3256] shadow-2xs p-5 flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#182842]">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Location Details
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black ${getRiskBadgeClasses(
                    selectedLocation.riskLevel
                  )}`}
                >
                  {selectedLocation.riskLevel.toUpperCase()}
                </span>
              </div>

              {/* Exact Fields */}
              <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
                
                {/* Location & District */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-100 dark:border-[#182842]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">{t.location}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">{selectedLocation.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {selectedLocation.district ? `${selectedLocation.district}, ` : ''}{selectedLocation.state} • {selectedLocation.subRegion}
                  </div>
                </div>

                {/* Current Risk */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-100 dark:border-[#182842]">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">{t.currentRisk}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${getRiskBadgeClasses(
                      selectedLocation.riskLevel
                    )}`}
                  >
                    {selectedLocation.riskLevel.toUpperCase()}
                  </span>
                </div>

                {/* Landslide Probability */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-100 dark:border-[#182842]">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">{t.landslideProbability || 'Probability'}</span>
                  <span className="font-black text-slate-900 dark:text-white text-sm sm:text-base">
                    {selectedLocation.probability}%
                  </span>
                </div>

                {/* Rainfall */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-100 dark:border-[#182842]">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{t.rainfall}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedLocation.rainfall24h} mm / 24h
                  </span>
                </div>

                {/* Soil Moisture */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-100 dark:border-[#182842]">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>{t.soilMoisture}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedLocation.soilMoisture}%</span>
                </div>

                {/* Slope Angle */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-100 dark:border-[#182842]">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.slope}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedLocation.slopeAngle}°</span>
                </div>

                {/* Prediction Window */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-100 dark:border-[#182842]">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{t.prediction}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedLocation.predictionWindow}</span>
                </div>

                {/* Current Status */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-100 dark:border-[#182842]">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Status</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLocation.status}</span>
                </div>
              </div>

              {/* Active Warning / Advisory */}
              {selectedLocation.activeWarning && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <span className="font-bold text-amber-950 dark:text-amber-100">Advisory: </span>
                  {selectedLocation.activeWarning}
                </div>
              )}

              {/* Authority Only: Infrastructure Details */}
              {currentRole === 'authority' && selectedLocation.affectedInfrastructure && (
                <div className="mt-3 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs space-y-1">
                  <div className="font-bold text-blue-900 dark:text-blue-200 uppercase text-[10px] tracking-wide">
                    Identified Infrastructure
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-medium">
                    {selectedLocation.affectedInfrastructure.join(' • ')}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-[#182842] space-y-2">
              <button
                id="view-risk-details-btn"
                onClick={() => setShowRiskModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{t.viewDetails}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="safe-routes-from-map-btn"
                onClick={() => onNavigate('emergency')}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#16243d] hover:bg-slate-200 dark:hover:bg-[#1e3254] text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t.emergencyHelp} & {t.safeRoutes}</span>
              </button>
            </div>
          </div>

        </div>

        {/* ==================================================
            AUTHORITY EXTENDED INFORMATION SECTION
            ================================================== */}
        {currentRole === 'authority' && (
          <div className="bg-white dark:bg-[#121d33] rounded-2xl border border-slate-200 dark:border-[#1e3256] p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-[#182842] gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                    Authority Dashboard
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {t.infrastructureRisk} Overview
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Active monitoring telemetry, high-hazard corridors and response team deployment points.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="authority-view-alerts-workflow-btn"
                  onClick={() => onNavigate('authority-alerts')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#16243d] hover:bg-slate-200 dark:hover:bg-[#1e3254] text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>{t.alertManagement}</span>
                </button>
                <button
                  id="authority-view-infrastructure-risk-btn"
                  onClick={() => onNavigate('infrastructure-risk')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <span>{t.viewDetails}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#182842] flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">🛣 Roads Monitored</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  12
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  NH-10, NH-29, Bhalukpong
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#182842] flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">🌉 Bridges / Culverts</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  4
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Singtam, Zubza, Tupul
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#182842] flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">🏫 Shelters Staged</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  6
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Emergency relief capacity
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#182842] flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">🚨 Field Teams</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  5
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  NDRF, BRO, SDRF standby
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==================================================
          MODAL: VIEW RISK DETAILS
          ================================================== */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#121d33] rounded-2xl border border-slate-200 dark:border-[#1e3256] shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-[#182842]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Comprehensive Risk Assessment
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedLocation.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedLocation.district ? `${selectedLocation.district}, ` : ''}{selectedLocation.state} • {selectedLocation.subRegion}
                </p>
              </div>
              <button
                id="close-risk-modal-btn"
                onClick={() => setShowRiskModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#182842] grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs">Hazard Level:</span>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-black ${getRiskBadgeClasses(
                      selectedLocation.riskLevel
                    )}`}
                  >
                    {selectedLocation.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs">Failure Probability:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">
                    {selectedLocation.probability}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs">Prediction Window:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedLocation.predictionWindow}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs">Last Updated:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedLocation.lastUpdated}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1527] border border-slate-200 dark:border-[#182842] space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Environmental Sensor Telemetry
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Rainfall (24h)</span>
                    <strong className="text-slate-900 dark:text-white">{selectedLocation.rainfall24h} mm</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Soil Moisture</span>
                    <strong className="text-slate-900 dark:text-white">{selectedLocation.soilMoisture}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Slope Angle</span>
                    <strong className="text-slate-900 dark:text-white">{selectedLocation.slopeAngle}°</strong>
                  </div>
                </div>
              </div>

              {selectedLocation.activeWarning && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <strong>Official Advisory: </strong>
                  {selectedLocation.activeWarning}
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-[#16243d] text-[11px] text-slate-500 dark:text-slate-400">
                Data Status: Prototype evaluation telemetry. In future releases, this node links directly to the 2-year GSI and SDMA historical geotechnical database.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#182842]">
              <button
                onClick={() => setShowRiskModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                {t.close}
              </button>
              <button
                onClick={() => {
                  setShowRiskModal(false);
                  onNavigate('emergency');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t.emergencyHelp}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
