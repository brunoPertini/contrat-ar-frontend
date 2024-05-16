import { adminRoutes } from '../../Shared/Constants/ApiRoutes';
import { HttpClient } from './HttpClient';

export default class AdminHttpClient extends HttpClient {
  constructor(config) {
    super({ headersValues: config.headersValues });
  }

  requestChangeExists(sourceTableId, toFilterAttribute) {
    return this.get(
      adminRoutes.changeRequestExists,
      { sourceTableId, [toFilterAttribute.key]: toFilterAttribute.value },
    );
  }
}
