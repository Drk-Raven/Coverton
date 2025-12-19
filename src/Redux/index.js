// src/Redux/index.js
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Immutable from 'seamless-immutable';

import { reducer as BusinessOpportunitiesReducer } from './BusinessOpportunitiesRedux';
import { reducer as CustomerReducer } from './CustomerRedux';
import { reducer as AuthReducer, INITIAL_STATE as AuthInitialState } from './AuthRedux';
import { reducer as QuotationReducer } from './QuotationRedux';
import { reducer as PolicyReducer } from './PolicyRedux';


import rootSaga from '../Saga';

// Transform to handle seamless-immutable with redux-persist
const seamlessImmutableTransform = createTransform(
  // Transform state before it gets serialized and persisted
  (inboundState) => {
    // Convert Immutable to plain JS for storage
    return Immutable.isImmutable(inboundState)
      ? Immutable.asMutable(inboundState, { deep: true })
      : inboundState;
  },
  // Transform state being rehydrated
  (outboundState) => {
    // Convert plain JS back to Immutable when loading
    return Immutable(outboundState);
  },
  // Only apply to auth reducer
  { whitelist: ['auth'] }
);

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth reducer
  transforms: [seamlessImmutableTransform],
};

const reducers = combineReducers({
  businessOpportunities: BusinessOpportunitiesReducer,
  customer: CustomerReducer,
  auth: AuthReducer,
  quotation: QuotationReducer,
  policy: PolicyReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const configureStore = (rootReducer, rootSaga) => {
  const sagaMiddleware = createSagaMiddleware();

  const composeEnhancers =
    (typeof window !== 'undefined' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

  const store = createStore(rootReducer, enhancer);

  sagaMiddleware.run(rootSaga);

  return store;
};

// Create store instance (Singleton)
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

export const store = createStore(persistedReducer, enhancer);
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default () => {
  return { store, persistor };
};

