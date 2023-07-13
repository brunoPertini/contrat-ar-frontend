import { useEffect, useState } from 'react';
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
import { store } from '../../../State';

export default function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const shouldVerifyToken = SecurityService.SECURED_PATHS.includes(location.pathname);

    const [tokenVerified, setTokenVerified] = useState(false);

    const securityService = new SecurityService();
    const cookiesService = new CookiesService();

    const verifyToken = async (token) => {
      await securityService.loadPublicKey();
      try {
        const userInfo = await securityService.validateJwt(token);
        if (isEmpty(userInfo)) {
          navigate(routes.signin);
        } else {
          setTokenVerified(true);
          cookiesService.remove('userToken');
          store.dispatch(setUserInfo({ ...userInfo, token }));
        }
      } catch (error) {
        navigate(routes.signin);
      }
    };

    useEffect(() => () => {
      console.log('CAMBIANDO RUTA');
    }, []);

    useEffect(() => {
      console.log('CAMBIO ruta');
      if (shouldVerifyToken) {
        const userToken = cookiesService.get('userToken');
        verifyToken(userToken);
      }
    }, [location]);

    if (!shouldVerifyToken || (shouldVerifyToken && tokenVerified)) {
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
