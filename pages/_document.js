import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Improve color-scheme support for iOS/Safari */}
        <meta name="color-scheme" content="dark light" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
