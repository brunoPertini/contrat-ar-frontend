/* eslint-disable prefer-destructuring */
import { usersRoutes } from '../../Shared/Constants';
import { HttpClient } from './HttpClient';

export default class ClienteHttpClient extends HttpClient {
  /**
     *
     * @param {number} vendibleId
     * @param {{toFilterDistances: Array<Number>}} [filters]
     */
  getProveedoresInfoOfVendible(vendibleId, filters) {
    const finalUrl = usersRoutes.getProveedoresOfVendible.replace('{vendibleId}', vendibleId);
    const queryParams = {};

    if (filters?.toFilterDistances?.length) {
      queryParams.filter_distance_min = filters.toFilterDistances[0];
      queryParams.filter_distance_max = filters.toFilterDistances[1];
    }

    return this.get(finalUrl, queryParams);
  }
}
