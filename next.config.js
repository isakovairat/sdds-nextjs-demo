/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@salutejs/sdds-serv', '@salutejs/plasma-new-hope'],
};

module.exports = nextConfig;
