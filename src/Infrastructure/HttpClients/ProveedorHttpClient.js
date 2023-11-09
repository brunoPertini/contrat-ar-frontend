import { proveedoresRoutes } from '../../Shared/Constants/ApiRoutes';
import { HttpClient } from './HttpClient';

export class ProveedorHttpClient extends HttpClient {
  constructor(config) {
    super({ headersValues: config.headersValues });
  }

  getVendibles(proveedorId) {
    const url = proveedoresRoutes.getVendibles.replace('{proveedorId}', proveedorId);
    return this.get(url);
  }
}
