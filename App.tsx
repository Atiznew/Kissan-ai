import React, { useState } from 'react';
import { AppView } from './types';
import CropAdvisor from './components/CropAdvisor';
import DiseaseDetector from './components/DiseaseDetector';
import MarketInsights from './components/MarketInsights';
import SmartChat from './components/SmartChat';
import GovSchemes from './components/GovSchemes';
import { Sprout, AlertTriangle, TrendingUp, MessageSquare, Menu, X, Sun, CloudRain, Landmark, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simple Mock Weather Widget
  const WeatherWidget = () => (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden group hover:shadow-xl transition-shadow">
      <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <CloudRain size={140} />
      </div>
      <div className="relative z-10 flex justify-between items-end">
        <div>
          <h3 className="text-blue-100 font-medium text-sm mb-1 flex items-center gap-1">
             <MapPinIcon /> Indore, Madhya Pradesh
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-6xl font-bold tracking-tighter">28°</span>
            <div className="mb-2">
              <p className="font-medium text-lg">साफ़ आसमान</p>
              <p className="text-sm text-blue-200">H: 32° L: 24°</p>
            </div>
          </div>
        </div>
        <div className="text-right text-sm text-blue-100">
          <p>नमी: 65%</p>
          <p>हवा: 12 km/h</p>
        </div>
      </div>
    </div>
  );

  const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  );

  const NavItem = ({ view, label, icon: Icon }: { view: AppView, label: string, icon: any }) => (
    <button
      onClick={() => {
        setActiveView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
        activeView === view 
          ? 'bg-kisan-100 text-kisan-800 font-bold shadow-sm ring-1 ring-kisan-200' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className={`w-5 h-5 ${activeView === view ? 'text-kisan-600' : 'text-gray-400'}`} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-slate-50">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-kisan-600 rounded-lg flex items-center justify-center">
             <Sprout className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-gray-800">Kisan<span className="text-kisan-600">AI</span></span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 p-6 z-40 transform transition-transform duration-300 ease-in-out flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-kisan-600 rounded-xl flex items-center justify-center shadow-lg shadow-kisan-200">
             <Sprout className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-2xl text-gray-800 leading-none tracking-tight">Kisan<span className="text-kisan-600">AI</span></h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide">CENTRAL PLATFORM</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem view={AppView.DASHBOARD} label="डैशबोर्ड (Home)" icon={Activity} />
          <NavItem view={AppView.CROP_ADVISOR} label="सटीक खेती (Precision)" icon={Sprout} />
          <NavItem view={AppView.DISEASE_DETECTOR} label="रोग पहचान (Doctor)" icon={AlertTriangle} />
          <NavItem view={AppView.MANDI_BHAV} label="मंडी भाव (Market)" icon={TrendingUp} />
          <NavItem view={AppView.GOV_SCHEMES} label="योजनाएं (Schemes)" icon={Landmark} />
          <NavItem view={AppView.AI_CHAT} label="सहायक (Chat)" icon={MessageSquare} />
        </nav>

        <div className="mt-auto">
           <div className="bg-gradient-to-br from-kisan-50 to-emerald-50 p-4 rounded-xl border border-kisan-100">
              <p className="text-xs font-bold text-kisan-800 mb-1 flex items-center gap-1">
                <Sun className="w-3 h-3" /> DAILY TIP:
              </p>
              <p className="text-xs text-kisan-900 leading-snug">
                ड्रिप सिंचाई (Drip Irrigation) से 40-50% पानी बचाएं और 3x उत्पादन बढ़ाएं।
              </p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen no-scrollbar">
        <div className="max-w-5xl mx-auto">
          
          {activeView === AppView.DASHBOARD && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">नमस्ते किसान भाई! 👋</h1>
                  <p className="text-gray-500">सेंट्रल AI फार्मिंग प्लेटफॉर्म पर आपका स्वागत है।</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  System Status: Online
                </div>
              </header>

              <WeatherWidget />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div 
                  onClick={() => setActiveView(AppView.CROP_ADVISOR)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-kisan-200 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">सटीक फसल सलाह</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">AI से जानें कौन सी फसल सबसे ज्यादा मुनाफा देगी।</p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveView(AppView.DISEASE_DETECTOR)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 text-red-600">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">रोग पहचान (AI Doctor)</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">फोटो खींचें और तुरंत फसल का इलाज पाएं।</p>
                  </div>
                </div>

                 <div 
                  onClick={() => setActiveView(AppView.MANDI_BHAV)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">मंडी भाव अलर्ट</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">बाज़ार का सही भाव और बेचने का सही समय।</p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveView(AppView.GOV_SCHEMES)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 text-orange-600">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">सरकारी योजनाएं</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">सब्सिडी, बीमा और सरकारी मदद की जानकारी।</p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveView(AppView.AI_CHAT)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group relative overflow-hidden md:col-span-2 lg:col-span-2"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 text-purple-600">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">किसान सहायक (AI Expert)</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">
                        खेती, मौसम, या खाद से जुड़ा कोई भी सवाल पूछें। यह 24/7 उपलब्ध है।
                      </p>
                      <button className="text-sm text-purple-700 font-bold hover:underline">चैट शुरू करें →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === AppView.CROP_ADVISOR && <CropAdvisor />}
          {activeView === AppView.DISEASE_DETECTOR && <DiseaseDetector />}
          {activeView === AppView.MANDI_BHAV && <MarketInsights />}
          {activeView === AppView.GOV_SCHEMES && <GovSchemes />}
          {activeView === AppView.AI_CHAT && <SmartChat />}

        </div>
      </main>
    </div>
  );
};

export default App;