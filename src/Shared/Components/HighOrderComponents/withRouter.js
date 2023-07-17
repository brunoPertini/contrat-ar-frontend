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
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const isSecuredRoute = SecurityService.SECURED_PATHS.includes(location.pathname);
    const routeHasChanged = useMemo(() => !!cookiesService.get('previousRoute') && location.pathname !== cookiesService.get('previousRoute'), [location]);

    const [tokenVerified, setTokenVerified] = useState(false);

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
    };

    useEffect(() => {
      const previousRoute = cookiesService.get('previousRoute');
      const pathChanged = previousRoute && location.pathname !== previousRoute;
      const userToken = cookiesService.get('userToken');
      if (pathChanged && isSecuredRoute) {
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

    useEffect(() => {
      cookiesService.add('previousRoute', location.pathname);
    }, [location.pathname]);

    if (!isSecuredRoute
       || !(routeHasChanged)
        || (isSecuredRoute && tokenVerified)) {
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
