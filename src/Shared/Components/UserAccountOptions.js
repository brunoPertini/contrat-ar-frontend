import PropTypes from 'prop-types';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { sharedLabels } from '../../StaticData/Shared';

export default function UserAccountOptions({ userInfo }) {
  return (
    <Grid container>
      <Grid item>
        <Typography variant="h6">
          { sharedLabels.hello }
          {' '}
          { userInfo.name }
        </Typography>
      </Grid>
      <Grid item>
        <MenuItem>
          <ListItemIcon>
            <AccountCircleRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{ sharedLabels.myProfile }</ListItemText>
        </MenuItem>
      </Grid>
    </Grid>
  );
}

UserAccountOptions.propTypes = {
  userInfo: PropTypes.shape({ name: PropTypes.string }).isRequired,
};
