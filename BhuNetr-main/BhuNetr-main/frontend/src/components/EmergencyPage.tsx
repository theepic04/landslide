import React, { useState, useRef } from 'react';
import {
  LifeBuoy,
  Hospital,
  Home,
  Phone,
  PhoneCall,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Navigation,
  ShieldAlert,
  Flame,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';

interface EmergencyPageProps {
  onNavigate: (page: string) => void;
}

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  description: string;
  badge: string;
  color: string;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'control-room',
    name: 'Emergency Control Room',
    number: '1070',
    description: 'State Disaster Management Authority (SDMA)',
    badge: '24/7 Toll Free',
    color: 'border-red-500 text-red-600 bg-red-50'
  },
  {
    id: 'police',
    name: 'Police',
    number: '112',
    description: 'National Emergency Response Support System',
    badge: 'All Emergencies',
    color: 'border-blue-500 text-blue-600 bg-blue-50'
  },
  {
    id: 'ambulance',
    name: 'Ambulance',
    number: '108',
    description: 'Medical First Responders & Critical Trauma Transport',
    badge: 'Immediate Dispatch',
    color: 'border-emerald-500 text-emerald-600 bg-emerald-50'
  },
  {
    id: 'fire',
    name: 'Fire & Emergency',
    number: '101',
    description: 'Fire Extrication, Urban Search & Hazard Rescue',
    badge: 'Rapid Unit',
    color: 'border-amber-500 text-amber-600 bg-amber-50'
  },
  {
    id: 'ndrf',
    name: 'NDRF Helpline',
    number: '1078',
    description: 'National Disaster Response Force Headquarters',
    badge: 'Specialist Rescue',
    color: 'border-purple-500 text-purple-600 bg-purple-50'
  }
];

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onNavigate }) => {
  const [activeNotice, setActiveNotice] = useState<string | null>(null);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const contactsSectionRef = useRef<HTMLDivElement>(null);

  const handleSimulatedCall = (name: string, number: string) => {
    setActiveNotice(`Calling ${name} (${number})... [Simulated Dial]`);
    setTimeout(() => {
      setActiveNotice(null);
    }, 4500);
  };

  const scrollToContacts = () => {
    contactsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ==================================================
            1. PAGE HEADER
            Title: "Emergency Help"
            Subtitle: "Quick access to nearby emergency services."
            ================================================== */}
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Emergency Help
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Quick access to nearby emergency services.
            </p>
          </div>

          <button
            id="emergency-safe-routes-top-btn"
            onClick={() => onNavigate('safe-routes')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>View Safe Routes</span>
          </button>
        </div>

        {/* ==================================================
            7. CURRENT RISK
            At the top of the Emergency page show:
            Your Current Area: Gangtok, Sikkim
            Risk: 🟠 HIGH
            Probability: 78%
            Prediction: Next 24–48 Hours
            Add: "Follow official warnings and move to a safe location if instructed."
            ================================================== */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-orange-400 dark:border-orange-500/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Monitored Location
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                Your Current Area
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 text-xs font-black self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span>Advisory Active</span>
            </div>
          </div>

          {/* 4 Cards for Location, Risk, Probability, Prediction */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Gangtok, Sikkim */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Area
              </span>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Gangtok, Sikkim</span>
              </div>
            </div>

            {/* Risk: 🟠 HIGH */}
            <div className="p-3.5 rounded-xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800 dark:text-orange-400 block">
                Risk
              </span>
              <div className="text-base sm:text-xl font-black text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1.5">
                <span>🟠</span>
                <span>HIGH</span>
              </div>
            </div>

            {/* Probability: 78% */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Probability
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                78%
              </div>
            </div>

            {/* Prediction: Next 24–48 Hours */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Prediction
              </span>
              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Next 24–48 Hours</span>
              </div>
            </div>
          </div>

          {/* Exact required warning note:
              "Follow official warnings and move to a safe location if instructed."
          */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Follow official warnings and move to a safe location if instructed.</span>
          </div>
        </div>

        {/* Temporary Call Notification */}
        {activeNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-bold text-sm flex items-center justify-between shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>{activeNotice}</span>
            </div>
            <button
              onClick={() => setActiveNotice(null)}
              className="px-2.5 py-1 text-xs bg-emerald-200/70 dark:bg-emerald-800 hover:bg-emerald-300 rounded-lg cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ==================================================
            5. LARGE ACTION BUTTONS (MOBILE-OPTIMIZED)
            🚨 Emergency Assistance - "Request immediate help"
            🏥 Find Hospital - "Find nearest medical facility"
            🏠 Find Shelter - "Find nearest safe shelter"
            📞 Emergency Contacts - "View important emergency numbers"
            ================================================== */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Emergency Immediate Actions
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. 🚨 Emergency Assistance */}
            <button
              id="action-emergency-assistance-btn"
              onClick={() => setIsSosModalOpen(true)}
              className="w-full p-4 sm:p-5 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold shadow-sm transition-all flex items-center justify-between text-left cursor-pointer min-h-[72px]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-red-700/80 text-white flex items-center justify-center text-2xl shrink-0">
                  🚨
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black tracking-tight leading-snug">
                    Emergency Assistance
                  </div>
                  <div className="text-xs text-red-100 font-medium mt-0.5">
                    Request immediate help
                  </div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-red-200 shrink-0 ml-2" />
            </button>

            {/* 2. 🏥 Find Hospital */}
            <button
              id="action-find-hospital-btn"
              onClick={() => onNavigate('safe-routes')}
              className="w-full p-4 sm:p-5 rounded-2xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-extrabold shadow-sm transition-all flex items-center justify-between text-left cursor-pointer min-h-[72px]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-800/80 text-white flex items-center justify-center text-2xl shrink-0">
                  🏥
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black tracking-tight leading-snug">
                    Find Hospital
                  </div>
                  <div className="text-xs text-blue-100 font-medium mt-0.5">
                    Find nearest medical facility
                  </div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-blue-200 shrink-0 ml-2" />
            </button>

            {/* 3. 🏠 Find Shelter */}
            <button
              id="action-find-shelter-btn"
              onClick={() => onNavigate('safe-routes')}
              className="w-full p-4 sm:p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold shadow-sm transition-all flex items-center justify-between text-left cursor-pointer min-h-[72px]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-700/80 text-white flex items-center justify-center text-2xl shrink-0">
                  🏠
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black tracking-tight leading-snug">
                    Find Shelter
                  </div>
                  <div className="text-xs text-emerald-100 font-medium mt-0.5">
                    Find nearest safe shelter
                  </div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-emerald-200 shrink-0 ml-2" />
            </button>

            {/* 4. 📞 Emergency Contacts */}
            <button
              id="action-emergency-contacts-btn"
              onClick={scrollToContacts}
              className="w-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-900 dark:text-white font-extrabold shadow-2xs transition-all flex items-center justify-between text-left cursor-pointer min-h-[72px]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center text-2xl shrink-0">
                  📞
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black tracking-tight leading-snug text-slate-900 dark:text-white">
                    Emergency Contacts
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    View important emergency numbers
                  </div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-400 shrink-0 ml-2" />
            </button>
          </div>
        </div>

        {/* ==================================================
            6. EMERGENCY CONTACTS (LARGE, TACTILE CARDS)
            ================================================== */}
        <div ref={contactsSectionRef} className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Emergency Contacts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official round-the-clock emergency toll-free numbers for Sikkim & the North Eastern Region.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              Tap any number to call
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {contact.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                      {contact.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                    {contact.description}
                  </p>
                </div>

                {/* Large phone number button (styled for instant tap on phone) */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    id={`call-btn-${contact.number}`}
                    onClick={() => handleSimulatedCall(contact.name, contact.number)}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-black text-xl sm:text-2xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="tracking-wider">{contact.number}</span>
                  </button>
                  <span className="text-[10px] text-center block text-slate-400 mt-1.5 font-semibold">
                    Tap to dial {contact.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Route & Hospital Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Immediate Safe Evacuation
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Need to reach shelter or emergency medical care right now?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Gangtok Community Hall shelter (1.8 km) and District Hospital (2.4 km) are operating with clear bypass access.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => onNavigate('safe-routes')}
              className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Safe Routes & Map</span>
            </button>
            <button
              onClick={() => onNavigate('check-risk')}
              className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Check Risk</span>
            </button>
          </div>
        </div>

        {/* ==================================================
            EMERGENCY ASSISTANCE MODAL (SIMULATED HELP REQUEST)
            ================================================== */}
        {isSosModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Emergency Assistance
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Immediate SOS Dispatch
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSosModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 font-semibold leading-relaxed">
                  Your simulated GPS location (Gangtok, Sikkim • Sector 4) and high landslide risk level (78%) will be shared with the Local Emergency Response Centre.
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Direct Emergency Hotline:</div>
                  <div className="text-lg font-black text-red-600 dark:text-red-400">1070 (SDMA) / 112</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Free calls from all mobile networks</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    setIsSosModalOpen(false);
                    handleSimulatedCall('SDMA Emergency Desk', '1070');
                  }}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 1070 Now</span>
                </button>
                <button
                  onClick={() => setIsSosModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
