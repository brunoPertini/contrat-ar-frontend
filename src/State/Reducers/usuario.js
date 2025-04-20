import { CLIENTE } from '../../Shared/Constants/System';
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
 * @property {Boolean} active
 * @property {Boolean} is2FaValid
 * @property {Boolean} hasWhatsapp
 * @property{{ usuarioId: Number, planId: Number, createdDate: String, active: Boolean}} suscripcion
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
  dni: '',
  fotoPerfilUrl: '',
  active: false,
  is2FaValid: false,
  suscripcion: {},
  hasWhatsapp: false,
};

function usuarioReducer(state = userState, action) {
  switch (action.type) {
    case SET_USER_INFO:
      if (action.payload.role === CLIENTE) {
        delete state.dni;
        delete state.fotoPerfilUrl;
        delete state.suscripcion;
        delete state.hasWhatsapp;
      }
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
