import { PRODUCT, PRODUCTS, SERVICE } from '../Constants/System';

export const parseVendibleUnit = (vendibleType) => (vendibleType === PRODUCTS
  ? PRODUCT : SERVICE).toLowerCase();
