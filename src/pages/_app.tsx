import '@/shared/styles/globals.css';
import '@salutejs/sdds-themes/css/sdds_serv__light.css';
import { SSRProvider } from '@salutejs/sdds-serv';
import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import Head from 'next/head';
import { sdds_serv__light } from '@salutejs/sdds-themes';

const ThemeStyle = createGlobalStyle(sdds_serv__light);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SSRProvider >
        <ThemeStyle />
        <Component {...pageProps} />
      </SSRProvider>
    </>
  );
}
