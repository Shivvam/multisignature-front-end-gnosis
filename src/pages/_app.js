import '../styles/globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import React from "react";
import NextApp from "next/app";
import withReduxStore from '../lib/with-redux-store'
import { Provider } from 'react-redux'
import Layout from '../Layout/layout'


class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { 
      pageProps, 
    };
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Provider store={reduxStore}>
        <Layout>
            <Component {...pageProps} />
        </Layout>
      </Provider>
    );
  }
}

export default withReduxStore(App)