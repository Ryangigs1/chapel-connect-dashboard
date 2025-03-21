
import { useState, useEffect } from 'react';

interface RealTimeClockProps {
  showSeconds?: boolean;
  className?: string;
}

const RealTimeClock = ({ showSeconds = true, className = "" }: RealTimeClockProps) => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const formatTime = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    
    return showSeconds 
      ? `${hours}:${minutes}:${seconds}` 
      : `${hours}:${minutes}`;
  };
  
  return (
    <div className={`font-mono ${className}`}>
      {formatTime()}
    </div>
  );
};

export default RealTimeClock;
