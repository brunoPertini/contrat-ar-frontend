import { PRODUCT, PRODUCTS, SERVICE } from '../Constants/System';

export const vendibleUnit = (vendibleType) => (vendibleType === PRODUCTS
  ? PRODUCT : SERVICE).toLowerCase();
