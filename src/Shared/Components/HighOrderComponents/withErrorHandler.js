import {
  useNavigate,
} from 'react-router-dom';
import { routes } from '../../Constants';

export default function withErrorHandler(Component) {
  function ComponentWithErrorHandler(props) {
    const navigate = useNavigate();

    /**
     *
     * @param {{ data: Object, status: number}} error
     */
    const handleError = (error) => {
      if (error.status === 401) {
        navigate(routes.signin);
      }
    };

    return <Component {...props} handleError={handleError} />;
  }

  return ComponentWithErrorHandler;
}
