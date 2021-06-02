import App, { AppContext, AppProps } from 'next/app';
import cookies from 'next-cookies';
import '@/styles/global.scss';

import UserProvider from '../context/UserContext';
import Layout from '@/components/layout/layout';
import { NextComponentType, NextPageContext } from 'next';

type MyAppProps = {
  Component: NextComponentType<NextPageContext, any, {}>
  pageProps: any,
  isAuthenticated: boolean
}

const MyApp = ({ Component, pageProps, isAuthenticated }: MyAppProps) => {
  return (
    <UserProvider isAuthenticated={ isAuthenticated }>
      <Layout>
        <Component {...pageProps}/>
      </Layout>
    </UserProvider>
  )
}

MyApp.getInitialProps = async (context: AppContext) => {
  let isAuthenticated = false;

  // only checking for token, no verification on server here
  const { token } = cookies(context.ctx);
  if (token) {
    isAuthenticated = true;
  }

  const appProps = await App.getInitialProps(context);
  return { ...appProps, isAuthenticated };
}

export default MyApp;
