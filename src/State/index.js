/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import {
  combineReducers, legacy_createStore,
  Store, applyMiddleware, compose,
} from 'redux';
import { thunk } from 'redux-thunk';
import usuarioReducer from './Reducers/usuario';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// TODO: differentiate dev and prod
/**
 * @returns {Store}
 */
export const createStore = () => legacy_createStore(
  combineReducers({ usuario: usuarioReducer }),
  composeEnhancers(applyMiddleware(thunk)),
);
