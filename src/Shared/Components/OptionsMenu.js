import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * Menu that shows options related to a vendible, specified
 *  by vendibleName prop
 */
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
          <MenuItem
            key={`option_menu_${option}`}
            onClick={handleClose}
            disableRipple
          >
            {option}
          </MenuItem>
        ))
      }
      </Menu>
    </div>
  );
}

OptionsMenu.defaultProps = {
  vendibleName: null,
};

OptionsMenu.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOptionClicked: PropTypes.func.isRequired,
  vendibleName: PropTypes.string,
};
