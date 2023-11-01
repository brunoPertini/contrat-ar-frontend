import { useEffect, useRef } from 'react';

export function usePreviousPropValue(value) {
  const prevPropValue = useRef();

  useEffect(() => {
    prevPropValue.current = value;
  }, [value]);

  return prevPropValue.current;
}
