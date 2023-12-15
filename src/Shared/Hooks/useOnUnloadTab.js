import { useEffect } from 'react';

/** @param {Function} toRunFunction  */
export default function useOnUnloadTab(toRunFunction) {
  const handleExitTab = (event, runningFunction) => {
    if (!event.persisted) {
      runningFunction();
    }
  };
  useEffect(() => {
    window.addEventListener('unload', (e) => handleExitTab(e, toRunFunction));
    window.addEventListener('pagehide', (e) => handleExitTab(e, toRunFunction));
  }, []);
}
