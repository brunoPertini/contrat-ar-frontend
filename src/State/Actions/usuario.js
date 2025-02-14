import pick from 'lodash/pick';
import * as actionTypes from '../ActionTypes/usuario';
import { userState as userModel } from '../Reducers/usuario';
import CookiesService from '../../Infrastructure/Services/CookiesService';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { systemConstants } from '../../Shared/Constants';
import { ROLE_ADMIN } from '../../Shared/Constants/System';

export function setUserInfo(userInfo) {
  return (dispatch) => {
    const keysToPick = Object.keys(userModel);
    const sanitizedUserInfo = pick(userInfo, keysToPick);
    if (userInfo.authorities && userInfo.authorities[0] !== ROLE_ADMIN) {
      sanitizedUserInfo.email = userInfo.sub;
    }
    sanitizedUserInfo.role = userInfo.role.nombre;
    dispatch({ type: actionTypes.SET_USER_INFO, payload: sanitizedUserInfo });
  };
}

export const replaceUserInfo = (newUserInfo) => (dispatch) => {
  dispatch({
    type: actionTypes.SET_USER_INFO,
    payload: newUserInfo,
  });
};

export const resetUserInfo = () => (dispatch, getState) => {
  const { role } = getState().usuario;
  const cookiesService = new CookiesService();
  cookiesService.remove(CookiesService.COOKIES_NAMES.USER_INDEX_PAGE);
  cookiesService.remove(CookiesService.COOKIES_NAMES.USER_TOKEN);
  if (role.startsWith(systemConstants.PROVEEDOR)) {
    const localStorageService = new LocalStorageService();
    localStorageService.removeAllKeysOfPage(systemConstants.PROVEEDOR);
  }
  dispatch({ type: actionTypes.RESET_USER_INFO });
};
