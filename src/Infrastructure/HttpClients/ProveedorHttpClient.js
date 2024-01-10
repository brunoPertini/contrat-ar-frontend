import { proveedoresRoutes } from '../../Shared/Constants/ApiRoutes';
import { ROLE_PROVEEDOR_PRODUCTOS } from '../../Shared/Constants/System';
import { HttpClient } from './HttpClient';

export class ProveedorHttpClient extends HttpClient {
  constructor(config) {
    super({ headersValues: config.headersValues });
  }

  getVendibles(proveedorId) {
    const url = proveedoresRoutes.getVendibles.replace('{proveedorId}', proveedorId);
    return this.get(url);
  }

  postVendible({ role, proveedorId, body }) {
    const url = role === ROLE_PROVEEDOR_PRODUCTOS ? proveedoresRoutes.productoBaseUrl
      : proveedoresRoutes.servicioBaseUrl;
    return this.post(url, { proveedorId }, body);
  }
}
