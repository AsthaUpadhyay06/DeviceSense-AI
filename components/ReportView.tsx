import React from 'react';
import { HealthReport } from '../types';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  CheckCircle, AlertTriangle, Cpu, Thermometer, 
  BatteryCharging, Trash2, ShieldCheck, Terminal, Copy,
  ArrowRight
} from 'lucide-react';

interface ReportViewProps {
  report: HealthReport;
  onReset: () => void;
}

const COLORS = ['#6366f1', '#e2e8f0']; // Indigo for Used, Slate for Free

export const ReportView: React.FC<ReportViewProps> = ({ report, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(report.powershellCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const storageData = [
    { name: 'Used', value: report.storageSummary.total - report.storageSummary.free },
    { name: 'Free', value: report.storageSummary.free },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header & Score */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center md:justify-start">
              <ShieldCheck className="mr-3" size={32} /> 
              Device Health Score
            </h2>
            <p className="text-indigo-100 text-lg opacity-90">{report.safetyScore.advice}</p>
          </div>
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-indigo-400 opacity-30"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="white"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={351.86}
                strokeDashoffset={351.86 - (351.86 * report.safetyScore.score) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
              <span className="text-3xl font-bold">{report.safetyScore.score}</span>
              <span className="text-xs uppercase tracking-wider font-semibold opacity-80">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Storage Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <PieChart width={20} height={20} className="mr-2 text-indigo-500" />
            Storage Analysis
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
             <div className="h-40 w-40 flex-shrink-0 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={storageData}
                     innerRadius={40}
                     outerRadius={70}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {storageData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-xs font-bold text-slate-400">
                    {report.storageSummary.percentUsed}%
                 </span>
               </div>
             </div>
             <div className="flex-1 space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-500">Total</span>
                    <span className="font-semibold">{report.storageSummary.total} GB</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-500">Free</span>
                    <span className="font-semibold text-green-600">{report.storageSummary.free} GB</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-500">Used</span>
                    <span className="font-semibold text-indigo-600">
                        {report.storageSummary.total - report.storageSummary.free} GB
                    </span>
                </div>
             </div>
          </div>
          <p className="mt-4 text-slate-600 text-sm italic border-l-4 border-indigo-200 pl-3">
              "{report.storageSummary.message}"
          </p>
        </div>

        {/* Compression & Battery */}
        <div className="space-y-6">
            {/* Compression */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                 <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                    <CheckCircle className="mr-2 text-indigo-500" size={20} />
                    Compact OS / Compression
                 </h3>
                 <div className="flex items-start gap-4">
                     <div className={`p-3 rounded-xl ${report.compression.shouldCompress ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                         {report.compression.shouldCompress ? 'YES' : 'NO'}
                     </div>
                     <div>
                         <p className="text-sm font-semibold text-slate-800">
                             Recover ~{report.compression.estimatedRecovery}
                         </p>
                         <p className="text-xs text-slate-500 mt-1">{report.compression.details}</p>
                     </div>
                 </div>
            </div>

            {/* Battery */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                 <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                    <BatteryCharging className="mr-2 text-indigo-500" size={20} />
                    Battery Health
                 </h3>
                 <div className="grid grid-cols-1 gap-3">
                     <div className="bg-slate-50 p-3 rounded-lg">
                        <span className="text-xs uppercase text-slate-400 font-bold block mb-1">Wear Estimate</span>
                        <span className="text-slate-700 font-medium">{report.batteryTips.wearEstimate}</span>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-lg">
                        <span className="text-xs uppercase text-slate-400 font-bold block mb-1">Advice</span>
                        <span className="text-slate-700 font-medium">{report.batteryTips.chargingAdvice}</span>
                     </div>
                 </div>
            </div>
        </div>
      </div>

      {/* Cleanup Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safe to Delete */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Trash2 className="mr-2 text-red-400" size={20} />
                Safe to Delete
            </h3>
            <ul className="space-y-2">
                {report.safeToDelete.map((item, idx) => (
                    <li key={idx} className="flex items-center text-slate-600 text-sm">
                        <div className="w-2 h-2 rounded-full bg-red-300 mr-3"></div>
                        {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Heavy Folders */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <ArrowRight className="mr-2 text-orange-400" size={20} />
                Heavy Folders Action Plan
            </h3>
            <div className="space-y-3">
                {report.heavyFolders.length > 0 ? (
                  report.heavyFolders.map((folder, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <div>
                            <span className="block font-semibold text-slate-800 text-sm">{folder.name}</span>
                            <span className="text-xs text-orange-600 font-bold">{folder.size}</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-white rounded text-slate-600 border shadow-sm">
                            {folder.action}
                        </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic text-sm">No heavy folders provided.</p>
                )}
            </div>
        </div>
      </div>

      {/* Optimizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* RAM/CPU */}
         <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Cpu className="mr-2 text-blue-500" size={20} />
                RAM & CPU Boosters
            </h3>
            <ul className="space-y-3">
                {report.ramCpuOptimizations.map((tip, idx) => (
                     <li key={idx} className="flex items-start text-sm text-slate-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3 mt-0.5">{idx + 1}</span>
                        {tip}
                     </li>
                ))}
            </ul>
         </div>

         {/* Overheat */}
         <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Thermometer className="mr-2 text-red-500" size={20} />
                Cooling & Overheat Fixes
            </h3>
            <ul className="space-y-3">
                {report.overheatFixes.map((tip, idx) => (
                     <li key={idx} className="flex items-start text-sm text-slate-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs mr-3 mt-0.5">{idx + 1}</span>
                        {tip}
                     </li>
                ))}
            </ul>
         </div>
      </div>

      {/* Powershell Command */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold text-white flex items-center">
                <Terminal className="mr-2 text-green-400" size={20} />
                One-Click Cleanup Script
            </h3>
            <button 
                onClick={handleCopy}
                className="flex items-center px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors"
            >
                {copied ? <CheckCircle size={14} className="mr-1.5" /> : <Copy size={14} className="mr-1.5" />}
                {copied ? 'Copied!' : 'Copy Script'}
            </button>
        </div>
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs md:text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-all">
            {report.powershellCommand}
        </div>
        <p className="mt-4 text-xs text-slate-500">
            <span className="text-yellow-500 font-bold">Caution:</span> Run PowerShell as Administrator. This script is generated based on standard cleanup procedures but always review code before executing.
        </p>
      </div>

      <div className="flex justify-center pb-12">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-semibold rounded-full hover:bg-slate-50 transition-colors shadow-sm"
        >
          Analyze Another PC
        </button>
      </div>
    </div>
  );
};