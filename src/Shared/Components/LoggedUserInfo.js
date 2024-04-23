import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { sharedLabels } from '../../StaticData/Shared';

export default function LoggedUserInfo({ userInfo }) {
  return (
    <Grid container>
      <Grid item>
        <Typography variant="h6">
          { sharedLabels.hello }
          {' '}
          { userInfo.name }
          {' '}
          { userInfo.surname }
        </Typography>
      </Grid>
    </Grid>
  );
}

LoggedUserInfo.propTypes = {
  userInfo: PropTypes.shape({ name: PropTypes.string, surname: PropTypes.string }).isRequired,
};
