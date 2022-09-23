import '../styles/globals.css';

import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const AppWithoutSSR = dynamic(() => import('../components/App'), {
  ssr: false,
});

function AppWrapper({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>DeChat</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <AppWithoutSSR>
        <Component {...pageProps} />
      </AppWithoutSSR>
    </>
  );
}

export default AppWrapper;
