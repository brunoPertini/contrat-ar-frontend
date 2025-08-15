export const PLAN_TYPE_FREE = 'FREE';

export const PLAN_TYPE_PAID = 'PAID';

export const USER_TYPE_CLIENTE = 'CLIENTE';

export const USER_TYPE_PROVEEDOR_SERVICES = 'SERVICIOS';

export const USER_TYPE_PROVEEDOR_PRODUCTS = 'PRODUCTOS';

export const PROVEEDOR = 'PROVEEDOR';

export const SERVICES = 'servicios';

export const PRODUCTS = 'productos';

export const PRODUCT = 'PRODUCTO';

export const SERVICE = 'SERVICIO';

export const ROLE_PROVEEDOR_PRODUCTOS = 'PROVEEDOR_PRODUCTOS';

export const ROLE_PROVEEDOR_SERVICIOS = 'PROVEEDOR_SERVICIOS';

export const ROLE_ADMIN = 'ADMIN';

export const CLIENTE = 'CLIENTE';

export const EMPTY_FUNCTION = () => {};

export const MAX_CLIENT_VENDIBLES_GALLERY_IMAGES = 3;

export const PRICE_TYPE_FIXED = 'FIXED';

export const PRICE_TYPE_VARIABLE = 'VARIABLE';

export const PRICE_TYPE_VARIABLE_WITH_AMOUNT = 'VARIABLE_WITH_AMOUNT';

export const PRICE_TYPES = {
  [PRICE_TYPE_FIXED]: 'Fijo',
  [PRICE_TYPE_VARIABLE]: 'Variable',
  [PRICE_TYPE_VARIABLE_WITH_AMOUNT]: 'Variable con monto mínimo',
};

export const PRODUCT_LOCATION_FIXED = 'Para retirar en un domicilio particular';

export const PRODUCT_LOCATION_AT_HOME = 'Ofrezco envío a domicilio';

export const SERVICE_LOCATION_AT_HOME = 'A domicilio';

export const SERVICE_LOCATION_FIXED = 'En un domicilio particular';

export const ARGENTINA_LOCALE = 'es-AR';

export const dialogModalTexts = {
  EXIT_APP: {
    title: '¿Desea salir?',
    text: 'Deberá iniciar sesión nuevamente',
  },
  SAVE_CHANGES: {
    title: '¿Desea salir?',
    text: 'Perderá todos los cambios',
  },
  DELETE_VENDIBLE: {
    title: '¿Desea eliminar el {vendible} {vendibleNombre}?',
    adminTitle: '¿Desea eliminar el {vendible} {vendibleNombre} y todas sus publicaciones?',
    text: '¡Tené en cuenta que esta acción es irreversible!',
  },
};

export const USUARIO_TYPE_PROVEEDORES = 'proveedores';
export const USUARIO_TYPE_CLIENTES = 'clientes';

export const USUARIOS_TYPES = [USUARIO_TYPE_PROVEEDORES, USUARIO_TYPE_CLIENTES];

export const STOCK_SLIDER_MIN = 1;

export const STOCK_SLIDER_MAX = 1000000;

export const PAGE_SIZE = 10;

export const pricesTypeMock = [PRICE_TYPES.FIXED,
  PRICE_TYPES.VARIABLE, PRICE_TYPES.VARIABLE_WITH_AMOUNT];

export const serviceLocationsMock = [SERVICE_LOCATION_AT_HOME, SERVICE_LOCATION_FIXED];

export const productLocationsMock = [PRODUCT_LOCATION_AT_HOME, PRODUCT_LOCATION_FIXED];

export const INTEGER_MAXIMUM = 2147483647; // Maps to int data type constraint in Java.\

export const POST_STATES = {
  IN_REVIEW: 'IN_REVIEW',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PAUSED: 'PAUSED',
  REJECTED: 'REJECTED',
};

export const PAYMENT_STATE = {
  SUCCESS: 'APPROVED',
  ERROR: 'REJECTED',
  UNKNOWN: 'UNKNOWN_ERROR',
  PROCESSED: 'PROCESSED',
};

export const TwoFactorAuthResult = {
  PENDING: 'PENDING',
  PASSED: 'PASSED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
};

export const ACCOUNT_STATUS = {
  DISABLED: 'disabled',
  UNVERIFIED: 'unverified',
};

export const PROMOTION_TYPE = {
  FULL_DISCOUNT_FOREVER: 'FULL_DISCOUNT_FOREVER',
};
