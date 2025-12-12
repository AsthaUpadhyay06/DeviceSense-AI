import React, { useState } from 'react';
import { UserInput } from '../types';
import { HardDrive, FolderOpen, Activity, Battery, Play, Loader2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    totalStorage: 512,
    freeStorage: 50,
    heavyFolders: '',
    taskManagerDesc: '',
    batteryPercent: 85,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'heavyFolders' || name === 'taskManagerDesc' ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-slate-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
          <Activity size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">System Diagnostics</h2>
          <p className="text-sm text-slate-500">Enter your PC details for a quick health check</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <HardDrive size={16} className="mr-2" />
              Total C: Drive Size (GB)
            </label>
            <input
              type="number"
              name="totalStorage"
              required
              min="1"
              value={formData.totalStorage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <HardDrive size={16} className="mr-2 text-green-600" />
              Free Space (GB)
            </label>
            <input
              type="number"
              name="freeStorage"
              required
              min="0"
              value={formData.freeStorage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-700">
            <FolderOpen size={16} className="mr-2" />
            Top Heavy Folders (Optional)
          </label>
          <textarea
            name="heavyFolders"
            placeholder="e.g. Downloads: 12GB, Games: 50GB..."
            rows={3}
            value={formData.heavyFolders}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-700">
            <Activity size={16} className="mr-2" />
            Task Manager Notes (Optional)
          </label>
          <textarea
            name="taskManagerDesc"
            placeholder="e.g. Chrome using 2GB RAM, System Interrupts high CPU..."
            rows={2}
            value={formData.taskManagerDesc}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-700">
            <Battery size={16} className="mr-2" />
            Battery Percentage
          </label>
          <div className="flex items-center space-x-4">
             <input
              type="range"
              name="batteryPercent"
              min="0"
              max="100"
              value={formData.batteryPercent}
              onChange={handleChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="font-semibold text-slate-700 min-w-[3rem] text-right">
              {formData.batteryPercent}%
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Analyzing System...</span>
            </>
          ) : (
            <>
              <Play size={20} />
              <span>Generate Health Report</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};