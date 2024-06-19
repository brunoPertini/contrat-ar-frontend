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

export const PRICE_TYPE_FIXED = 'Fijo';

export const PRICE_TYPE_VARIABLE = 'Variable';

export const PRICE_TYPE_VARIABLE_WITH_AMOUNT = 'Variable con monto minimo';

export const PRICE_TYPES = {
  FIXED: PRICE_TYPE_FIXED,
  VARIABLE: PRICE_TYPE_VARIABLE,
  VARIABLE_WITH_AMOUNT: PRICE_TYPE_VARIABLE_WITH_AMOUNT,
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
    text: 'Esta acción es irreversible',
  },
};

export const USUARIO_TYPE_PROVEEDORES = 'proveedores';
export const USUARIO_TYPE_CLIENTES = 'clientes';

export const USUARIOS_TYPES = [USUARIO_TYPE_PROVEEDORES, USUARIO_TYPE_CLIENTES];
