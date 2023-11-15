import { RESET_USER_INFO, SET_USER_INFO } from '../ActionTypes/usuario';

/**
 * @typedef UsuarioModel
 * @property {String} name
 * @property {String} surname
 * @property {String} email
 * @property {String} birthDate
 * @property {Number[]} location
 * @property {String} role
 * @property {String} token
 * @property {String} indexPage
 */

/**
 * @type {UsuarioModel} person
 */
export const userState = {
  id: null,
  name: '',
  surname: '',
  email: '',
  birthDate: '',
  location: [],
  role: '',
  token: '',
  indexPage: '',
};

function usuarioReducer(state = userState, action) {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        ...action.payload,
      };
    case RESET_USER_INFO:
      return userState;
    default:
      return state;
  }
}

export default usuarioReducer;
