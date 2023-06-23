import PropTypes from 'prop-types';
import { useState } from 'react';
import SignIn from '../SignIn';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { withRouter } from '../../Shared/Components';
import { routes } from '../../Shared/Constants';

function SignInContainer({ router }) {
  const [errorMessage, setErrorMessage] = useState('');

  const dispatchSignIn = (params) => {
    const httpClient = HttpClientFactory.createUserHttpClient();
    return httpClient.login(params).then(() => {
      router.navigate(routes.index);
    }).catch((message) => {
      setErrorMessage(message);
    });
  };

  return <SignIn dispatchSignIn={dispatchSignIn} errorMessage={errorMessage} />;
}

SignInContainer.propTypes = {
  router: PropTypes.any.isRequired,
};

export default withRouter(SignInContainer);
