import { usersRoutes } from '../../Shared/Constants';
import { HttpClient } from './HttpClient';

export default class ClienteHttpClient extends HttpClient {
  /**
     *
     * @param {number} vendibleId
     * @param {{distanceMin: number, distanceMax: number}} [filters]
     */
  getProveedoresInfoOfVendible(vendibleId, filters) {
    const finalUrl = usersRoutes.getProveedoresOfVendible.replace('{vendibleId}', vendibleId);
    return this.get(finalUrl, filters);
  }
}
