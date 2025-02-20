import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SignIn from '../SignIn';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { withRouter } from '../../Shared/Components';
import SecurityService from '../../Infrastructure/Services/SecurityService';
import CookiesService from '../../Infrastructure/Services/CookiesService';

function SignInContainer({ router, securityService, cookiesService }) {
  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();

  useEffect(() => {
    if (location?.state) {
      const { errorMessage: navigationErrorMessage } = location.state;
      setErrorMessage(navigationErrorMessage);
    }
  }, []);

  const dispatchSignIn = (params) => {
    const httpClient = HttpClientFactory.createUserHttpClient();
    return httpClient.login(params).then(async (response) => {
      const userInfo = await securityService.validateJwt(response);
      if (userInfo.indexPage) {
        cookiesService.add(CookiesService.COOKIES_NAMES.USER_TOKEN, response);
        router.navigate(userInfo.indexPage);
      }
    }).catch(({ error }) => {
      // error is 401
      if (!error.status) {
        setErrorMessage(error);
      } else {
        // error is 403 but may be because unverified email
        setErrorMessage(error.message);
      }
    });
  };

  return <SignIn dispatchSignIn={dispatchSignIn} errorMessage={errorMessage} />;
}

SignInContainer.propTypes = {
  router: PropTypes.any.isRequired,
  securityService: PropTypes.instanceOf(SecurityService).isRequired,
  cookiesService: PropTypes.instanceOf(CookiesService).isRequired,
};

export default withRouter(SignInContainer);
