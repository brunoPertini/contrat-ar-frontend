import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';

const enablingDuration = (minutes) => minutes * 60 * 1000;

const localStorageService = new LocalStorageService();

function getRemainingTime() {
  const storedTime = localStorage.getItem(LocalStorageService.PAGES_KEYS.SHARED.ENABLE_TIME);
  if (!storedTime) {
    return 0;
  }
  const currentTime = new Date().getTime();
  return storedTime - currentTime;
}

function updateTimer(enableFn) {
  const remainingTime = getRemainingTime();

  if (remainingTime <= 0) {
    enableFn();
    localStorage.removeItem(LocalStorageService.PAGES_KEYS.SHARED.ENABLE_TIME);
  } else {
    setTimeout(() => updateTimer(enableFn), 1000);
  }
}

function startTimer({
  disableDuration, enableFn, disableFn,
}) {
  disableFn();

  const unlockTime = new Date().getTime() + enablingDuration(disableDuration);
  localStorageService.setItem(
    LocalStorageService.PAGES_KEYS.SHARED.ENABLE_TIME,
    unlockTime,
  );

  updateTimer(enableFn);
}

/**
 * Receives functions to enable or disable an element, the disabling duration in minutes, a label
 * to show while the element is disabled, and a flag to start the timer
 * @param {{
 * disableDuration: number,
 * enableFn: Function,
 * disableFn: Function
 * isTimerStarted: Boolean,
 * label: String
 * }}
 *
 */
export default function useDisableElementTimer({
  disableDuration, enableFn, disableFn, isTimerStarted, label,
}) {
  useEffect(() => {
    if (isTimerStarted && disableDuration) {
      startTimer({
        disableDuration, enableFn, disableFn,
      });
    }
  }, [isTimerStarted, disableDuration]);
  return isTimerStarted ? (
    <Typography variant="h6" sx={{ color: 'red' }}>
      { label }
    </Typography>
  ) : null;
}
