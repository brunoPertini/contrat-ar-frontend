import { useEffect, useRef } from 'react';

/**
 *
 * @param {any} value The object to be observed
 * @returns {any} The previous object's value
 */
export function usePreviousPropValue(value) {
  const prevPropValue = useRef();

  useEffect(() => {
    prevPropValue.current = value;
  }, [value]);

  return prevPropValue.current;
}
