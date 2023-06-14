import PropTypes from 'prop-types';
import { useState } from 'react';
import SignIn from '../SignIn';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { withRouter } from '../../Shared/Components';
import { routes } from '../../Shared/Constants';

function SignInContainer({ router }) {
  const [hasError, setHasError] = useState(false);

  const dispatchSignIn = (params) => {
    const httpClient = HttpClientFactory.createUserHttpClient();
    return httpClient.login(params).then(() => {
      router.navigate(routes.index);
    }).catch(() => {
      setHasError(true);
    });
  };

  return <SignIn dispatchSignIn={dispatchSignIn} hasError={hasError} />;
}

SignInContainer.propTypes = {
  router: PropTypes.any.isRequired,
};

export default withRouter(SignInContainer);
