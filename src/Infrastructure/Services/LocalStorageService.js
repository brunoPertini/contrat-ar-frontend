export class LocalStorageService {
  /** Dictionary that holds keys of interest for each page or in general under the "SHARED" key.
   * It should be the only source of truth when working with local storage.
  */
  static PAGES_KEYS = {
    PROVEEDOR: {
      PAGE_SCREEN: 'proveedor.page.screen',
    },
    SHARED: {
      BACKPRESSED: 'backPressed',
    },
  };

  setItem(key, value) {
    localStorage.setItem(key, value);
  }

  getItem(key) {
    return localStorage.getItem(key);
  }

  removeItem(key) {
    localStorage.removeItem(key);
  }

  /**
   * Deletes all the keys of the given page from localStorage.
   * @param {String} page
   * @throws {Error} if the page isn't in LocalStorageService.PAGES_KEYS
   */
  removeAllKeysOfPage(page) {
    const { PAGES_KEYS } = LocalStorageService;
    if (!(page in PAGES_KEYS)) {
      throw new Error('Not a valid page');
    }
    Object.keys(PAGES_KEYS[page]).forEach((key) => {
      this.removeItem(PAGES_KEYS[page][key]);
    });
  }
}
