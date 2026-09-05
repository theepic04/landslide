import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapRiskLocation, STATE_MAP_VIEWS } from '../data/mapRiskData';
import { useTheme } from '../context/ThemeContext';
import { Plus, Minus, RotateCcw, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';

interface GeographicRiskMapProps {
  locations: MapRiskLocation[];
  selectedLocation: MapRiskLocation | null;
  onSelectLocation: (location: MapRiskLocation) => void;
  selectedState: string;
  userLocation: {
    lat: number;
    lng: number;
    name?: string;
    isLive?: boolean;
    fallbackNotice?: string;
  } | null;
  currentRole?: 'citizen' | 'authority';
  showAuthorityOverlay?: boolean;
  className?: string;
}

export const GeographicRiskMap: React.FC<GeographicRiskMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  selectedState,
  userLocation,
  currentRole = 'citizen',
  showAuthorityOverlay = false,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  const { theme } = useTheme();

  // Create custom HTML icon for each risk marker
  const createRiskMarkerIcon = (
    location: MapRiskLocation,
    isSelected: boolean,
    isAuthority: boolean
  ) => {
    const rLevel = location.riskLevel.toLowerCase();
    const isCritical = rLevel === 'critical';
    const isHigh = rLevel === 'high';
    const isWatch = rLevel === 'watch';

    const color = isCritical
      ? '#dc2626'
      : isHigh
      ? '#ea580c'
      : isWatch
      ? '#ca8a04'
      : '#16a34a';

    const bgBadge = isCritical
      ? '#fef2f2'
      : isHigh
      ? '#fff7ed'
      : isWatch
      ? '#fefce8'
      : '#f0fdf4';

    const borderBadge = isCritical
      ? '#fca5a5'
      : isHigh
      ? '#fdba74'
      : isWatch
      ? '#fde047'
      : '#86efac';

    const pulseHtml = (isCritical || isHigh)
      ? `<div class="absolute -inset-2 rounded-full opacity-40 animate-ping" style="background-color: ${color};"></div>`
      : '';

    const selectedHalo = isSelected
      ? `<div class="absolute -inset-3 rounded-full border-2 border-dashed border-slate-900 dark:border-white opacity-85"></div>`
      : '';

    const authorityBadge = (isAuthority && location.isAuthorityAlert)
      ? `<div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-black shadow-xs border border-white dark:border-slate-900">!</div>`
      : '';

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer group" style="width: 36px; height: 36px;">
        ${selectedHalo}
        ${pulseHtml}
        <div class="relative flex items-center justify-center w-7 h-7 rounded-full shadow-md border-2 border-white dark:border-slate-900 transition-transform group-hover:scale-110" style="background-color: ${color};">
          <div class="w-2.5 h-2.5 rounded-full bg-white opacity-95"></div>
        </div>
        ${authorityBadge}
        <!-- Floating mini state label on hover or when selected -->
        <div class="absolute left-9 px-2 py-0.5 rounded-md shadow-xs text-[11px] font-bold whitespace-nowrap pointer-events-none transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
          ${location.name} (${location.probability}%)
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'bhunetra-custom-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  };

  // Create User Location GPS Icon
  const createUserLocationIcon = () => {
    const html = `
      <div class="relative flex items-center justify-center cursor-pointer" style="width: 32px; height: 32px;">
        <div class="absolute -inset-2 rounded-full bg-blue-500 opacity-35 animate-ping"></div>
        <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 shadow-md flex items-center justify-center">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
      </div>
    `;
    return L.divIcon({
      html,
      className: 'bhunetra-user-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  // Build clean popup content
  const buildPopupHtml = (loc: MapRiskLocation) => {
    const rLevel = loc.riskLevel.toLowerCase();
    const isCritical = rLevel === 'critical';
    const isHigh = rLevel === 'high';
    const isWatch = rLevel === 'watch';

    const riskBg = isCritical
      ? 'background: #dc2626; color: #ffffff;'
      : isHigh
      ? 'background: #ea580c; color: #ffffff;'
      : isWatch
      ? 'background: #ca8a04; color: #ffffff;'
      : 'background: #16a34a; color: #ffffff;';

    const infrastructureHtml = (currentRole === 'authority' && loc.affectedInfrastructure && loc.affectedInfrastructure.length > 0)
      ? `
        <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed rgba(100,116,139,0.3);">
          <div style="font-size: 10px; font-weight: 700; color: #ea580c; text-transform: uppercase;">Infrastructure at Risk</div>
          <div style="font-size: 11px; margin-top: 2px;">${loc.affectedInfrastructure.join(', ')}</div>
        </div>
      `
      : '';

    return `
      <div style="padding: 12px 14px; font-family: inherit; min-width: 230px; max-width: 280px;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
          <div>
            <div style="font-size: 13px; font-weight: 800; line-height: 1.2;">${loc.name}</div>
            <div style="font-size: 11px; opacity: 0.75; margin-top: 2px;">${loc.district ? loc.district + ', ' : ''}${loc.state}</div>
          </div>
          <span style="font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; text-transform: uppercase; ${riskBg}">
            ${loc.riskLevel}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 8px 0; font-size: 11px;">
          <div style="padding: 4px 6px; border-radius: 6px; background: rgba(148,163,184,0.12);">
            <span style="display: block; font-size: 9px; opacity: 0.7; text-transform: uppercase;">Probability</span>
            <strong style="font-size: 13px;">${loc.probability}%</strong>
          </div>
          <div style="padding: 4px 6px; border-radius: 6px; background: rgba(148,163,184,0.12);">
            <span style="display: block; font-size: 9px; opacity: 0.7; text-transform: uppercase;">Window</span>
            <strong style="font-size: 11px;">${loc.predictionWindow}</strong>
          </div>
        </div>

        <div style="font-size: 11px; opacity: 0.85; line-height: 1.4; margin-bottom: 6px;">
          <div>🌧️ <strong>Rainfall (24h):</strong> ${loc.rainfall24h} mm</div>
          <div>💧 <strong>Soil Moisture:</strong> ${loc.soilMoisture}%</div>
          <div>⛰️ <strong>Slope Angle:</strong> ${loc.slopeAngle}°</div>
          <div>📡 <strong>Status:</strong> ${loc.status}</div>
        </div>

        ${infrastructureHtml}

        <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(148,163,184,0.2); display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 9px; opacity: 0.6; font-style: italic;">Prototype / Sample data</span>
          <span style="font-size: 10px; font-weight: 700; color: #0284c7;">Click to inspect ➔</span>
        </div>
      </div>
    `;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center over North Eastern Region (NER)
    const initialView = STATE_MAP_VIEWS['All States'];

    const map = L.map(mapContainerRef.current, {
      center: initialView.center,
      zoom: initialView.zoom,
      minZoom: 5.5,
      maxZoom: 13,
      zoomControl: false, // We use custom accessible controls
      attributionControl: true
    });

    // Tile Layer: Use CartoDB Dark Matter for Dark mode, OpenStreetMap/Voyager for Light mode
    const tileUrl =
      theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution =
      theme === 'dark'
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create layer group for risk markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    mapInstanceRef.current = map;

    // Resize observer to ensure full container rendering
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when Theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const tileUrl =
      theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [theme]);

  // Update Markers when locations, selectedLocation, or role change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    markersMapRef.current.clear();

    locations.forEach((loc) => {
      const isSelected = selectedLocation?.id === loc.id;
      const icon = createRiskMarkerIcon(loc, isSelected, currentRole === 'authority');

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], {
        icon,
        title: loc.name
      });

      marker.bindPopup(buildPopupHtml(loc), {
        className: 'bhunetra-popup-bubble'
      });

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      marker.addTo(markersLayerRef.current!);
      markersMapRef.current.set(loc.id, marker);

      // If this location is currently selected, open popup
      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [locations, selectedLocation?.id, currentRole]);

  // Pan to selected location when changed externally
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;
    const marker = markersMapRef.current.get(selectedLocation.id);
    if (marker) {
      marker.openPopup();
      mapInstanceRef.current.panTo([
        selectedLocation.coordinates.lat,
        selectedLocation.coordinates.lng
      ]);
    }
  }, [selectedLocation?.id]);

  // Fly to state center when state filter changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const targetView = STATE_MAP_VIEWS[selectedState] || STATE_MAP_VIEWS['All States'];

    // If locations exist for this state, fit bounds
    if (selectedState !== 'All States' && locations.length > 0) {
      const latLngs = locations.map((l) => [l.coordinates.lat, l.coordinates.lng] as [number, number]);
      const bounds = L.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    } else {
      mapInstanceRef.current.flyTo(targetView.center, targetView.zoom, { duration: 1.2 });
    }
  }, [selectedState]);

  // Update User Location Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const icon = createUserLocationIcon();
      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon,
        zIndexOffset: 1000
      });

      const popupHtml = `
        <div style="padding: 10px 12px; font-family: inherit;">
          <div style="font-size: 10px; font-weight: 700; color: #2563eb; text-transform: uppercase;">
            ${userLocation.isLive ? '📍 Detected Location' : '📍 Fallback Location'}
          </div>
          <div style="font-size: 13px; font-weight: 800; margin-top: 2px;">
            ${userLocation.name || 'Your Location'}
          </div>
          ${
            userLocation.fallbackNotice
              ? `<div style="font-size: 10px; opacity: 0.75; margin-top: 4px;">${userLocation.fallbackNotice}</div>`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.addTo(mapInstanceRef.current);
      userMarkerRef.current = marker;

      // Pan to user location
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 9, { duration: 1.2 });
    }
  }, [userLocation]);

  // Control handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleReset = () => {
    if (mapInstanceRef.current) {
      const view = STATE_MAP_VIEWS['All States'];
      mapInstanceRef.current.flyTo(view.center, view.zoom, { duration: 1.2 });
    }
  };

  return (
    <div
      id="geographic-risk-map-container"
      className={`relative w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 ${className}`}
    >
      {/* Actual Leaflet DOM container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[380px] sm:min-h-[460px] md:min-h-[520px]"
        style={{ zIndex: 1 }}
      />

      {/* Map Floating Controls (Top Right: +, -, Reset) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-xl shadow-md border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        <button
          type="button"
          id="map-zoom-in-btn"
          title="Zoom In"
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          id="map-zoom-out-btn"
          title="Zoom Out"
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          id="map-reset-view-btn"
          title="Reset to All 8 States"
          onClick={handleReset}
          className="px-2 py-1.5 flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>NER</span>
        </button>
      </div>

      {/* Floating State/Coverage Badge (Top Left) */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none flex flex-col gap-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200 dark:border-slate-800 shadow-xs text-[11px] font-bold text-slate-800 dark:text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>8 North Eastern States</span>
        </div>
        {currentRole === 'authority' && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600/90 text-white shadow-xs text-[10px] font-extrabold uppercase tracking-wide">
            <ShieldCheck className="w-3 h-3" />
            <span>Authority GIS Monitoring</span>
          </div>
        )}
      </div>

      {/* Data Source Notice (Bottom Left) */}
      <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
        <div className="px-2 py-1 rounded-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
          Sample Risk Locations • OpenStreetMap Base
        </div>
      </div>
    </div>
  );
};
