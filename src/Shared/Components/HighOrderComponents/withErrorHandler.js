import {
  useNavigate,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { routes } from '../../Constants';
import { errorMessages } from '../../../StaticData/Shared';
import { HttpClientFactory } from '../../../Infrastructure/HttpClientFactory';
import { removeOnLeavingTabHandlers } from '../../Hooks/useOnLeavingTabHandler';
import { LocalStorageService } from '../../../Infrastructure/Services/LocalStorageService';
import { resetUserInfo } from '../../../State/Actions/usuario';

const localStorageService = new LocalStorageService();

export default function withErrorHandler(Component) {
  function ComponentWithErrorHandler(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /**
     *
     * @param {{ data: Object, status: number}} error
     */
    const handleError = async (error) => {
      if (error.status === 401) {
        HttpClientFactory.cleanInstances();
        removeOnLeavingTabHandlers();
        Object.keys(LocalStorageService.PAGES_KEYS).forEach(
          (page) => localStorageService.removeAllKeysOfPage(page),
        );
        await dispatch(resetUserInfo());
        navigate(routes.signin, { state: { errorMessage: errorMessages.sessionExpired } });
      }
    };

    return <Component {...props} handleError={handleError} />;
  }

  return ComponentWithErrorHandler;
}
