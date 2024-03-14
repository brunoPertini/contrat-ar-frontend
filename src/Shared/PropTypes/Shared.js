import PropTypes from 'prop-types';

export const routerShape = {
  location: PropTypes.any,
  navigate: PropTypes.func,
  params: PropTypes.any,
};

export const locationShape = PropTypes.shape({
  coords: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
});
