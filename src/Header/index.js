/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, Box, Toolbar, Button, IconButton, Typography, Link, Grid,
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

export default function Header({
  withMenu,
  menuOptions, withMenuComponent, renderNavigationLinks,
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <AppBar
        position="sticky"
        sx={{
          height: '100%',
        }}
      >
        <Typography variant="h3" sx={{ width: '30%' }}>
          { sharedLabels.siteName }
        </Typography>
        {
          renderNavigationLinks && (
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item>
                <Link
                  variant="h5"
                  onClick={() => {}}
                  color="#fff"
                  sx={{ width: '30%' }}
                >
                  Volver
                </Link>
              </Grid>
              <Grid item>
                { withMenu && <HeaderMenu options={menuOptions} />}
                { withMenuComponent && <Menu options={menuOptions} />}
              </Grid>
            </Grid>
          )
        }
      </AppBar>
    </Box>
  );
}

Header.defaultProps = {
  withMenu: false,
  withMenuComponent: false,
  renderNavigationLinks: false,
  menuOptions: [],
};

Header.propTypes = {
  withMenu: PropTypes.bool,
  withMenuComponent: PropTypes.bool,
  menuOptions: PropTypes.array,
  renderNavigationLinks: PropTypes.bool,
};
