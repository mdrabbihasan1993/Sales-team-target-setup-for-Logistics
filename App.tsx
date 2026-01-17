
import React, { useState, useMemo } from 'react';
import { TargetSettings, Employee, CommissionType } from './types';
import { INITIAL_TARGETS, MOCK_EMPLOYEES } from './constants';
import SettingsPanel from './components/SettingsPanel';

const App: React.FC = () => {
  const [globalTargets, setGlobalTargets] = useState<TargetSettings>(INITIAL_TARGETS);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [selectedId, setSelectedId] = useState<string | 'global'>('global');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const selectedEmployee = useMemo(() => 
    employees.find(e => e.id === selectedId), 
    [employees, selectedId]
  );

  const activeTargets = useMemo(() => {
    if (selectedId === 'global') return globalTargets;
    return selectedEmployee?.individualSettings || globalTargets;
  }, [selectedId, globalTargets, selectedEmployee]);

  const handleUpdate = (newSettings: TargetSettings) => {
    if (selectedId === 'global') {
      setGlobalTargets(newSettings);
    } else {
      setEmployees(prev => prev.map(e => 
        e.id === selectedId ? { ...e, individualSettings: newSettings } : e
      ));
    }
  };

  const handleResetToDefault = () => {
    if (selectedId !== 'global') {
      setEmployees(prev => prev.map(e => 
        e.id === selectedId ? { ...e, individualSettings: null } : e
      ));
    }
  };

  const handleSave = () => {
    // In a real app, this would be an API call
    alert('Settings saved successfully!');
  };

  const formatCommissionLabel = (type: CommissionType) => {
    switch(type) {
      case CommissionType.FLAT: return 'Flat Rate';
      case CommissionType.PERCENTAGE: return 'Percentage';
      case CommissionType.TIERED: return 'Tiered';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-blue rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-orange" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-brand-blue tracking-tight">LogiSales <span className="text-brand-orange">Pro</span></span>
            </div>
            <div className="flex items-center gap-4">
               {/* No button here as per request */}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8 gap-8 overflow-hidden">
        {/* Sidebar - Fixed Position & Scrollable List */}
        <aside className="w-80 shrink-0 hidden md:flex flex-col h-[calc(100vh-8rem)] sticky top-24">
          <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Global Setting Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">System Policy</h3>
              <button 
                onClick={() => setSelectedId('global')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedId === 'global' 
                    ? 'bg-brand-blue text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-600 bg-white border border-slate-100 hover:border-brand-blue/30'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
                Default Global Setup
              </button>
            </div>

            {/* Employee Search & List Header */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Individual Setup</h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{employees.length}</span>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Scrollable Employee List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(emp => (
                  <button 
                    key={emp.id}
                    onClick={() => setSelectedId(emp.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                      selectedId === emp.id 
                        ? 'bg-brand-blue text-white border-brand-blue shadow-sm' 
                        : 'text-slate-600 bg-transparent border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${selectedId === emp.id ? 'bg-white/20' : 'bg-brand-blue/10 text-brand-blue'}`}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-left truncate">
                        <p className="font-bold leading-tight truncate">{emp.name}</p>
                        <p className={`text-[10px] truncate ${selectedId === emp.id ? 'text-white/60' : 'text-slate-400'}`}>{emp.role}</p>
                      </div>
                    </div>
                    {emp.individualSettings && (
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedId === emp.id ? 'bg-white' : 'bg-brand-orange shadow-sm shadow-orange-500/50'}`}></div>
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-400 italic">No employees found</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 pb-12 min-w-0">
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {selectedId !== 'global' && (
                    <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange font-bold">
                      {selectedEmployee?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <h1 className="text-2xl font-bold text-slate-800">
                    {selectedId === 'global' ? 'Default Global Configuration' : `${selectedEmployee?.name}'s Configuration`}
                  </h1>
                </div>
                <p className="text-slate-500 text-sm">
                  {selectedId === 'global' 
                    ? 'Define the standard targets used system-wide as the baseline.' 
                    : `Override global defaults for this specific member to match their performance tier.`}
                </p>
              </div>
              {selectedId !== 'global' && selectedEmployee?.individualSettings && (
                <button 
                  onClick={handleResetToDefault}
                  className="px-4 py-2 border border-slate-200 text-slate-500 text-xs font-bold rounded-lg hover:bg-white hover:text-red-500 transition-all flex items-center gap-2 shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset to Global
                </button>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Core Configuration Panel */}
            <SettingsPanel settings={activeTargets} onUpdate={handleUpdate} onSave={handleSave} />

            {/* Selected Profile Indicator for clarity */}
            {selectedId !== 'global' && !selectedEmployee?.individualSettings && (
               <div className="bg-brand-blue/5 border border-brand-blue/10 p-5 rounded-xl flex items-center gap-4">
                  <div className="p-2 bg-brand-blue/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-brand-blue">Inheriting Global Baseline</p>
                    <p className="text-slate-500">Currently using the system default. <strong>Modify any field above</strong> to create a personalized target for {selectedEmployee?.name}.</p>
                  </div>
               </div>
            )}

            {/* Summary Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Onboarding Target</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-slate-800">{activeTargets.merchantOnboard}</p>
                  <span className="text-[10px] text-slate-400 font-medium">New Stores</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Parcel Goal</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-slate-800">{activeTargets.totalParcels.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-400 font-medium">Packages</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Revenue Target</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-slate-800">৳{(activeTargets.totalRevenue / 1000).toFixed(0)}k</p>
                  <span className="text-[10px] text-slate-400 font-medium">Gross Sales</span>
                </div>
              </div>
              <div className="bg-brand-blue p-5 rounded-xl border border-brand-blue shadow-lg shadow-blue-900/10 overflow-hidden">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-2">Commission Logic</p>
                <div className="flex items-end justify-between gap-2 overflow-hidden">
                  <p className="text-xl font-bold text-brand-orange truncate" title={formatCommissionLabel(activeTargets.commissionType)}>
                    {formatCommissionLabel(activeTargets.commissionType)}
                  </p>
                  <span className="text-[10px] text-white/60 font-medium shrink-0">Policy</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
