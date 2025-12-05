import React, { useState } from 'react';
import { Alarm } from '../types';
import { Plus, X, Sparkles } from 'lucide-react';

interface AlarmFormProps {
  onAdd: (alarm: Omit<Alarm, 'id'>) => void;
  onCancel: () => void;
}

const AlarmForm: React.FC<AlarmFormProps> = ({ onAdd, onCancel }) => {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('Morning Alarm');
  const [smartPrompt, setSmartPrompt] = useState('');
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      time,
      label,
      isActive: true,
      days,
      smartPrompt: smartPrompt.trim() || undefined,
    });
  };

  const toggleDay = (dayIndex: number) => {
    setDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-xl font-semibold text-white">New Alarm</h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Time Input */}
          <div className="flex justify-center">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-5xl font-mono bg-transparent text-center border-none focus:ring-0 text-white p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
              required
            />
          </div>

          {/* Days Selection */}
          <div className="flex justify-between gap-1">
            {weekDays.map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleDay(idx)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                  days.includes(idx)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105'
                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Label Input */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Alarm Name"
            />
          </div>

          {/* Smart Prompt (Gemini) */}
          <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-4 rounded-xl border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-2 text-indigo-300">
              <Sparkles size={16} />
              <label className="text-xs uppercase tracking-wider font-semibold">AI Wake Up Persona</label>
            </div>
            <textarea
              value={smartPrompt}
              onChange={(e) => setSmartPrompt(e.target.value)}
              className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-indigo-100 placeholder-indigo-300/30 focus:outline-none focus:border-indigo-400 transition-all resize-none"
              rows={2}
              placeholder="E.g., Wake me up like a pirate captain..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Set Alarm
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlarmForm;
