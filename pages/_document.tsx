import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { getInitColorSchemeScript } from "@mui/material/styles";
import { ServerStyleSheets } from '@mui/styles'
import { ImagesSvg } from "@/src/constants/images";
// import Script from "next/script";
export default class DocumentNextJS extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
        <link rel="icon" href={ImagesSvg.logoVpb} />
        
        <script
          src="/jquery/jquery.min.js"
          // onLoad={() => {
          //   console.log("Script has loaded");
          // }}
          // strategy="afterInteractive"
        ></script>
        <script
          src="/jquery/jquery.validate.min.js"
          // onLoad={() => {
          //   console.log("Script has loaded");
          // }}
          // strategy="beforeInteractive"
        ></script>
        </Head>
        <body>
          {getInitColorSchemeScript()}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
DocumentNextJS.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
