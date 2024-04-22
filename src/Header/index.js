import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import isEmpty from 'lodash/isEmpty';
import { sharedLabels } from '../StaticData/Shared';
import Menu from '../Shared/Components/Menu';
import { UserAccountOptions } from '../Shared/Components';
import { getUserInfoResponseShape } from '../Shared/PropTypes/Vendibles';

function HeaderMenu({ options }) {
  return (
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
      />
      {
      options.map((option) => (
        <Button
          color="inherit"
          onClick={option.onClick}
          key={`menu-${option.label}`}
        >
          {option.label}
        </Button>
      ))
    }
    </Toolbar>
  );
}

HeaderMenu.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  })).isRequired,
};

export default function Header({
  userInfo, menuOptions, withMenuComponent, renderNavigationLinks,
}) {
  const mainMenuOption = <Avatar sx={{ width: 80, height: 80 }}>{sharedLabels.menu}</Avatar>;

  const showUserInfo = !isEmpty(userInfo);

  const menusMarkup = (
    <Grid item>
      { showUserInfo && (
      <HeaderMenu options={[{
        component: UserAccountOptions,
        props: { userInfo },
      }]}
      />
      )}
      {
        !showUserInfo && <HeaderMenu options={menuOptions} />
      }
      { withMenuComponent && <Menu options={menuOptions} buttonLabel={mainMenuOption} />}
    </Grid>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        height: '100%',
      }}
    >
      <Grid container sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography variant="h3" sx={{ width: '30%' }}>
            { sharedLabels.siteName }
          </Typography>
        </Grid>
        { renderNavigationLinks
        && (
        <Grid item>
          { menusMarkup }
        </Grid>
        )}
        { !renderNavigationLinks && menusMarkup }
      </Grid>
    </AppBar>
  );
}

Header.defaultProps = {
  userInfo: {},
  withMenuComponent: false,
  renderNavigationLinks: false,
  menuOptions: [],
};

Header.propTypes = {
  userInfo: PropTypes.shape(getUserInfoResponseShape),
  withMenuComponent: PropTypes.bool,
  menuOptions: PropTypes.array,
  renderNavigationLinks: PropTypes.bool,
};
