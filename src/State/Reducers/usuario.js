import { SET_USER_INFO } from '../ActionTypes/usuario';

/**
 * @typedef UsuarioModel
 * @property {String} name
 * @property {String} surname
 * @property {String} email
 * @property {String} birthDate
 * @property {Number[]} location
 * @property {String} role
 * @property {String} token
 */

/**
 * @type {UsuarioModel} person
 */
export const userState = {
  name: '',
  surname: '',
  email: '',
  birthDate: '',
  location: [],
  role: '',
  token: '',
};

function usuarioReducer(state = userState, action) {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default usuarioReducer;
