class CookiesService {
  static COOKIES_NAMES = {
    USER_TOKEN: 'userToken',
  };

  add(key, value) {
    document.cookie = `${key}=${value}`;
  }

  remove(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  get(key) {
    return document.cookie.split('; ')
      .find((row) => row.startsWith(key))
      ?.split('=')[1] || '';
  }
}

export default CookiesService;
