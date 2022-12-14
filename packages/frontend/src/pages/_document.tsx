import { ColorModeScript } from '@chakra-ui/react';
import theme from '@styles/theme';
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className="h-full">
        <Head>
          <meta name="description" content="DeChat" />
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700|Inconsolata:400,600,700&display=swap"
            rel="stylesheet"
          />
        </Head>

        <body className="h-full">
          <Main />
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
