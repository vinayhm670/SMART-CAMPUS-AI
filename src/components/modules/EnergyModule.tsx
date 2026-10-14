import React, { useState } from 'react';
import { 
  Zap, 
  Leaf, 
  DollarSign, 
  Wind, 
  Thermometer, 
  TrendingDown, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart2, 
  Building2 
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext.js';

export const EnergyModule: React.FC = () => {
  const { energyMetrics, buildings } = useCampusData();

  const [tariffRateUsd, setTariffRateUsd] = useState<number>(0.15); // $0.15 per kWh
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(energyMetrics[0]?.buildingId || '');

  const totalCurrentKw = energyMetrics.reduce((sum, m) => sum + m.currentKw, 0);
  const totalDailyKwh = energyMetrics.reduce((sum, m) => sum + m.dailyKwh, 0);
  const totalEstimatedCost = (totalDailyKwh * tariffRateUsd).toFixed(2);
  const totalCarbonKg = (totalDailyKwh * 0.42).toFixed(1); // 0.42 kg CO2 per kWh grid factor

  const selectedMetric = energyMetrics.find(m => m.buildingId === selectedBuildingId) || energyMetrics[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Campus Energy &amp; Environmental Telemetry
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-teal-400" />
              Sustainability Scorecard
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time kilowatt load, indoor air quality metrics, and autonomous HVAC setback optimization.
          </p>
        </div>

        {/* Configurable Tariff Rate */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Electricity Tariff:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-cyan-300">
            <span>$</span>
            <input
              type="number"
              step="0.01"
              value={tariffRateUsd}
              onChange={e => setTariffRateUsd(parseFloat(e.target.value) || 0.15)}
              className="w-14 bg-slate-800 px-1 py-0.5 rounded text-white text-center"
            />
            <span>/kWh</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Live Power Demand</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalCurrentKw.toFixed(1)}</span>
            <span className="text-xs text-slate-400">kW</span>
          </div>
          <p className="mt-2 text-[11px] text-teal-400 font-medium">Updated every 6 seconds</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Today's Consumption</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalDailyKwh.toFixed(0)}</span>
            <span className="text-xs text-slate-400">kWh</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Campus-wide cumulative</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Estimated Cost Today</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-300">${totalEstimatedCost}</span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Based on ${tariffRateUsd}/kWh tariff</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Carbon Footprint</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">{totalCarbonKg}</span>
            <span className="text-xs text-slate-400">kg CO₂</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-400 font-medium">Solar offset active on Block B</p>
        </div>
      </div>

      {/* Building-wise Energy Profiles & Historical Hourly Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Building Selector List */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Select Building Sub-Station
          </span>
          <div className="space-y-2">
            {energyMetrics.map(metric => {
              const isSelected = selectedBuildingId === metric.buildingId;
              const buildingInfo = buildings.find(b => b.id === metric.buildingId);

              return (
                <div
                  key={metric.buildingId}
                  onClick={() => setSelectedBuildingId(metric.buildingId)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-teal-400 shadow-md shadow-teal-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{metric.buildingName}</span>
                    <span className="font-mono text-cyan-300 font-bold">{metric.currentKw} kW</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-700/60">
                    <span>Air Quality: AQI {buildingInfo?.aqi || 28}</span>
                    <span>Daily: {metric.dailyKwh} kWh</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Chart for Selected Building */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedMetric.buildingName} Load Curve</h3>
                <p className="text-xs text-slate-400">Today's 24-hour electricity demand profile (kW)</p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">Peak: {selectedMetric.peakKwToday} kW</span>
            </div>

            {/* Native SVG Bar Chart for 24h Profile */}
            <div className="h-56 w-full flex items-end gap-3 pt-6 pb-2">
              {selectedMetric.historicalHourly.map(item => {
                const maxVal = selectedMetric.peakKwToday || 300;
                const heightPct = Math.min(100, Math.round((item.kw / maxVal) * 100));

                return (
                  <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      {item.kw}kW
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-teal-600 to-cyan-400 rounded-t-md group-hover:brightness-110 transition-all"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-1">{item.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Energy Optimization Insight Box */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-teal-500/30 text-xs flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white">AI Energy Saving Insight for {selectedMetric.buildingName}:</span>
              <p className="text-slate-300 leading-relaxed">
                PIR sensors report 0 present occupants in East Wing classrooms between 17:30 and 21:00. 
                Enabling automated setback would curtail ~42.5 kWh daily ($190/month savings).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
