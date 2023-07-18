/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';
import { Provider } from 'react-redux';
import SecurityService from '../../../Infrastructure/Services/SecurityService';
import CookiesService from '../../../Infrastructure/Services/CookiesService';
import { routes } from '../../Constants';
import { setUserInfo } from '../../../State/Actions/usuario';
import { createStore } from '../../../State';

const store = createStore();
const securityService = new SecurityService();
const cookiesService = new CookiesService();

export default function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const { location } = window;
    const navigate = useNavigate();
    const params = useParams();

    const isSecuredRoute = SecurityService.SECURED_PATHS.includes(location.pathname);

    // null = not verified; false = verification failed; true= verification passed
    const [tokenVerified, setTokenVerified] = useState(null);

    const shouldGoBack = useMemo(() => [SecurityService.LOGIN_PATH].includes(location.pathname)
    && !!(cookiesService.get('userToken')), [location.pathname]);

    const verifyToken = useCallback(async (token) => {
      try {
        const userInfo = await securityService.validateJwt(token);
        if (isEmpty(userInfo)) {
          navigate(routes.signin);
        } else {
          setTokenVerified(true);
          await store.dispatch(setUserInfo({ ...userInfo, token }));
        }
      } catch (error) {
        navigate(routes.signin);
      }
    }, [securityService]);

    const fetchAndSetUserInfo = useCallback(async (userToken) => {
      if (userToken) {
        const userInfo = await securityService.validateJwt(userToken);
        store.dispatch(setUserInfo({ ...userInfo, token: userToken }));
      }
    }, [securityService]);

    const handleOnBeforeUnload = () => {
      const { usuario: { token } } = store.getState();
      if (!cookiesService.get('userToken') && token) {
        cookiesService.add('userToken', token);
      }
      cookiesService.add('previousRoute', location.pathname);
    };

    useEffect(() => {
      if (shouldGoBack) {
        return navigate(cookiesService.get('previousRoute'));
      }
      const userToken = cookiesService.get('userToken');
      if (isSecuredRoute) {
        verifyToken(userToken);
      } else {
        fetchAndSetUserInfo(userToken);
      }

      cookiesService.remove('userToken');

      window.addEventListener('beforeunload', handleOnBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleOnBeforeUnload);
      };
    }, []);

    if (isSecuredRoute && tokenVerified === null) {
      return null;
    }

    if ((!shouldGoBack) && (!isSecuredRoute || (isSecuredRoute && tokenVerified))) {
      return (
        <Provider store={store}>
          <Component
            {...props}
            router={{ location, navigate, params }}
            securityService={securityService}
            cookiesService={cookiesService}
          />
        </Provider>
      );
    }

    return null;
  }

  return ComponentWithRouterProp;
}
