import { useEffect, useRef, useState } from "react";

const useThrottle = (value, delay) => {
    const [throttleValue, setThrottleValue] = useState(value);
  
    const lastExecuted = useRef(Date.now());
    
    useEffect(() => {
      const handler = setTimeout(() => {
        const now = Date.now();
        const timeElapsed = now -lastExecuted.current;
  
        if (timeElapsed >= delay){
          setThrottleValue(value);
          lastExecuted.current = now;
        }
      }, delay - (Date.now() - lastExecuted.current));
  
      return () => {
        clearTimeout(handler)
      }
    }, [delay, value])
  }

  export default useThrottle