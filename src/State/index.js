/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { combineReducers, legacy_createStore } from 'redux';
import usuarioReducer from './Reducers/usuario';

// TODO: diferenciar dev de prod
/**
 * @type { import('redux').Store}
 */
export const createStore = () => legacy_createStore(
  combineReducers({ usuario: usuarioReducer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true }),
);
