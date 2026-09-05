import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  CloudRain,
  Droplets,
  Thermometer,
  Mountain,
  Camera,
  Navigation,
  LifeBuoy,
  Clock,
  ArrowRight
} from 'lucide-react';

import { LanguageCode } from '../types';
import { getTranslation } from '../data/translations';

interface CitizenDashboardProps {
  onNavigate: (page: string) => void;
  selectedLanguage?: LanguageCode;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ onNavigate, selectedLanguage = 'en' }) => {
  const [currentLocation] = useState('Gangtok, Sikkim');
  const t = getTranslation(selectedLanguage);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* MAIN SECTION HEADING & LOCATION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.location}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t.subTitle}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xs text-slate-800 dark:text-slate-200 text-sm font-semibold w-fit">
            <span className="text-base leading-none">📍</span>
            <span>{currentLocation}</span>
          </div>
        </div>

        {/* ONE PROMINENT RISK CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-300 dark:border-amber-600/60 shadow-xs p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.currentRisk}
              </span>
              <div className="flex items-center gap-2.5 mt-1.5">
                <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                  {t.high}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  {t.elevated}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                {t.landslideProbability}:
              </span>
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                78%
              </span>
            </div>
          </div>

          {/* Prediction Window */}
          <div className="mt-4 pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                {t.prediction}: <strong className="text-slate-900 dark:text-white">{t.next12to24Hours}</strong>
              </span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {t.lastUpdated}
            </span>
          </div>

          {/* Message */}
          <p className="mt-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60">
            {selectedLanguage === 'en'
              ? 'Risk is currently elevated due to rainfall and soil moisture.'
              : `${t.rainfall} & ${t.soilMoisture} • ${t.currentRisk}: ${t.high}`}
          </p>
        </div>

        {/* 4 SIMPLE CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* 🌧 Rainfall */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-2">
              <span className="text-xs font-bold">🌧 {t.rainfall}</span>
              <CloudRain className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                92 mm / 24h
              </div>
              <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">{t.rainfall24h}</div>
            </div>
          </div>

          {/* 💧 Soil Moisture */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-2">
              <span className="text-xs font-bold">💧 {t.soilMoisture}</span>
              <Droplets className="w-4 h-4 text-cyan-500" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                81%
              </div>
              <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">{t.critical}</div>
            </div>
          </div>

          {/* 🌡 Temperature */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-2">
              <span className="text-xs font-bold">🌡 {t.temperature}</span>
              <Thermometer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                24°C
              </div>
              <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">{t.normal}</div>
            </div>
          </div>

          {/* ⛰ Slope */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-2">
              <span className="text-xs font-bold">⛰ {t.slope}</span>
              <Mountain className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                37°
              </div>
              <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">{t.slopeAngle}</div>
            </div>
          </div>
        </div>

        {/* ACTIVE WARNING SECTION */}
        <div className="bg-amber-50/90 dark:bg-amber-950/30 border-2 border-orange-400 dark:border-orange-600 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-extrabold text-orange-950 dark:text-orange-200 text-base flex items-center gap-2">
                  <span>🟠</span>
                  <span>{t.emergencyWarnings}</span>
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300 bg-orange-200/70 dark:bg-orange-900/60 px-2.5 py-0.5 rounded-md">
                  Gangtok Sector
                </span>
              </div>

              <p className="text-sm font-medium text-orange-900 dark:text-orange-200 mt-2 leading-relaxed">
                {t.emergencyWarnings} • {t.evacuationAdvisory}
              </p>

              <div className="mt-4">
                <button
                  id="citizen-view-alert-btn"
                  onClick={() => onNavigate('alerts')}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>{t.viewDetails}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Quick Actions */}
        <div className="pt-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t.safetyGuidelines}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. 📷 Check Landslide Risk */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs hover:shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>📷</span>
                  <span>{t.aiRiskCheck}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {t.uploadImage} & {t.checkRisk}
                </p>
              </div>

              <div className="mt-6 pt-2">
                <button
                  id="action-check-risk-btn"
                  onClick={() => onNavigate('check-risk')}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>{t.checkRisk}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. 🛣 Safe Routes */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs hover:shadow-xs hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>🛣</span>
                  <span>{t.safeRoutes}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {t.safeZones} & {t.nearbyShelters}
                </p>
              </div>

              <div className="mt-6 pt-2">
                <button
                  id="action-safe-routes-btn"
                  onClick={() => onNavigate('safe-routes')}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>{t.findSafeRoute}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. 🚨 Emergency Help */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs hover:shadow-xs hover:border-red-500 dark:hover:border-red-500 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>🚨</span>
                  <span>{t.emergencyHelp}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {t.medicalCenters} & {t.emergencyCall}
                </p>
              </div>

              <div className="mt-6 pt-2">
                <button
                  id="action-emergency-help-btn"
                  onClick={() => onNavigate('emergency')}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-red-600 hover:bg-red-700 shadow-2xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>{t.getHelp}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Risk Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Risk Status
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Official Warning Scale</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
            {/* 🟢 Normal */}
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <span className="text-sm leading-none">🟢</span>
                <span>Normal</span>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400">Safe, standard seasonal conditions</span>
            </div>

            {/* 🟡 Watch */}
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <span className="text-sm leading-none">🟡</span>
                <span>Watch</span>
              </div>
              <span className="text-[11px] text-amber-700 dark:text-amber-400">Advisory: continuous rain expected</span>
            </div>

            {/* 🟠 Warning (Current) */}
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-400 dark:border-orange-500 flex flex-col gap-1 ring-1 ring-orange-200 dark:ring-orange-800">
              <div className="flex items-center justify-between font-bold text-orange-900 dark:text-orange-200">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm leading-none">🟠</span>
                  <span>Warning</span>
                </div>
                <span className="text-[10px] font-extrabold bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100 px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              </div>
              <span className="text-[11px] text-orange-800 dark:text-orange-300 font-medium">Elevated risk, prepare caution</span>
            </div>

            {/* 🔴 Emergency */}
            <div className="p-3 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 font-bold text-red-800 dark:text-red-300">
                <span className="text-sm leading-none">🔴</span>
                <span>Emergency</span>
              </div>
              <span className="text-[11px] text-red-700 dark:text-red-400">Evacuate slope areas immediately</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
