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

    const isSecuredRoute = useMemo(
      () => SecurityService.SECURED_PATHS.includes(location.pathname),
      [location.pathname],
    );

    // null = not verified; false = verification failed; true= verification passed
    const [tokenVerified, setTokenVerified] = useState(null);

    const verifyToken = useCallback(async () => {
      try {
        const userToken = cookiesService.get('userToken');
        const userInfo = await securityService.validateJwt(userToken);
        if (isEmpty(userInfo)) {
          navigate(routes.signin);
        } else {
          setTokenVerified(true);
          await store.dispatch(setUserInfo({ ...userInfo, token: userToken }));
          cookiesService.remove('userToken');
        }
      } catch (error) {
        navigate(routes.signin);
      }
    }, [securityService]);

    const fetchAndSetUserInfo = useCallback(async () => {
      const userToken = cookiesService.get('userToken');
      if (userToken) {
        const userInfo = await securityService.validateJwt(userToken);
        store.dispatch(setUserInfo({ ...userInfo, token: userToken }));
        cookiesService.remove('userToken');
      }
    }, [securityService]);

    const handleOnBeforeUnload = (event) => {
      console.log(event);
      const { usuario: { token } } = store.getState();
      if (!cookiesService.get('userToken') && token) {
        cookiesService.add('userToken', token);
      }

      const shouldGoBack = [SecurityService.LOGIN_PATH, '/'].includes(location.pathname)
      && !!(cookiesService.get('userToken'));

      if (shouldGoBack) {
        navigate(routes.ROLE_CLIENTE);
      }
    };

    useEffect(() => {
      const shouldGoBack = [SecurityService.LOGIN_PATH, '/'].includes(location.pathname)
      && !!(cookiesService.get('userToken'));

      if (shouldGoBack) {
        return navigate(routes.ROLE_CLIENTE);
      }

      if (isSecuredRoute) {
        verifyToken();
      } else {
        fetchAndSetUserInfo();
      }

      window.addEventListener('beforeunload', handleOnBeforeUnload);

      return () => {
        handleOnBeforeUnload();
      };
    }, []);

    console.log('cookie token: ', cookiesService.get('userToken'));

    if (isSecuredRoute && tokenVerified === null) {
      return null;
    }

    if ((!isSecuredRoute || (isSecuredRoute && tokenVerified))) {
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
