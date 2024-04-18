import { useEffect, useRef, useState } from 'react';

export default function useDebouncedCallback(callback, delay) {
  const [debouncedValue, setDebouncedValue] = useState(null);

  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setDebouncedValue(callback);
    }, delay);

    // Cleanup function to clear timeout on unmount
    return () => clearTimeout(timer.current);
  }, [callback, delay]);

  return debouncedValue;
}
