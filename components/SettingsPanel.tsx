
import React from 'react';
import { TargetSettings, CommissionType, CommissionTier } from '../types';

interface SettingsPanelProps {
  settings: TargetSettings;
  onUpdate: (newSettings: TargetSettings) => void;
  onSave?: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...settings,
      [name]: name === 'commissionType' ? value : Number(value)
    });
  };

  const addTier = () => {
    const lastTier = settings.tiers[settings.tiers.length - 1];
    const newFrom = lastTier ? lastTier.to + 1 : 0;
    const newTier: CommissionTier = {
      id: Math.random().toString(36).substr(2, 9),
      from: newFrom,
      to: newFrom + 1000,
      rate: 0,
      type: CommissionType.FLAT
    };
    onUpdate({
      ...settings,
      tiers: [...settings.tiers, newTier]
    });
  };

  const updateTier = (id: string, field: keyof CommissionTier, value: any) => {
    onUpdate({
      ...settings,
      tiers: settings.tiers.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  const removeTier = (id: string) => {
    onUpdate({
      ...settings,
      tiers: settings.tiers.filter(t => t.id !== id)
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-bold text-brand-blue flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-orange" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Target & Commission Configuration
        </h2>
        <button 
          onClick={onSave}
          className="bg-brand-blue text-white px-5 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-900/10 hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Merchant Onboard Target</label>
          <input 
            type="number" 
            name="merchantOnboard"
            value={settings.merchantOnboard} 
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Total Parcel Target</label>
          <input 
            type="number" 
            name="totalParcels"
            value={settings.totalParcels} 
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Revenue Target (BDT)</label>
          <input 
            type="number" 
            name="totalRevenue"
            value={settings.totalRevenue} 
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-slate-600 mb-2">Commission Structure</label>
            <select 
              name="commissionType"
              value={settings.commissionType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
            >
              <option value={CommissionType.FLAT}>Global Flat Fee</option>
              <option value={CommissionType.PERCENTAGE}>Global Percentage (%)</option>
              <option value={CommissionType.TIERED}>Tiered Structure</option>
            </select>
          </div>

          {settings.commissionType !== CommissionType.TIERED && (
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-slate-600 mb-2">
                {settings.commissionType === CommissionType.PERCENTAGE ? 'Percentage Value (%)' : 'Flat Rate (BDT)'}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  name="commissionValue"
                  value={settings.commissionValue} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-8 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  {settings.commissionType === CommissionType.PERCENTAGE ? '%' : '৳'}
                </span>
              </div>
            </div>
          )}
        </div>

        {settings.commissionType === CommissionType.TIERED && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider">Configure Volume Tiers</h3>
              <button 
                onClick={addTier}
                className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded hover:bg-[#e66a1a] transition-colors shadow-sm"
              >
                + Add Tier
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
              <div className="grid grid-cols-5 gap-3 px-2 text-[10px] font-bold text-slate-400 uppercase">
                <div>From</div>
                <div>To</div>
                <div>Type</div>
                <div>Value</div>
                <div className="text-right">Remove</div>
              </div>
              
              {settings.tiers.map((tier) => (
                <div key={tier.id} className="grid grid-cols-5 gap-3 items-center bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                  <input 
                    type="number" 
                    value={tier.from}
                    onChange={(e) => updateTier(tier.id, 'from', Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-100 bg-white text-slate-900 rounded focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                  />
                  <input 
                    type="number" 
                    value={tier.to}
                    onChange={(e) => updateTier(tier.id, 'to', Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-100 bg-white text-slate-900 rounded focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                  />
                  <select
                    value={tier.type}
                    onChange={(e) => updateTier(tier.id, 'type', e.target.value)}
                    className="w-full px-1 py-1.5 text-xs border border-slate-100 bg-white text-slate-900 rounded focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                  >
                    <option value={CommissionType.FLAT}>Flat</option>
                    <option value={CommissionType.PERCENTAGE}>%</option>
                  </select>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={tier.rate}
                      onChange={(e) => updateTier(tier.id, 'rate', Number(e.target.value))}
                      className="w-full px-2 py-1.5 pr-6 text-sm border border-slate-100 bg-white text-slate-900 rounded focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                      {tier.type === CommissionType.PERCENTAGE ? '%' : '৳'}
                    </span>
                  </div>
                  <div className="text-right">
                    <button 
                      onClick={() => removeTier(tier.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {settings.tiers.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-sm italic bg-white rounded-lg border border-dashed border-slate-200">
                  No tiers defined. Click "Add Tier" to start.
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Note: Commission configuration allows both flat rates per parcel and percentage of revenue within the same tiered structure.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
