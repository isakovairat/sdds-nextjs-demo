import '@/shared/styles/globals.css';
import { sdds_serv__light } from '@salutejs/sdds-themes';
import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import { sber_business_theme } from '@/shared/styles/sberBusinessTheme';

const ThemeStyle = createGlobalStyle([sber_business_theme] as unknown as TemplateStringsArray);

export default function App({ Component, pageProps }: AppProps) {
  console.log(sdds_serv__light[0]);
  return (
    <>
      <ThemeStyle />
      <Component {...pageProps} />
    </>
  );
}
