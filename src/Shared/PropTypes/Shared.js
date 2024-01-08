import PropTypes from 'prop-types';

export const routerShape = {
  location: PropTypes.any,
  navigate: PropTypes.func,
  params: PropTypes.any,
};
