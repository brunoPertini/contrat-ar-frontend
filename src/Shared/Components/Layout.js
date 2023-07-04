import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { sharedLabels } from '../../StaticData/Shared';

/**
 * @component
 *
 * The idea of this component is trying to modularize the grid structure of the pages, as well as
 * the use of the Loader component.
 * @param {Object} gridProps - props to be passed to the wrapping grid
 * @param { any } children - component to render inside the grid
 * @param { boolean } isLoading - flag to enable the loader
 */
function Layout({ gridProps, children, isLoading }) {
  return (
    <Grid
      {...gridProps}
    >
      { isLoading && (
      <>
        <CircularProgress sx={{
          mt: '2%',
        }}
        />
        <Typography variant="h6">
          { sharedLabels.loading }
        </Typography>
      </>
      ) }
      {!isLoading && children }
    </Grid>
  );
}

Layout.defaultProps = {
  gridProps: {},
  isLoading: false,
};

Layout.propTypes = {
  gridProps: PropTypes.object,
  children: PropTypes.any.isRequired,
  isLoading: PropTypes.bool,
};

export default Layout;
