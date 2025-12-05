import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSeconds = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-100">
      <div className="relative">
        <div className="text-7xl md:text-9xl font-mono font-bold tracking-tighter tabular-nums bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-blue-600 drop-shadow-2xl">
          {formatTime(now)}
        </div>
        <div className="absolute -bottom-4 right-0 text-xl md:text-2xl font-mono font-medium text-slate-400">
          {formatSeconds(now)}
        </div>
      </div>
      <div className="mt-6 text-lg md:text-xl font-light tracking-wide text-slate-400 uppercase">
        {formatDate(now)}
      </div>
    </div>
  );
};

export default Clock;
