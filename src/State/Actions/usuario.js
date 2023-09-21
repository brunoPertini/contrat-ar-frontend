import pick from 'lodash/pick';
import * as actionTypes from '../ActionTypes/usuario';
import { userState as userModel } from '../Reducers/usuario';

export function setUserInfo(userInfo) {
  const keysToPick = Object.keys(userModel);
  const sanitizedUserInfo = pick(userInfo, keysToPick);
  sanitizedUserInfo.email = userInfo.sub;
  return { type: actionTypes.SET_USER_INFO, payload: sanitizedUserInfo };
}

export function resetUserInfo() {
  return { type: actionTypes.RESET_USER_INFO };
}
