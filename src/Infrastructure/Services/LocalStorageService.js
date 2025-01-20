export class LocalStorageService {
  /** Dictionary that holds keys of interest for each page or in general under the "SHARED" key.
   * It should be the only source of truth when working with local storage.
  */
  static PAGES_KEYS = {
    ROOT: {
      COMES_FROM_SIGNUP: 'comesFromSignup',
      SUCCESS: 'success',
    },
    PROVEEDOR: {
      PAGE_SCREEN: 'proveedor.page.screen',
    },
    SHARED: {
      BACKPRESSED: 'backPressed',
      ENABLE_TIME: 'enableTime',
    },
    PRODUCT: {
      INDEX: 'producto',
    },
    SERVICE: {
      INDEX: 'servicio',
    },
    ADMIN: {
      USER_INFO: 'userInfo',
    },
    SIGNUP: {
      PERSONAL_DATA: 'personalDataFieldsValues',
      LOCATION: 'location',
      PROFILE_PHOTO: 'profilePhoto',
      PLAN_ID: 'selectedPlan',
    },
  };

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (e instanceof DOMException) {
        // Quota exceeded, removing all data in local storage
        Object.keys(LocalStorageService.PAGES_KEYS).forEach((pageKey) => {
          this.removeAllKeysOfPage(pageKey);
        });
      }
    }
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
