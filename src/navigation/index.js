import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import AccountAuthContextProvider from '../contexts/AccountAuthContext';
import VoiceAuthContextProvider from '../contexts/VoiceAuthContext';
import MessageContextProvider from '../contexts/MessageContext';
import ThemeContextProvider from '../contexts/ThemeContext';
import LoadingContextProvider from '../contexts/LoadingContext';
import Routes from './Routes';

export default function Providers() {
  return (
      <PaperProvider theme={theme}>
        <LoadingContextProvider>
          <AccountAuthContextProvider>
            <ThemeContextProvider>
              <VoiceAuthContextProvider>
                <MessageContextProvider>
                    <Routes />
                </MessageContextProvider>
              </VoiceAuthContextProvider>
            </ThemeContextProvider>
          </AccountAuthContextProvider>
        </LoadingContextProvider>
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
