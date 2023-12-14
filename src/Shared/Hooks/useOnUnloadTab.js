import { useEffect } from 'react';

/** @param {Function} toRunFunction  */
export default function useOnUnloadTab(toRunFunction) {
  useEffect(() => {
    window.addEventListener('unload', toRunFunction);
    window.addEventListener('pagehide', toRunFunction);
  }, []);
}
