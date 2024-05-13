import { useRef, useState, useCallback } from 'react';

export default function useDebouncedCallback(callback, delay) {
  const [debouncedValue, setDebouncedValue] = useState();

  const timer = useRef(null);

  const debouncedFunction = useCallback(
    (...args) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      
      timer.current = setTimeout(() => {
        setDebouncedValue(callback(...args));
      }, delay);

      // Cleanup function to clear timeout on unmount
      return () => clearTimeout(timer.current);
    },
    [callback, delay]
  );
  return {debouncedFunction, debouncedValue};
}
