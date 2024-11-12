import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { EMPTY_FUNCTION } from '../Constants/System';

export default function BasicMenu({
  options, buttonLabel, styles, itemsStyles, onClose, showButtonIcon, slotProps,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onClose();
  };

  return (
    <div style={{ ...styles }}>
      {
        showButtonIcon ? (
          <IconButton
            aria-label="abrir menu"
            id="menu-button"
            aria-controls={open ? 'menu-button' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Button
            id="menu-buttom"
            aria-controls={open ? 'menu-button' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            { buttonLabel }
          </Button>
        )
      }

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        variant="menu"
        slotProps={slotProps}
      >
        {
          options.map((option, index) => {
            const {
              component: Component, props, onClick, label,
            } = option;

            // If component is undefined, means that option itself is a rendered one
            if (!Component) {
              return option;
            }

            const onOptionClicked = () => {
              if (onClick) {
                handleClose();
                onClick();
              }
            };

            return (
              <MenuItem
                disableRipple
                onClick={onOptionClicked}
                key={`menu_option${index}`}
                sx={{
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                  ...itemsStyles,
                }}
              >
                {label ? (
                  <FormControlLabel
                    control={<Component {...props} />}
                    label={label}
                  />
                ) : <Component {...props} />}

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
  itemsStyles: {},
  slotProps: {},
  onClose: EMPTY_FUNCTION,
  showButtonIcon: false,
};

BasicMenu.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.any,
    props: PropTypes.any,
    onClick: PropTypes.func,
  })).isRequired,
  buttonLabel: PropTypes.any.isRequired,
  styles: PropTypes.object,
  itemsStyles: PropTypes.object,
  slotProps: PropTypes.object,
  onClose: PropTypes.func,
  showButtonIcon: PropTypes.bool,
};
