/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import Toolbar from '@mui/material/Toolbar';

export default function Menu({ options }) {
  return (
    <Toolbar sx={{ alignSelf: 'flex-end' }}>
      <Paper>
        <MenuList>
          {
            options.map(({ component: Component, props }, i) => (
              <Component
                {...props}
                key={`menu_element_${i}`}
              />
            ))
          }
        </MenuList>
      </Paper>
    </Toolbar>
  );
}

Menu.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
};
