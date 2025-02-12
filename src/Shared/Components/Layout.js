import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { sharedLabels } from '../../StaticData/Shared';
import { flexColumn } from '../Constants/Styles';

/**
 * @component
 *
 * The idea of this component is trying to modularize the grid structure of the pages, as well as
 * the use of the Loader component.
 * @param {Object} gridProps - props to be passed to the wrapping grid
 * @param { any } children - component to render inside the grid
 * @param { boolean } isLoading - flag to enable the loader
 */
function Layout({
  gridProps, children, isLoading, isLoadingAlternativeLabel,
}) {
  return (
    <Box
      {...gridProps}
    >
      { isLoading && (
      <Box {...flexColumn} alignItems="center">
        <CircularProgress sx={{
          mt: '2%',
        }}
        />
        <Typography variant="h6">
          { isLoadingAlternativeLabel || sharedLabels.loading }
        </Typography>
      </Box>
      ) }
      {!isLoading && children }
    </Box>
  );
}

Layout.defaultProps = {
  gridProps: {},
  isLoading: false,
  isLoadingAlternativeLabel: '',
};

Layout.propTypes = {
  gridProps: PropTypes.object,
  children: PropTypes.any.isRequired,
  isLoading: PropTypes.bool,
  isLoadingAlternativeLabel: PropTypes.string,
};

export default Layout;
