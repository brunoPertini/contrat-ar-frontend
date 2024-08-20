/* eslint-disable prefer-destructuring */
import { usersRoutes } from '../../Shared/Constants';
import { HttpClient } from './HttpClient';

export default class ClienteHttpClient extends HttpClient {
  #FILTERS_PARAMS = {
    MIN_DISTANCE: 'filter_distance_min',
    MAX_DISTANCE: 'filter_distance_max',
    MIN_PRICE: 'filter_price_min',
    MAX_PRICE: 'filter_price_max',
  };

  /**
   *
   * @param {Array<any>} filter
   * @param {String} key
   */
  #filterWasApplied(filters, key) {
    return !!(filters && filters[key]?.length);
  }

  get FILTERS_PARAMS() {
    return this.#FILTERS_PARAMS;
  }

  /**
     *
     * @param {number} vendibleId
     * @param {{toFilterDistances: Array<Number>, prices: Array<Number>}} [filters]
     * @param {Number} page
     */
  getProveedoresInfoOfVendible(vendibleId, filters, page) {
    const finalUrl = usersRoutes.getProveedoresOfVendible.replace('{vendibleId}', vendibleId);
    const queryParams = { page };

    if (this.#filterWasApplied(filters, 'toFilterDistances')) {
      queryParams[this.FILTERS_PARAMS.MIN_DISTANCE] = filters.toFilterDistances[0];
      queryParams[this.FILTERS_PARAMS.MAX_DISTANCE] = filters.toFilterDistances[1];
    }

    if (this.#filterWasApplied(filters, 'prices')) {
      queryParams[this.FILTERS_PARAMS.MIN_PRICE] = filters.prices[0];
      queryParams[this.FILTERS_PARAMS.MAX_PRICE] = filters.prices[1];
    }

    return this.get(finalUrl, queryParams);
  }
}
