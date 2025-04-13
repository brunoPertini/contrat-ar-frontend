import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import isEmpty from 'lodash/isEmpty';
import Box from '@mui/material/Box';
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
        const { label, onClick } = option;
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
  const mainMenuOption = (
    <Avatar sx={{
      width: 80,
      height: 80,
      backgroundColor: '#f5c242',
    }}
    >
      {sharedLabels.menu}
    </Avatar>
  );
  const showUserInfo = !isEmpty(userInfo);

  const menusMarkup = (
    <Box display="flex" alignItems="center">
      { showUserInfo && (
        <HeaderMenu options={[{
          component: UserAccountOptions,
          props: { userInfo, handleLogout },
        }]}
        />
      )}
      { withMenuComponent && <Menu options={menuOptions} buttonLabel={mainMenuOption} />}
      { !showUserInfo && <HeaderMenu options={menuOptions} />}
    </Box>
  );

  const goToIndex = () => {
    window.location.href = '/';
  };

  return (
    <AppBar position="sticky">
      <Box
        display="flex"
        flexDirection={{
          xs: 'column',
          sm: 'row',
          md: 'row',
          lg: 'row',
        }}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          top: 0,
          zIndex: 1100,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={`${process.env.REACT_APP_CDN_URL}/header/logo-6.png`}
          onClick={goToIndex}
          alt="Logo"
          sx={{
            padding: 0,
            margin: 0,
            height: 120,
            width: 'auto',
            cursor: 'pointer',
          }}
        />
        {renderNavigationLinks && <Box>{menusMarkup}</Box>}
        {!renderNavigationLinks && menusMarkup}
      </Box>
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
