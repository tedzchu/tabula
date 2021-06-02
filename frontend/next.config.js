const withImages = require('next-images');

module.exports = withImages({
  env: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
  },
  future: {
    webpack5: true,
  },
  target: 'serverless',
});
