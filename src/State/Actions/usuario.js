import pick from 'lodash/pick';
import * as actionTypes from '../ActionTypes/usuario';
import { userState as userModel } from '../Reducers/usuario';
import CookiesService from '../../Infrastructure/Services/CookiesService';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { systemConstants } from '../../Shared/Constants';

export function setUserInfo(userInfo) {
  return (dispatch, getState) => {
    const { usuario } = getState();
    if (!usuario.id) {
      const keysToPick = Object.keys(userModel);
      const sanitizedUserInfo = pick(userInfo, keysToPick);
      sanitizedUserInfo.email = userInfo.sub;
      dispatch({ type: actionTypes.SET_USER_INFO, payload: sanitizedUserInfo });
    }
  };
}

export const resetUserInfo = () => (dispatch, getState) => {
  const { role } = getState().usuario;
  const cookiesService = new CookiesService();
  cookiesService.remove(CookiesService.COOKIES_NAMES.USER_INDEX_PAGE);
  if (role.startsWith(systemConstants.PROVEEDOR)) {
    const localStorageService = new LocalStorageService();
    localStorageService.removeAllKeysOfPage(systemConstants.PROVEEDOR);
  }
  dispatch({ type: actionTypes.RESET_USER_INFO });
};
