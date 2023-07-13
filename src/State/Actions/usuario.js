import * as actionTypes from '../ActionTypes/usuario';

export function setUserInfo(userInfo) {
  userInfo.email = userInfo.sub;
  delete userInfo.sub;
  return { type: actionTypes.SET_USER_INFO, payload: userInfo };
}
