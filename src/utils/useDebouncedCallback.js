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

      console.log("L18 inside debounceFunction", debouncedValue)
      // Cleanup function to clear timeout on unmount
      return () => clearTimeout(timer.current);
    },
    [callback, delay]
  );
  console.log("L22 before return debouncedFunction", debouncedFunction)
  return {debouncedFunction, debouncedValue};
}
