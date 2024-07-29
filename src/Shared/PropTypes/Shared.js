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

export const paginationShape = PropTypes.shape({
  sort: PropTypes.shape({
    sorted: PropTypes.bool,
    unsorted: PropTypes.bool,
    empty: PropTypes.bool,
  }),
  pageable: PropTypes.shape({
    sort: {
      sorted: PropTypes.bool,
      unsorted: PropTypes.bool,
      empty: PropTypes.bool,
    },
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    offset: PropTypes.number,
    paged: PropTypes.bool,
    unpaged: PropTypes.bool,
  }),
  totalPages: PropTypes.number,
  totalElements: PropTypes.number,
  last: PropTypes.bool,
  first: PropTypes.bool,
  size: PropTypes.number,
  number: PropTypes.number,
  numberOfElements: PropTypes.number,
  empty: PropTypes.bool,
});
