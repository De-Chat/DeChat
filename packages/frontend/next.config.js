// eslint-disable-next-line @typescript-eslint/no-var-requires
const optimizedImages = require('next-optimized-images');
// eslint-disable-next-line
const withTM = require('next-transpile-modules')(['@dechat/contracts']);

/** @type {import('next').NextConfig} */
const nextConfig = optimizedImages({
  reactStrictMode: true,
  handleImages: ['svg'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      // https://github.com/vercel/next.js/issues/7755#issuecomment-937721514
      config.resolve.fallback.fs = false;
    }
    return config;
  },
});

module.exports = withTM(nextConfig);
