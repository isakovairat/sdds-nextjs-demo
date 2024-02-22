import Head from "next/head";
import { Button } from "@salutejs/sdds-serv";
import { textAccent } from "@salutejs/sdds-serv/tokens";

export default function Home() {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn-app.sberdevices.ru/shared-static/0.0.0/styles/SBSansDisplay.0.2.0.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-app.sberdevices.ru/shared-static/0.0.0/styles/SBSansText.0.2.0.css"
        />
      </Head>
      <main>
        <Button>Hello, SDDS!</Button>
        <p style={{ color: textAccent }}>Token usage example</p>
      </main>
    </>
  );
}
