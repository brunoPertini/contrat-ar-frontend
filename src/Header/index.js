import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import isEmpty from 'lodash/isEmpty';
import Link from '@mui/material/Link';
import { sharedLabels } from '../StaticData/Shared';
import Menu from '../Shared/Components/Menu';
import { UserAccountOptions } from '../Shared/Components';
import { getUserInfoResponseShape } from '../Shared/PropTypes/Vendibles';
import { EMPTY_FUNCTION } from '../Shared/Constants/System';

function HeaderMenu({ options }) {
  const isNonComponentMenu = !!(options[0]?.label);
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
      isNonComponentMenu && options.map((option, index) => {
        const {
          label, onClick,
        } = option;
        return (
          <Button
            color="inherit"
            onClick={onClick}
            key={`menu-${index}`}
          >
            {label}
          </Button>
        );
      })
     }
      {
      !isNonComponentMenu && options.map((option, index) => {
        const { component: Component, props } = option;

        return <Component key={`header-menu-${index}`} {...props} />;
      })
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
  userInfo, menuOptions, withMenuComponent, renderNavigationLinks, handleLogout,
}) {
  const mainMenuOption = <Avatar sx={{ width: 80, height: 80 }}>{sharedLabels.menu}</Avatar>;

  const showUserInfo = !isEmpty(userInfo);

  const menusMarkup = (
    <Grid item display="flex">
      { showUserInfo && (
      <HeaderMenu options={[{
        component: UserAccountOptions,
        props: { userInfo, handleLogout },
      }]}
      />
      )}
      { withMenuComponent && <Menu options={menuOptions} buttonLabel={mainMenuOption} />}
      {!showUserInfo && <HeaderMenu options={menuOptions} /> }
    </Grid>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        height: '10%',
      }}
    >
      <Grid container sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Link
            variant="h3"
            sx={{ width: '30%', color: 'white', cursor: 'pointer' }}
            href="/"
          >

            { sharedLabels.siteName }
          </Link>
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
  handleLogout: EMPTY_FUNCTION,
};

Header.propTypes = {
  handleLogout: PropTypes.func,
  userInfo: PropTypes.shape(getUserInfoResponseShape),
  withMenuComponent: PropTypes.bool,
  menuOptions: PropTypes.array,
  renderNavigationLinks: PropTypes.bool,
};
