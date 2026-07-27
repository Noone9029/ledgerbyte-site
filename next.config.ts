import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/finance/services",
        permanent: true,
      },
      {
        source: "/services/:slug",
        destination: "/finance/services/:slug",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/lets-connect",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/process",
        destination: "/technology/process",
        permanent: true,
      },
      {
        source: "/why-ledgerbyte-tech",
        destination: "/technology/why-ledgerbyte",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms-of-use",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
