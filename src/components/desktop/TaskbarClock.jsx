import { useEffect, useState, memo } from 'react';

function TaskbarClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const date = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="taskbar-clock">
      <span className="taskbar-clock-time">{time}</span>
      <span className="taskbar-clock-date">{date}</span>
    </div>
  );
}

export default memo(TaskbarClock);
