import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import StaticAlert from '../Shared/Components/StaticAlert';
import Footer from '../Shared/Components/Footer';
import { routes } from '../Shared/Constants';
import { flexColumn } from '../Shared/Constants/Styles';
import { buildFooterOptions } from '../Shared/Helpers/UtilsHelper';
import errorMessages from '../StaticData/Shared/errorMessages.json';

const labelResolver = {
  401: errorMessages['page.unauthorized'],
  404: errorMessages['page.notFound'],
  500: errorMessages['page.unknownError'],
};

const footerOptions = buildFooterOptions(routes.index);

export default function ErrorPage({ status = undefined }) {
  const { code } = useParams();
  const resolvedStatus = status ?? code;
  return (
    <Box
      {...flexColumn}
      height="100vh"
      minHeight="100vh"
    >
      <Header />
      <StaticAlert
        styles={{
          width: '85%',
          mx: 'auto',
          mt: 4,
          fontSize: '1.5rem',
          p: 2,
          borderRadius: 2,
        }}
        severity="error"
        variant="filled"
        label={labelResolver[resolvedStatus]}
      />
      <Footer options={footerOptions} />
    </Box>
  );
}

ErrorPage.propTypes = {
  status: PropTypes.oneOf([401, 404, 500]).isRequired,
};
