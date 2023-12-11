'use client';
import { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value?: number;
  startValue?: number;
  duration?: number;
}

const useAnimatedNumber = ({ value = 0, startValue = 0, duration = 1000 }: AnimatedNumberProps): string => {
  const [returnValue, setReturnValue] = useState<number>(startValue);

  useEffect(() => {
    let timeOutID: NodeJS.Timeout;

    const updateValue = () => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(1, elapsedTime / duration);
      const currentValue = startValue + (value - startValue) * progress;

      setReturnValue(currentValue);

      if (elapsedTime < duration) timeOutID = setTimeout(updateValue, 16);
    };

    const startTime = new Date().getTime();
    timeOutID = setTimeout(updateValue, 16);

    return () => {
      clearTimeout(timeOutID);
    };
  }, [value, startValue, duration]);

  return `${Number(returnValue).toFixed(0)}`;
};

export default useAnimatedNumber;
