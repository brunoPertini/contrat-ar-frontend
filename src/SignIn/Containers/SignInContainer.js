import PropTypes from 'prop-types';
import { useState } from 'react';
import SignIn from '../SignIn';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { withRouter } from '../../Shared/Components';
import SecurityService from '../../Infrastructure/Services/SecurityService';

function SignInContainer({ router }) {
  const [errorMessage, setErrorMessage] = useState('');

  const dispatchSignIn = (params) => {
    const httpClient = HttpClientFactory.createUserHttpClient();
    return httpClient.login(params).then(async (response) => {
      const securityService = new SecurityService();
      await securityService.loadPublicKey();
      const userInfo = await securityService.validateJwt(response);
      if (userInfo.indexPage) {
        router.navigate(userInfo.indexPage);
      }
    }).catch((error) => {
      setErrorMessage(error.message);
    });
  };

  return <SignIn dispatchSignIn={dispatchSignIn} errorMessage={errorMessage} />;
}

SignInContainer.propTypes = {
  router: PropTypes.any.isRequired,
};

export default withRouter(SignInContainer);
