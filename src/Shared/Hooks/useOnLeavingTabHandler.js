import { useEffect } from 'react';
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

export const removeOnLeavingTabHandlers = () => {
  window.removeEventListener('beforeunload', handleOnLeavingTab);
  window.removeEventListener('popstate', handleOnBackButtonPressed);
  localStorageService.removeItem(PAGES_KEYS.SHARED.BACKPRESSED);
};

export function useOnLeavingTabHandler(runBeforeLeavingFunction = EMPTY_FUNCTION) {
  useEffect(() => {
    window.addEventListener('beforeunload', (e) => handleOnLeavingTab(e, runBeforeLeavingFunction));
    window.addEventListener('popstate', (e) => handleOnBackButtonPressed(e, runBeforeLeavingFunction));
  }, []);
}
