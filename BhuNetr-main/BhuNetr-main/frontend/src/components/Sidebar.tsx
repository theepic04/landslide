import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  ScanSearch,
  Bell,
  History,
  LifeBuoy,
  Navigation,
  ListTodo,
  Network,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { UserRole, LanguageCode } from '../types';
import { getTranslation } from '../data/translations';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  currentRole: UserRole;
  activePage: string;
  onNavigate: (page: string) => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  selectedLanguage?: LanguageCode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activePage,
  onNavigate,
  isMobileMenuOpen,
  onCloseMobileMenu,
  selectedLanguage = 'en'
}) => {
  const langCode: LanguageCode = (selectedLanguage as LanguageCode) || 'en';
  const t = getTranslation(langCode);

  const citizenNavItems = [
    {
      id: 'citizen-dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      description: 'Your area risk & rainfall'
    },
    {
      id: 'risk-map',
      label: t.riskMap,
      icon: MapPin,
      description: 'NER regional risk zones'
    },
    {
      id: 'check-risk',
      label: t.aiRiskCheck,
      icon: ScanSearch,
      description: 'Photo & location analyzer'
    },
    {
      id: 'alerts',
      label: t.alerts,
      icon: Bell,
      badge: '3',
      description: 'Active disaster warnings'
    },
    {
      id: 'safe-routes',
      label: t.safeRoutes,
      icon: Navigation,
      description: 'Shelters & clear bypasses'
    },
    {
      id: 'history',
      label: t.history,
      icon: History,
      description: '24-Month rainfall & slides'
    },
    {
      id: 'emergency',
      label: t.emergencyHelp,
      icon: LifeBuoy,
      highlight: true,
      description: 'Hospitals, shelters & routes'
    }
  ];

  const authorityNavItems = [
    {
      id: 'authority-dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      description: 'Regional monitoring overview'
    },
    {
      id: 'risk-map',
      label: t.riskMap,
      icon: MapPin,
      description: 'Interactive NER hazard map'
    },
    {
      id: 'alerts',
      label: t.alerts,
      icon: Bell,
      badge: '3',
      description: 'Disaster warning broadcast'
    },
    {
      id: 'alert-management',
      label: t.alertManagement,
      icon: ListTodo,
      badge: '3',
      authorityOnly: true,
      description: 'Triage & workflow actions'
    },
    {
      id: 'history',
      label: t.history,
      icon: History,
      description: 'Historical incidents archive'
    },
    {
      id: 'infrastructure-risk',
      label: t.infrastructureRisk,
      icon: Network,
      authorityOnly: true,
      description: 'NH-10, rail & power lines'
    },
    {
      id: 'safe-routes',
      label: t.safeRoutes,
      icon: Navigation,
      description: 'Shelters & clear bypasses'
    },
    {
      id: 'check-risk',
      label: t.aiRiskCheck,
      icon: ScanSearch,
      description: 'Photo terrain evaluator'
    },
    {
      id: 'emergency',
      label: t.emergencyHelp,
      icon: LifeBuoy,
      description: 'Relief bases & safe routes'
    }
  ];

  const navItems = currentRole === 'authority' ? authorityNavItems : citizenNavItems;

  const handleItemClick = (pageId: string) => {
    onNavigate(pageId);
    onCloseMobileMenu();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Desktop & Mobile Drawer */}
      <aside
        id="app-sidebar"
        className={`fixed top-16 md:top-24 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
              {currentRole === 'authority' ? t.authorityPortal : t.citizenPortal}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                currentRole === 'authority'
                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {currentRole.toUpperCase()}
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : item.highlight
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100/80 dark:hover:bg-red-950/60'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-white dark:text-slate-900'
                        : item.highlight
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900'
                        : item.highlight
                        ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Sidebar Info & Portal Return */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 mb-2">
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Regional Sensor Mesh</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              IMD Doppler radar & piezometer feeds syncing continuously.
            </p>
          </div>

          <div className="flex items-center justify-between px-1 mb-2.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Theme</span>
            <ThemeToggle showLabelsOnMobile={true} />
          </div>

          <div className="flex items-center gap-2">
            <button
              id="sidebar-home-link-btn"
              onClick={() => handleItemClick('landing')}
              className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>Public Home</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              id="sidebar-logout-btn"
              onClick={() => handleItemClick('login')}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
