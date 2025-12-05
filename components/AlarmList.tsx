import React from 'react';
import { Alarm } from '../types';
import { Trash2, Sparkles } from 'lucide-react';

interface AlarmListProps {
  alarms: Alarm[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AlarmList: React.FC<AlarmListProps> = ({ alarms, onToggle, onDelete }) => {
  if (alarms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-500">
        <p>No alarms set</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-24">
      {alarms.map((alarm) => (
        <div
          key={alarm.id}
          className={`relative overflow-hidden group p-4 rounded-xl border transition-all duration-300 ${
            alarm.isActive
              ? 'bg-slate-800/80 border-slate-700 shadow-lg'
              : 'bg-slate-900/50 border-slate-800 opacity-70'
          }`}
        >
          <div className="flex justify-between items-center relative z-10">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-mono font-medium ${alarm.isActive ? 'text-white' : 'text-slate-500'}`}>
                  {alarm.time}
                </span>
                {alarm.smartPrompt && (
                   <Sparkles size={14} className="text-indigo-400" />
                )}
              </div>
              <div className="flex gap-2 items-center mt-1">
                <span className="text-sm text-slate-400">{alarm.label}</span>
                <span className="text-xs text-slate-600 font-medium">
                  {alarm.days.length === 7 ? 'Everyday' : alarm.days.length === 0 ? 'Once' : 'Weekdays'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button
                onClick={() => onDelete(alarm.id)}
                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Delete alarm"
              >
                <Trash2 size={18} />
              </button>

              <button
                onClick={() => onToggle(alarm.id)}
                className={`w-12 h-7 rounded-full transition-colors duration-300 relative focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  alarm.isActive ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-md ${
                    alarm.isActive ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          {/* Active glow effect */}
          {alarm.isActive && (
            <div className="absolute inset-0 bg-blue-600/5 pointer-events-none" />
          )}
        </div>
      ))}
    </div>
  );
};

export default AlarmList;
