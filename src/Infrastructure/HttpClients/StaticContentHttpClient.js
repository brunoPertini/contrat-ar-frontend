import { staticContentRoutes } from '../../Shared/Constants/ApiRoutes';
import { HttpClient } from './HttpClient';

export default class StaticContentHttpClient extends HttpClient {
  readDocumentAsContentType(documentId, contentType) {
    const url = staticContentRoutes
      .replace('{id}', documentId)
      .replace('{type}', contentType);

    return this.get(url);
  }
}
