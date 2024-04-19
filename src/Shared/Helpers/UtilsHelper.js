import CookiesService from '../../Infrastructure/Services/CookiesService';
import { PRODUCT, PRODUCTS, SERVICE } from '../Constants/System';

export const parseVendibleUnit = (vendibleType) => (vendibleType === PRODUCTS
  ? PRODUCT : SERVICE).toLowerCase();

export const waitAndCleanUserTokenCookie = () => {
  setTimeout(() => {
    const cookiesService = new CookiesService();
    cookiesService.remove(CookiesService.COOKIES_NAMES.USER_TOKEN);
  }, 10000);
};
