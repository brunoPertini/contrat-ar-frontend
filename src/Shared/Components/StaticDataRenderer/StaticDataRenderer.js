import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Header from '../../../Header';
import { routes } from '../../Constants';
import { flexColumn } from '../../Constants/Styles';
import { buildFooterOptions } from '../../Helpers/UtilsHelper';
import Footer from '../Footer';
import Layout from '../Layout';

const footerOptions = buildFooterOptions(routes.termsAndConditions);

/**
 * Receives a document id and file type, reads it from backend and shows it as html
 */
export default function StaticDataRenderer({ documentId, documentType, getDocumentContent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getDocumentContent(documentId, documentType).then((content) => setDocumentContent(content))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout
      isLoading={isLoading}
      gridProps={{
        sx: {
          ...flexColumn,
          height: '100vh',
          minHeight: '100vh',
        },
      }}
    >
      <Header />
      {
        !!documentContent && <div dangerouslySetInnerHTML={{ __html: documentContent }} />
      }
      <Footer options={footerOptions} />
    </Layout>
  );
}

StaticDataRenderer.propTypes = {
  getDocumentContent: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.oneOf(['html', 'pdf']).isRequired,
};
