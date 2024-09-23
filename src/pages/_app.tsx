import "../styles/globals.css";
// import {SSRProvider} from "@salutejs/sdds-serv";
import {sdds_serv__light} from "@salutejs/sdds-themes";
import type {AppProps} from "next/app";
import {createGlobalStyle} from "styled-components";

const ThemeStyle = createGlobalStyle(sdds_serv__light);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
        <ThemeStyle />
        <Component {...pageProps} />
    </>
  );
}

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//       <SSRProvider>
//         <ThemeStyle />
//         <Component {...pageProps} />
//       </SSRProvider>
//   );
// }
