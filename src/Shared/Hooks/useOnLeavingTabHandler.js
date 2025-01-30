import { useEffect, useCallback, useState } from 'react';
import { EMPTY_FUNCTION } from '../Constants/System';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';

const localStorageService = new LocalStorageService();
const { PAGES_KEYS } = LocalStorageService;

const handleOnLeavingTab = (event, runBeforeLeavingFunction = EMPTY_FUNCTION) => {
  runBeforeLeavingFunction();
  event.preventDefault();
};

const handleOnBackButtonPressed = (event, runBeforeLeavingFunction = EMPTY_FUNCTION) => {
  event.preventDefault();
  runBeforeLeavingFunction();
  window.history.forward();
  localStorageService.setItem(PAGES_KEYS.SHARED.BACKPRESSED, 'true');
};

export const removeOnLeavingTabHandlers = (onLeavingTab, onBackButtonPressed) => {
  window.removeEventListener('beforeunload', onLeavingTab);
  window.removeEventListener('popstate', onBackButtonPressed);
  localStorageService.removeItem(PAGES_KEYS.SHARED.BACKPRESSED);
};

export function useOnLeavingTabHandler(
  runBeforeLeavingFunction = EMPTY_FUNCTION,
  removeListeners = false,
) {
  const [listenersAdded, setListenersAdded] = useState(false);

  const onLeavingTab = useCallback(
    (e) => handleOnLeavingTab(e, runBeforeLeavingFunction),
    [runBeforeLeavingFunction],
  );

  const onBackButtonPressed = useCallback(
    (e) => handleOnBackButtonPressed(e, runBeforeLeavingFunction),
    [runBeforeLeavingFunction],
  );

  useEffect(() => {
    if (removeListeners) {
      return removeOnLeavingTabHandlers(onLeavingTab, onBackButtonPressed);
    }

    if (!listenersAdded) {
      setListenersAdded(true);
      window.addEventListener('beforeunload', onLeavingTab);
      window.addEventListener('popstate', onBackButtonPressed);
    }

    return () => {
      removeOnLeavingTabHandlers(onLeavingTab, onBackButtonPressed);
    };
  }, [removeListeners]);
}
