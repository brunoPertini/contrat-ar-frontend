/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { EMPTY_FUNCTION } from '../Constants/System';

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
    window.addEventListener('beforeunload', (event) => {
      handleOnLeavingTab(event);
    });

    window.onpopstate = () => {
      handleOnBackButtonPressed();
    };
  }, []);
}
