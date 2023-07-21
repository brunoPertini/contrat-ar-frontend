/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { combineReducers, legacy_createStore, Store } from 'redux';
import usuarioReducer from './Reducers/usuario';

// TODO: differentiate dev and prod
/**
 * @returns {Store}
 */
export const createStore = () => legacy_createStore(
  combineReducers({ usuario: usuarioReducer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true }),
);
