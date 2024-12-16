import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useCallback, useEffect, useState } from 'react';
import { sharedLabels } from '../../StaticData/Shared';
import SecurityService from '../../Infrastructure/Services/SecurityService';
import { ROLE_ADMIN } from '../Constants/System';
import { getUserInfoResponseShape } from '../PropTypes/Vendibles';
import { adminLabels } from '../../StaticData/Admin';

export default function LoggedUserInfo({ userInfo, handleLogout }) {
  const [labels, setLabels] = useState({
    name: '',
    surname: '',
    adminDisclaimer: '',
  });

  const securityService = new SecurityService({ handleLogout });

  const handleSetLabels = useCallback(async () => {
    const tokenUserInfo = await securityService.readJwtPayload(userInfo.token); 

    if (tokenUserInfo?.role === ROLE_ADMIN && userInfo.role !== ROLE_ADMIN) {
      return setLabels({
        name: tokenUserInfo.name,
        surname: tokenUserInfo.surname,
        adminDisclaimer: adminLabels.loguedUserDisclaimer.replace('{name}', userInfo.name)
          .replace('{surname}', userInfo.surname),
      });
    }

    return setLabels({
      name: userInfo.name,
      surname: userInfo.surname,
    });
  }, [securityService]);

  useEffect(() => {
    handleSetLabels();
  }, []);

  return (
    <Grid container>
      <Grid item>
        <Typography variant="h6">
          { sharedLabels.hello }
          {' '}
          { labels.name }
          {' '}
          { labels.surname }
          {' '}
          { labels.adminDisclaimer }
        </Typography>
      </Grid>
    </Grid>
  );
}

LoggedUserInfo.propTypes = {
  userInfo: PropTypes.shape(getUserInfoResponseShape).isRequired,
  handleLogout: PropTypes.func.isRequired,
};
