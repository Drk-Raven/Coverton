/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureRedux from './src/Redux'
const { store, persistor } = configureRedux()

const AppProvider = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

if (__DEV__) {
  require('./ReactotronConfig');
}

AppRegistry.registerComponent(appName, () => AppProvider);

