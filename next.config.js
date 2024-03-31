// const path = require('path');
// const dotenv = require('dotenv');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, /// server client render
  experimental: {
    appDir: true,
    nextScriptWorkers: true,
  },
  compiler: {
    styledComponents: true,
  },
  serverRuntimeConfig: {
    APP_PORT: process.env.APP_PORT,
  },
  publicRuntimeConfig: {
    ORIGIN_URL: process.env.ORIGIN_URL,
    ORIGIN_ENV: process.env.ORIGIN_ENV,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
