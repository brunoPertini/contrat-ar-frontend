import {
  useNavigate,
} from 'react-router-dom';
import { routes } from '../../Constants';
import { errorMessages } from '../../../StaticData/Shared';

export default function withErrorHandler(Component) {
  function ComponentWithErrorHandler(props) {
    const navigate = useNavigate();

    /**
     *
     * @param {{ data: Object, status: number}} error
     */
    const handleError = (error) => {
      if (error.status === 401) {
        navigate(routes.signin, { state: { errorMessage: errorMessages.sessionExpired } });
      }
    };

    return <Component {...props} handleError={handleError} />;
  }

  return ComponentWithErrorHandler;
}
