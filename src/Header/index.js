import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, Box, Toolbar, Button, IconButton, Typography,
} from '@mui/material';
import { sharedLabels } from '../StaticData/Shared';
import Menu from '../Shared/Components/Menu';

function HeaderMenu({ options }) {
  return (
    <Toolbar sx={{ justifyContent: 'right' }}>
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

export default function Header({ withMenu, menuOptions, withMenuComponent }) {
  return (
    <>
      <Box sx={{ flexGrow: 1 }} />
      <AppBar position="static">
        <Typography variant="h3">
          { sharedLabels.siteName }
        </Typography>
        { withMenu && <HeaderMenu options={menuOptions} />}
        { withMenuComponent && <Menu options={menuOptions} />}
      </AppBar>
    </>
  );
}

Header.defaultProps = {
  withMenu: false,
  withMenuComponent: false,
  menuOptions: [],
};

Header.propTypes = {
  withMenu: PropTypes.bool,
  withMenuComponent: PropTypes.bool,
  menuOptions: PropTypes.array,
};
