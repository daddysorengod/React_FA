import React from "react";
import Script from "next/script";
import Head from 'next/head'
// import $ from "jquery";
interface Props {}
const JqueryContext = (props: Props): JSX.Element => {
  return (
    <Head>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js"
        onLoad={() => {
          console.log("Script has loaded");
        }}
        strategy="worker"
      ></Script>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.0/jquery.validate.min.js"
        onLoad={() => {
          console.log("Script has loaded");
        }}
        strategy="worker"
      ></Script>
    </Head>
  );
};
export default JqueryContext;
