import { HttpClientFactory } from '../../../Infrastructure/HttpClientFactory';
import { routes } from '../../Constants';
import StaticDataRenderer from './StaticDataRenderer';

// TODO: read this from a config endpoint from BE, and store it in redux
const TERMS_AND_CONDITIONS_DOCUMENT_ID = '1dzVXkF26QTAYV3X9XYW7-ysiyEfs2L5duoMBLXNVFYo';

const DATA_USAGE_DOCUMENT_ID = '1M41G3u26odgCdmQjgzqj3WE1gU-RDJjtMWCF8u_ngpI';

const documentIdsResolver = {
  [routes.termsAndConditions]: TERMS_AND_CONDITIONS_DOCUMENT_ID,
  [routes.dataUsage]: DATA_USAGE_DOCUMENT_ID,
};

const documentTypesResolver = {
  [routes.termsAndConditions]: 'html',
  [routes.dataUsage]: 'html',
};

const httpClient = HttpClientFactory.createStaticContentHttpClient();

const getDocumentContent = (documentId, documentType) => httpClient.readDocumentAsContentType(documentId, documentType);

export default function StaticDataRendererContainer() {
  const page = window.location.pathname;

  if (!(page in documentIdsResolver)) {
    throw new Response('', { status: 404 });
  }

  const documentId = documentIdsResolver[page];
  const documentType = documentTypesResolver[page];

  return (
    <StaticDataRenderer
      documentId={documentId}
      documentType={documentType}
      getDocumentContent={getDocumentContent}
    />
  );
}
