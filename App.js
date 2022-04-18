import React from 'react';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(); //Ignore all log notifications

import Providers from './src/navigation';

export default function App() {
  return <Providers />;
}
