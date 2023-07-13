/* eslint-disable no-underscore-dangle */
import { combineReducers, legacy_createStore as createStore } from 'redux';
import usuarioReducer from './Reducers/usuario';

export const store = createStore(
  combineReducers({ usuario: usuarioReducer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
