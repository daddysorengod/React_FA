import $ from 'jquery';

if (typeof window !== "undefined") {
  //This code is executed in the browser
  window.jQuery = $;
  window.$ = $;
  // window.$ = window.jQuery = require('jquery')
}

export default $;