import { Html, Head, Main, NextScript } from "next/document";

import { APP_NAME } from "stores/game/constants";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content={`${APP_NAME} - a word puzzle game`} />
        <meta name="keywords" content="wordle, puzzle, game" />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/icon-32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png"></link>
        <meta name="theme-color" content="#6aaa64" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
