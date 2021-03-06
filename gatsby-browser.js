/* eslint-disable react/prop-types, import/no-extraneous-dependencies */
import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import FirebaseProvider from './src/containers/FirebaseProvider';
import createStore from './src/store/index'
import firebase from './src/services/firebase';
import theme from './src/constants/theme'

exports.replaceRouterComponent = ({ history }) => {
  const store = createStore()

  const ConnectedRouterWrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <FirebaseProvider firebase={firebase}>
          <Router history={history}>{children}</Router>
        </FirebaseProvider>
      </Provider>
    </ThemeProvider>
  );

  return ConnectedRouterWrapper;
};
