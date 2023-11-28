/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { EMPTY_FUNCTION } from '../Constants/System';

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

export function useOnLeavingTabHandler(runBeforeLeavingFunction = EMPTY_FUNCTION) {
  const handleOnLeavingTab = (event) => event.preventDefault();

  const handleOnBackButtonPressed = () => {
    runBeforeLeavingFunction();
    window.history.forward();
    localStorage.setItem('backPressed', 'true');
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleOnLeavingTab);
    window.addEventListener('popstate', handleOnBackButtonPressed);

    return () => {
      window.removeEventListener('beforeunload', handleOnLeavingTab);
      window.removeEventListener('popstate', handleOnBackButtonPressed);
    };
  }, []);
}
