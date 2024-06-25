/* eslint-disable no-restricted-globals */
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';
import { Provider } from 'react-redux';
import SecurityService from '../../../Infrastructure/Services/SecurityService';
import CookiesService from '../../../Infrastructure/Services/CookiesService';
import { routes } from '../../Constants';
import { resetUserInfo, setUserInfo } from '../../../State/Actions/usuario';
import { createStore } from '../../../State';
import { removeOnLeavingTabHandlers } from '../../Hooks/useOnLeavingTabHandler';
import { HttpClientFactory } from '../../../Infrastructure/HttpClientFactory';
import { ROLE_ADMIN } from '../../Constants/System';
import { LocalStorageService } from '../../../Infrastructure/Services/LocalStorageService';

const store = createStore();
const securityService = new SecurityService();
const cookiesService = new CookiesService();
const localStorageService = new LocalStorageService();

/**
 *
 * This component acts as the router of the system. In addition to provide the router
 * object to the underlying components, it also checks the security constraints of each
 * route and redirects to signin page if they're not fulfilled. Also, it's in charge
 * of keeping the user token safe and sound between routes changes. Finally, it sets
 * redux store and pass it to the Provider so it's available for the other components.
 */
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
        const userToken = cookiesService.get(CookiesService.COOKIES_NAMES.USER_TOKEN);
        let userInfo = await securityService.validateJwt(userToken);
        if (isEmpty(userInfo)) {
          setTokenVerified(false);
          await store.dispatch(resetUserInfo());
          navigate(routes.signin);
        } else {
          if (userInfo.role.nombre === ROLE_ADMIN) {
            userInfo = {
              ...userInfo,
              ...JSON.parse(localStorageService.getItem(
                LocalStorageService.PAGES_KEYS.ADMIN.USER_INFO,
              )),
            };
          }
          cookiesService.add(CookiesService.COOKIES_NAMES.USER_INDEX_PAGE, userInfo.indexPage);
          setTokenVerified(true);
          await store.dispatch(setUserInfo({ ...userInfo, token: userToken }));
          cookiesService.remove(CookiesService.COOKIES_NAMES.USER_TOKEN);
        }
      } catch (error) {
        setTokenVerified(false);
        await store.dispatch(resetUserInfo());
        navigate(routes.signin);
      }
    }, [securityService]);

    /**
     * This is to manage user's browser events (back and forward)
     */
    const handleOnBeforeUnload = () => {
      const { usuario: { token } } = store.getState();
      if (!cookiesService.get(CookiesService.COOKIES_NAMES.USER_TOKEN) && token) {
        cookiesService.add(CookiesService.COOKIES_NAMES.USER_TOKEN, token);
      }
    };

    const handleOnDuplicateTab = () => {
      if (document.hidden) {
        handleOnBeforeUnload();
      }
    };

    /** This cleans site's info such as localStorage, cookies, etc and performs log out */
    const handleLogout = async () => {
      HttpClientFactory.cleanInstances();
      navigate(routes.signin);
      removeOnLeavingTabHandlers();
      Object.keys(LocalStorageService.PAGES_KEYS).forEach(
        (page) => localStorageService.removeAllKeysOfPage(page),
      );
      await store.dispatch(resetUserInfo());
    };

    /**
     * This is to handle when the url is replaced in the browser
     */
    useEffect(() => {
      if (isSecuredRoute) {
        verifyToken();
      }

      window.addEventListener('beforeunload', handleOnBeforeUnload);

      window.addEventListener('visibilitychange', handleOnDuplicateTab);

      return () => {
        handleOnBeforeUnload();
        removeOnLeavingTabHandlers();
        window.removeEventListener('visibilitychange', handleOnDuplicateTab);
      };
    }, []);

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
            handleLogout={handleLogout}
          />
        </Provider>
      );
    }

    return null;
  }

  return ComponentWithRouterProp;
}
