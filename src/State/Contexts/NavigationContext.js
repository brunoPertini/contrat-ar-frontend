import PropTypes from 'prop-types';
import React, { createContext, useMemo, useState } from 'react';

const NavigationContext = createContext();

function NavigationContextProvider({ children }) {
  const [handleGoBack, setHandleGoBack] = useState();
  const [params, setParams] = useState([]);

  const contextValue = useMemo(() => ({
    handleGoBack,
    setHandleGoBack,
    params,
    setParams,
  }), [handleGoBack, params]);

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

NavigationContextProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export { NavigationContext, NavigationContextProvider };
