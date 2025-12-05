import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alarm } from './types';
import Clock from './components/Clock';
import AlarmList from './components/AlarmList';
import AlarmForm from './components/AlarmForm';
import ActiveAlarmOverlay from './components/ActiveAlarmOverlay';
import { Plus } from 'lucide-react';

const App: React.FC = () => {
  // Load alarms from local storage initially
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('alarms');
    return saved ? JSON.parse(saved) : [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [triggeringAlarm, setTriggeringAlarm] = useState<Alarm | null>(null);
  
  // Ref to track triggered alarms to prevent re-triggering in the same minute
  const lastTriggeredRef = useRef<string | null>(null);
  
  // Audio Ref
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Persist alarms
  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Alarm Check Loop
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
      const currentDay = now.getDay(); // 0-6

      alarms.forEach((alarm) => {
        if (!alarm.isActive) return;

        // Check if alarm triggers today
        // Empty days array usually means "Once", but for simplicity let's assume it triggers today if active, then deactivates.
        // If days array is populated, check if today is in it.
        const isDayMatch = alarm.days.length === 0 || alarm.days.includes(currentDay);

        if (alarm.time === currentTime && isDayMatch) {
          // Unique key for this specific trigger instance (AlarmID + Time + Date)
          const triggerKey = `${alarm.id}-${currentTime}-${now.getDate()}`;

          if (lastTriggeredRef.current !== triggerKey && !triggeringAlarm) {
            triggerAlarm(alarm);
            lastTriggeredRef.current = triggerKey;
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms, triggeringAlarm]);

  // Sound Handling
  const startAlarmSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // Beep up

      // Pulsing effect
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 2; // 2 pulses per second
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 500;
      lfo.connect(lfoGain.gain);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      
      oscillatorRef.current = oscillator;
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, []);

  const stopAlarmSound = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      oscillatorRef.current = null;
    }
  }, []);

  const triggerAlarm = (alarm: Alarm) => {
    setTriggeringAlarm(alarm);
    startAlarmSound();
  };

  const handleStopAlarm = () => {
    stopAlarmSound();
    
    // If it was a "Once" alarm (empty days), deactivate it
    if (triggeringAlarm && triggeringAlarm.days.length === 0) {
      toggleAlarm(triggeringAlarm.id);
    }

    setTriggeringAlarm(null);
  };

  const handleSnooze = () => {
    stopAlarmSound();
    setTriggeringAlarm(null);
    // Snooze logic: Create a new one-time alarm for 5 mins later? 
    // For simplicity, we just stop it for now. A real app would create a temp alarm.
    // Let's just create a temp active alarm for now + 5 mins.
    if (triggeringAlarm) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      const snoozeTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      const snoozeAlarm: Alarm = {
        id: `snooze-${Date.now()}`,
        time: snoozeTime,
        label: `Snooze: ${triggeringAlarm.label}`,
        isActive: true,
        days: [], // Once
        smartPrompt: triggeringAlarm.smartPrompt 
      };
      setAlarms(prev => [...prev, snoozeAlarm]);
    }
  };

  const addAlarm = (newAlarm: Omit<Alarm, 'id'>) => {
    const alarm: Alarm = {
      ...newAlarm,
      id: Date.now().toString(),
    };
    setAlarms((prev) => [...prev, alarm]);
    setIsFormOpen(false);
  };

  const deleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-50 relative overflow-hidden">
      {/* Trigger Overlay */}
      {triggeringAlarm && (
        <ActiveAlarmOverlay 
          alarm={triggeringAlarm} 
          onStop={handleStopAlarm} 
          onSnooze={handleSnooze} 
        />
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto min-h-screen flex flex-col relative z-0">
        <header className="pt-8 px-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold font-mono">L</div>
                <h1 className="text-xl font-bold tracking-tight">Lumina</h1>
            </div>
        </header>

        <main className="flex-1 flex flex-col">
          <Clock />
          
          <div className="flex-1 bg-slate-900/50 backdrop-blur-md rounded-t-3xl border-t border-slate-800 mt-8 p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-semibold text-slate-200">Your Alarms</h2>
              <span className="text-sm text-slate-500">{alarms.filter(a => a.isActive).length} active</span>
            </div>
            
            <AlarmList 
              alarms={alarms} 
              onToggle={toggleAlarm} 
              onDelete={deleteAlarm} 
            />
          </div>
        </main>

        {/* FAB */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40"
          aria-label="Add Alarm"
        >
          <Plus size={32} />
        </button>
      </div>

      {/* Add Alarm Modal */}
      {isFormOpen && (
        <AlarmForm 
          onAdd={addAlarm} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
