import "@/styles/globals.css";
import { standard } from "@salutejs/plasma-typo";
import { SSRProvider } from "@salutejs/sdds-serv";
import type { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";
// import { sdds_serv__light } from "@salutejs/sdds-serv/themes";

const TypoStyle = createGlobalStyle(standard);
// const ThemeStyle = createGlobalStyle(sdds_serv__light);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SSRProvider>
        <TypoStyle />
        <Component {...pageProps} />
      </SSRProvider>
    </>
  );
}
