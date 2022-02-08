import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import AccountAuthContextProvider from '../contexts/AccountAuthContext';
import VoiceAuthContextProvider from '../contexts/VoiceAuthContext';
import MessageContextProvider from '../contexts/MessageContext';
import ThemeContextProvider from '../contexts/ThemeContext';
import Routes from './Routes';

export default function Providers() {
  return (
      <PaperProvider theme={theme}>
        <AccountAuthContextProvider>
          <VoiceAuthContextProvider>
            <MessageContextProvider>
              <ThemeContextProvider>
                <Routes />
              </ThemeContextProvider>
            </MessageContextProvider>
          </VoiceAuthContextProvider>
        </AccountAuthContextProvider>
      </PaperProvider>
  );
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5b3a70',
    accent: '#50c878',
    background: '#f7f9fb',
  },
};
