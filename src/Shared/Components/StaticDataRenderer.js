import PropTypes from 'prop-types';
import { useState } from 'react';
import Header from '../../Header';
import { routes } from '../Constants';
import { flexColumn } from '../Constants/Styles';
import { buildFooterOptions } from '../Helpers/UtilsHelper';
import Footer from './Footer';
import Layout from './Layout';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';

const footerOptions = buildFooterOptions(routes.termsAndConditions);

const httpClient = HttpClientFactory.createStaticContentHttpClient();

/**
 * Receives a document id and file type, reads it from backend and shows it as html
 */
export default function StaticDataRenderer({ documentId, documentType }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout gridProps={{
      sx: {
        ...flexColumn,
        height: '100vh',
        minHeight: '100vh',
      },
    }}
    >
      <Header />
      <Footer options={footerOptions} />
    </Layout>
  );
}

StaticDataRenderer.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.oneOf(['html', 'pdf']).isRequired,
};
