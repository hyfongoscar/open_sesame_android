import React from 'react';

import Providers from './src/navigation';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function App() {
  return <Providers />;
}
