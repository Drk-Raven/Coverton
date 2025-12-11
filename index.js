/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureRedux from './src/Redux'
const { store } = configureRedux()

const AppProvider = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

if (__DEV__) {
  require('./ReactotronConfig');
}

AppRegistry.registerComponent(appName, () => AppProvider);
