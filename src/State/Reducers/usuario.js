import { RESET_USER_INFO, SET_USER_INFO } from '../ActionTypes/usuario';

/**
 * @typedef UsuarioModel
 * @property {Number} id
 * @property {String} name
 * @property {String} surname
 * @property {String} email
 * @property {String} birthDate
 * @property {{ coordinates: Number[]}} location
 * @property {String} role
 * @property {String} token
 * @property {String} indexPage,
 * @property {String} phone,
 * @property {String} password
 * @property {String} plan
 * @property {String} dni
 * @property {String} fotoPerfilUrl
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
  location: {},
  role: '',
  token: '',
  indexPage: '',
  phone: '',
  password: '',
  plan: '',
  dni: '',
  fotoPerfilUrl: '',
  admin: {
  },
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
