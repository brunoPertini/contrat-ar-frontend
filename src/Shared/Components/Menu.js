import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

export default function BasicMenu({ options, buttonLabel, styles }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ ...styles }}>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        { buttonLabel }
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {
          options.map((option, index) => {
            const { component: Component, props, onClick } = option;

            const onOptionClicked = () => {
              if (onClick) {
                handleClose();
                onClick();
              }
            };

            return (
              <MenuItem onClick={onOptionClicked} key={`menu_option${index}`} sx={{ cursor: 'default' }}>
                <Component {...props} />
              </MenuItem>
            );
          })
        }
      </Menu>
    </div>
  );
}

BasicMenu.defaultProps = {
  styles: {},
};

BasicMenu.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.any,
    props: PropTypes.any,
    onClick: PropTypes.func,
  })).isRequired,
  buttonLabel: PropTypes.any.isRequired,
  styles: PropTypes.object,
};
