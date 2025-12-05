import React, { useEffect, useState } from 'react';
import { Alarm } from '../types';
import { generateWakeUpMessage } from '../services/geminiService';
import { Bell, Sparkles, Loader2 } from 'lucide-react';

interface ActiveAlarmOverlayProps {
  alarm: Alarm;
  onSnooze: () => void;
  onStop: () => void;
}

const ActiveAlarmOverlay: React.FC<ActiveAlarmOverlayProps> = ({ alarm, onSnooze, onStop }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (alarm.smartPrompt) {
      setLoading(true);
      generateWakeUpMessage(alarm.smartPrompt, alarm.time)
        .then((generatedText) => {
          if (mounted) {
            setMessage(generatedText);
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) setLoading(false);
        });
    }

    return () => {
      mounted = false;
    };
  }, [alarm]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 text-white p-6">
      {/* Background pulsing animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl animate-ping opacity-20" style={{ animationDuration: '3s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="mb-4 relative">
          <Bell size={64} className="text-white animate-bounce" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
        </div>

        <div>
          <h1 className="text-8xl font-mono font-bold tracking-tighter mb-2">{alarm.time}</h1>
          <h2 className="text-2xl font-light text-slate-300">{alarm.label}</h2>
        </div>

        {/* AI Message Area */}
        <div className="min-h-[120px] flex items-center justify-center w-full">
            {alarm.smartPrompt ? (
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6 rounded-2xl border border-indigo-500/30 backdrop-blur-sm w-full shadow-xl">
                    {loading ? (
                        <div className="flex flex-col items-center gap-3 text-indigo-300">
                             <Loader2 className="animate-spin" size={24} />
                             <span className="text-sm font-medium tracking-wide">Consulting the AI...</span>
                        </div>
                    ) : (
                        <div className="space-y-2">
                             <div className="flex items-center justify-center gap-2 text-indigo-300 mb-2">
                                <Sparkles size={16} />
                                <span className="text-xs uppercase font-bold tracking-widest">AI Motivation</span>
                             </div>
                             <p className="text-lg md:text-xl font-medium leading-relaxed text-indigo-50 italic">
                                "{message}"
                             </p>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-slate-400">Time to wake up!</p>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <button
            onClick={onSnooze}
            className="py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-lg transition-colors border border-slate-700"
          >
            Snooze 5m
          </button>
          <button
            onClick={onStop}
            className="py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg shadow-lg shadow-red-900/50 transition-transform active:scale-95"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveAlarmOverlay;
