import 'react-native-gesture-handler';
// for easy-peasy https://easy-peasy.now.sh/docs/introduction/browser-support.html#configuring-immer-to-support-es5
import 'easy-peasy/proxy-polyfill';

// Polyfilling intl for Currency Intl.NumberFormat
// hermes doesn't yet have intl support. https://github.com/facebook/hermes/issues/23
import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/id';
import 'intl/locale-data/jsonp/ja';
import 'intl/locale-data/jsonp/zh';

import { AppRegistry, LogBox } from 'react-native';

import App from './App.tsx';
import { name as appName } from './app.json';

LogBox.ignoreLogs([/plurals/i, /eventemitter/i, 'Require cycle:', 'NativeEventEmitter']);

AppRegistry.registerComponent(appName, () => App);
