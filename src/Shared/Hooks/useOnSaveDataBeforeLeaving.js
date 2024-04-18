/**
 * @typedef KeyValueAttribute
 * @type {object}
 * @property {String} key
 * @property {String} value
 */

import { useEffect } from 'react';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';

/**
 * Saves passed data in LocalStorage before leaving current page
 * @param {{ page: String, data: KeyValueAttribute[]}}
 */
export function useOnSaveDataBeforeLeaving({ page, data }) {
  const saveData = () => {
    const localStorageService = new LocalStorageService();
    localStorageService.setItem(page, data);
  };
  useEffect(() => {
    window.addEventListener('beforeunload', saveData);

    return () => {
      window.removeEventListener('beforeunload', saveData);
    };
  }, []);
}
