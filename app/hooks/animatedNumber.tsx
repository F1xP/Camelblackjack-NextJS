import { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  startValue?: number;
  duration?: number;
  generateCommas?: boolean;
  generateDecimals?: boolean;
}

function AnimatedNumber({
  value,
  startValue = 0,
  duration = 1000,
  generateCommas = false,
  generateDecimals = false,
}: AnimatedNumberProps) {
  const [returnValue, setReturnValue] = useState<number>(value);

  useEffect(() => {
    let timeOutID: NodeJS.Timeout;
    let startTime: number;
    let currentTime: number;
    let elapsedTime: number;
    let progress: number;
    let currentValue: number;

    const updateValue = () => {
      currentTime = new Date().getTime();
      elapsedTime = currentTime - startTime;
      progress = Math.min(1, elapsedTime / duration);
      currentValue = startValue - (startValue - value) * progress;

      setReturnValue(currentValue);

      if (elapsedTime < duration) timeOutID = setTimeout(updateValue, 16);
    };

    startTime = new Date().getTime();
    timeOutID = setTimeout(updateValue, 16);

    return () => {
      clearTimeout(timeOutID);
    };
  }, [value, startValue, duration]);

  let finalValue = generateDecimals ? toFixedNoRound(returnValue) : returnValue.toFixed(0);

  if (generateCommas) {
    finalValue = finalValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return finalValue;
}

export default AnimatedNumber;

function toFixedNoRound(num: number): string {
  const str = num.toString();
  const [intPart, decPart = ''] = str.split('.');
  const paddedDecimals = decPart.padEnd(2, '0');
  return decPart ? `${intPart}.${paddedDecimals}` : `${str}.${'0'.repeat(2)}`;
}
