import { createContext, useState } from 'react';
import { PropTypes } from 'prop-types';

const LocationMapContext = createContext({
  location: null,
  readableAddress: '',
});

/**
 *
 * This provider should be used along with LocationMap component, to track it´s data in a safe way
 * (mainly to avoid parent components trigger re renders)
 */
function LocationMapProvider({ children }) {
  const [location, setLocation] = useState();
  const [readableAddress, setReadableAddress] = useState('');

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    location, readableAddress, setLocation, setReadableAddress,
  };

  return (
    <LocationMapContext.Provider value={contextValue}>
      { children }
    </LocationMapContext.Provider>
  );
}

export { LocationMapProvider, LocationMapContext };

LocationMapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
