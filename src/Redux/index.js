// src/Redux/index.js
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { reducer as BusinessOpportunitiesReducer } from './BusinessOpportunitiesRedux';
import { reducer as CustomerReducer } from './CustomerRedux';
import { reducer as AuthReducer } from './AuthRedux';
import { reducer as QuotationReducer } from './QuotationRedux';
import { reducer as PolicyReducer } from './PolicyRedux';


import rootSaga from '../Saga';

const reducers = combineReducers({
  businessOpportunities: BusinessOpportunitiesReducer,
  customer: CustomerReducer,
  auth: AuthReducer,
  quotation: QuotationReducer,
  policy: PolicyReducer,
});

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

export default () => {
  const store = configureStore(reducers, rootSaga);
  return { store, persistor: null };
};
