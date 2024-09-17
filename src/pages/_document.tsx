import type {DocumentContext, DocumentInitialProps} from "next/document";
import Document, {Head, Html, Main, NextScript} from "next/document";
import {ServerStyleSheet} from "styled-components";
import React from 'react';

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
        <Html lang="ru">
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
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
    );
  }
}
