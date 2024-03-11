import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import { Menu } from '@mui/material';

export default function OptionsMenu({
  options, title, onOptionClicked, vendibleName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(!isOpen);
  };

  const handleClose = (event) => {
    setIsOpen(false);
    setAnchorEl(null);
    onOptionClicked(event.target.textContent, vendibleName);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={isOpen ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        { title }
      </Button>
      <Menu
        elevation={0}
        open={isOpen}
        onClose={handleClose}
        anchorEl={anchorEl}
      >
        {
        options.map((option) => (
          <MenuItem onClick={handleClose} disableRipple>
            {option}
          </MenuItem>
        ))
      }
      </Menu>
    </div>
  );
}

OptionsMenu.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOptionClicked: PropTypes.func.isRequired,
  vendibleName: PropTypes.string.isRequired,
};
