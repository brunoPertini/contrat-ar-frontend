import PropTypes from 'prop-types';
import { useState } from 'react';
import SignIn from '../SignIn';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { withRouter } from '../../Shared/Components';
import SecurityService from '../../Infrastructure/Services/SecurityService';
import CookiesService from '../../Infrastructure/Services/CookiesService';

function SignInContainer({ router, securityService, cookiesService }) {
  const [errorMessage, setErrorMessage] = useState('');

  const dispatchSignIn = (params) => {
    const httpClient = HttpClientFactory.createUserHttpClient();
    return httpClient.login(params).then(async (response) => {
      const userInfo = await securityService.validateJwt(response);
      if (userInfo.indexPage) {
        cookiesService.add(CookiesService.COOKIES_NAMES.USER_TOKEN, response);
        router.navigate(userInfo.indexPage);
      }
    }).catch((error) => {
      setErrorMessage(error);
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
