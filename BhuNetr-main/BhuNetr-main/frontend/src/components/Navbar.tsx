import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Menu,
  X,
  User,
  ChevronDown,
  Bell,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Check,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { UserRole, LanguageCode } from '../types';
import { LANGUAGES } from '../data/mockData';
import { getTranslation } from '../data/translations';
import { ThemeToggle } from './ThemeToggle';
import { BhuNetraSymbol } from './BhuNetraLogo';
import { useAlerts } from '../context/AlertsContext';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onNavigate: (page: string) => void;
  activePage: string;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  selectedLanguage,
  onSelectLanguage,
  onNavigate,
  activePage,
  onToggleMobileMenu,
  isMobileMenuOpen
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const { alerts, activeAlerts, unreadCount, markAsRead, markAllAsRead } = useAlerts();

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];
  const t = getTranslation(selectedLanguage);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const citizenNavItems = [
    { id: 'citizen-dashboard', label: t.dashboard },
    { id: 'risk-map', label: t.riskMap },
    { id: 'check-risk', label: t.aiRiskCheck },
    { id: 'alerts', label: t.alerts },
    { id: 'safe-routes', label: t.safeRoutes },
    { id: 'history', label: t.history },
    { id: 'emergency', label: t.emergencyHelp }
  ];

  const authorityNavItems = [
    { id: 'authority-dashboard', label: t.dashboard },
    { id: 'risk-map', label: t.riskMap },
    { id: 'alerts', label: t.alerts },
    { id: 'alert-management', label: t.alertManagement },
    { id: 'history', label: t.history },
    { id: 'infrastructure-risk', label: t.infrastructureRisk },
    { id: 'safe-routes', label: t.safeRoutes },
    { id: 'check-risk', label: t.aiRiskCheck },
    { id: 'emergency', label: t.emergencyHelp }
  ];

  const currentNavItems = currentRole === 'authority' ? authorityNavItems : citizenNavItems;

  const isPortal = activePage !== 'landing' && activePage !== 'login' && activePage !== 'authority-login';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top official banner strip */}
      <div className="bg-slate-800 text-slate-200 text-xs px-4 py-1 flex items-center justify-between h-6"></div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand: "BhuNetra" */}
          <div className="flex items-center space-x-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              id="brand-logo-btn"
              onClick={() => onNavigate(isPortal ? (currentRole === 'citizen' ? 'citizen-dashboard' : 'authority-dashboard') : 'landing')}
              className="flex items-center space-x-2.5 text-left focus:outline-hidden group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 bhunetra-logo-frame border border-slate-200/80 dark:border-slate-700 p-1 flex items-center justify-center shadow-2xs group-hover:border-emerald-500 transition-colors">
                <BhuNetraSymbol className="w-8 h-8" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white block leading-tight">
                  BhuNetra
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  See Risk. Save Lives.
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links in Header (for Citizen & Authority views on desktop) */}
          {isPortal && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {currentNavItems.map((item) => {
                const isActive =
                  activePage === item.id ||
                  (item.id === 'emergency' && activePage === 'safe-routes');
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? currentRole === 'authority'
                          ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 font-bold'
                          : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Side: Theme Toggle, Language Selector, Profile, Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle (☀️ Light / 🌙 Dark) */}
            <ThemeToggle />

            {/* Quick Alerts Bell with Live Notification Dropdown (in portal view) */}
            {isPortal && (
              <div className="relative shrink-0" ref={notificationsRef}>
                <button
                  id="navbar-alerts-bell-btn"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 relative transition-colors cursor-pointer"
                  title={t.notifications}
                  aria-label={`${unreadCount} unread notifications`}
                  aria-expanded={isNotificationsOpen}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-slate-900 animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : activeAlerts.length > 0 ? (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                  ) : null}
                </button>

                {/* Notifications Dropdown Panel */}
                {isNotificationsOpen && (
                  <div
                    id="notifications-dropdown-panel"
                    className="fixed sm:absolute top-[84px] sm:top-full left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-0 sm:mt-2 w-[min(360px,calc(100vw-24px))] sm:w-[360px] min-w-[280px] box-border bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span>{t.notifications}</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {unreadCount} new
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {activeAlerts.length} {t.activeAlerts.toLowerCase()}
                          </div>
                        </div>
                      </div>

                      {unreadCount > 0 && (
                        <button
                          id="mark-all-read-btn"
                          onClick={() => markAllAsRead()}
                          className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>{t.markAllAsRead}</span>
                        </button>
                      )}
                    </div>

                    {/* Alert List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {alerts.slice(0, 5).map((item) => {
                        const levelColors = {
                          Emergency: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
                          Warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
                          Watch: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800',
                          Normal: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                        }[item.level] || 'bg-slate-50 text-slate-700 border-slate-200';

                        return (
                          <div
                            key={item.id}
                            className={`p-3 transition-colors ${
                              !item.isRead
                                ? 'bg-slate-50/70 dark:bg-slate-800/40'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/20'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => {
                                  markAsRead(item.id);
                                  setIsNotificationsOpen(false);
                                  onNavigate('alerts');
                                }}
                              >
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${levelColors}`}>
                                    {item.level}
                                  </span>
                                  {!item.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0"></span>
                                  )}
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 ml-auto shrink-0">
                                    <Clock className="w-3 h-3" />
                                    {item.timestamp}
                                  </span>
                                </div>

                                <div className="mt-1 font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{item.location}, {item.state}</span>
                                </div>

                                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed break-words">
                                  {item.message}
                                </p>

                                <div className="mt-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium break-words">
                                  ⚡ {item.recommendedAction}
                                </div>
                              </div>

                              {!item.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(item.id);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0 ml-1"
                                  title={t.markAsRead}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {alerts.length === 0 && (
                        <div className="py-8 text-center px-4">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {t.noUnreadNotifications}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            All alerts are currently acknowledged.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <button
                        id="view-all-alerts-dropdown-btn"
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          onNavigate('alerts');
                        }}
                        className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{t.activeAlerts} ({activeAlerts.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                id="language-selector-btn"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{currentLangObj.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 z-50 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
                    {t.selectLanguage}
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      id={`lang-option-${lang.code}`}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                        selectedLanguage === lang.code
                          ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {selectedLanguage === lang.code && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile & Logout in Portal View */}
            {isPortal ? (
              <div className="flex items-center space-x-2">
                {/* Profile Button / Dropdown */}
                <div className="relative">
                  <button
                    id="user-profile-btn"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      currentRole === 'authority'
                        ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {currentRole === 'authority' ? (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="hidden sm:inline font-bold">
                      {currentRole === 'authority' ? 'Authority' : 'Citizen'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-2 z-50 text-xs">
                      <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {currentRole === 'authority' ? 'Disaster Authority' : 'Citizen Profile'}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {currentRole === 'authority'
                            ? 'NDRF / SDMA North Eastern Region'
                            : '📍 Gangtok, Sikkim'}
                        </div>
                        <div className={`mt-1 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          currentRole === 'authority'
                            ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60'
                            : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{currentRole === 'authority' ? 'Official Incident Control' : 'Emergency Alerts Active'}</span>
                        </div>
                      </div>

                      <div className="px-1 py-1">
                        <button
                          onClick={() => {
                            onSelectRole('citizen');
                            setIsProfileOpen(false);
                            onNavigate('citizen-dashboard');
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{t.citizenDashboard}</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            if (currentRole === 'authority') {
                              onNavigate('authority-dashboard');
                            } else {
                              onNavigate('authority-login');
                            }
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{t.authorityDashboard}</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800 px-1">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            onNavigate('login');
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t.logout}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Logout Button */}
                <button
                  id="navbar-logout-btn"
                  onClick={() => onNavigate('login')}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  title={t.logout}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.logout}</span>
                </button>
              </div>
            ) : (
              /* Public / Landing buttons */
              <div className="flex items-center space-x-2">
                <button
                  id="nav-check-area-btn"
                  onClick={() => onNavigate('citizen-dashboard')}
                  className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  {t.checkMyArea}
                </button>
                <button
                  id="nav-login-btn"
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
                >
                  {t.login}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-3 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.theme}</span>
            <ThemeToggle showLabelsOnMobile={true} />
          </div>

          {isPortal ? (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {currentRole === 'authority' ? 'Authority Portal Menu' : 'Citizen Portal Menu'}
              </div>
              {currentNavItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-portal-nav-${item.id}`}
                    onClick={() => {
                      onNavigate(item.id);
                      onToggleMobileMenu();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? currentRole === 'authority'
                          ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold'
                          : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">●</span>
                    )}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <button
                  id="mobile-portal-switch-role"
                  onClick={() => {
                    onSelectRole(currentRole === 'citizen' ? 'authority' : 'citizen');
                    onNavigate(currentRole === 'citizen' ? 'authority-login' : 'citizen-dashboard');
                    onToggleMobileMenu();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {currentRole === 'citizen' ? 'Switch to Authority Login' : 'Switch to Citizen View'}
                </button>
                <button
                  id="mobile-portal-logout"
                  onClick={() => {
                    onNavigate('landing');
                    onToggleMobileMenu();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-between cursor-pointer"
                >
                  <span>{t.logout}</span>
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <button
                id="mobile-nav-check-area"
                onClick={() => {
                  onNavigate('citizen-dashboard');
                  onToggleMobileMenu();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
              >
                <span>{t.citizenDashboard}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{t.checkRisk}</span>
              </button>
              <button
                id="mobile-nav-risk-map"
                onClick={() => {
                  onNavigate('risk-map');
                  onToggleMobileMenu();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
              >
                <span>{t.riskMap}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">NER States</span>
              </button>
              <button
                id="mobile-nav-check-risk"
                onClick={() => {
                  onNavigate('check-risk');
                  onToggleMobileMenu();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
              >
                <span>{t.aiRiskCheck}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{t.uploadImage}</span>
              </button>
              <button
                id="mobile-nav-emergency"
                onClick={() => {
                  onNavigate('emergency');
                  onToggleMobileMenu();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-between cursor-pointer"
              >
                <span>{t.emergencyHelp}</span>
                <span className="text-xs text-red-500 font-bold">1070 / 112</span>
              </button>
              <div className="pt-2">
                <button
                  id="mobile-nav-login"
                  onClick={() => {
                    onNavigate('login');
                    onToggleMobileMenu();
                  }}
                  className="w-full text-center py-2 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer"
                >
                  {t.login}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
