import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          ...(process.env.VERCEL_ENV === "preview"
            ? [
                {
                  key: "X-Robots-Tag",
                  value: "noindex, nofollow, noarchive",
                },
              ]
            : []),
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology",
        permanent: true,
      },
      {
        source: "/services",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology/services",
        permanent: true,
      },
      {
        source: "/services/",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology/services",
        permanent: true,
      },
      {
        source: "/process",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology/process",
        permanent: true,
      },
      {
        source: "/process/",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology/process",
        permanent: true,
      },
      {
        source: "/why-ledgerbyte-tech",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology/why-ledgerbyte",
        permanent: true,
      },
      {
        source: "/why-ledgerbyte-tech/",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology/why-ledgerbyte",
        permanent: true,
      },
      {
        source: "/about",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/about",
        permanent: true,
      },
      {
        source: "/about/",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/about",
        permanent: true,
      },
      {
        source: "/contact",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/contact",
        permanent: true,
      },
      {
        source: "/contact/",
        has: [{ type: "host", value: "tech.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/contact",
        permanent: true,
      },
      {
        source: "/services",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/finance/services",
        permanent: true,
      },
      {
        source: "/services/",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/finance/services",
        permanent: true,
      },
      {
        source: "/services/:slug",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/finance/services/:slug",
        permanent: true,
      },
      {
        source: "/services/:slug/",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/finance/services/:slug",
        permanent: true,
      },
      {
        source: "/about-us",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/about",
        permanent: true,
      },
      {
        source: "/about-us/",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/about",
        permanent: true,
      },
      {
        source: "/lets-connect",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/contact",
        permanent: true,
      },
      {
        source: "/lets-connect/",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/contact",
        permanent: true,
      },
      {
        source: "/process",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology/process",
        permanent: true,
      },
      {
        source: "/process/",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology/process",
        permanent: true,
      },
      {
        source: "/why-ledgerbyte-tech",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology/why-ledgerbyte",
        permanent: true,
      },
      {
        source: "/why-ledgerbyte-tech/",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/technology/why-ledgerbyte",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/terms-of-use",
        permanent: true,
      },
      {
        source: "/terms-of-service/",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/terms-of-use",
        permanent: true,
      },
      {
        source: "/:path+/",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/:path+",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ledgerbyte.io" }],
        destination: "https://ledgerbyte.io/:path*",
        permanent: true,
      },
      {
        source: "/:path+/",
        has: [{ type: "host", value: "ledgerbyte-site.vercel.app" }],
        destination: "https://ledgerbyte.io/:path+",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "ledgerbyte-site.vercel.app" }],
        destination: "https://ledgerbyte.io/:path*",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/finance/services",
        permanent: true,
      },
      {
        source: "/services/",
        destination: "/finance/services",
        permanent: true,
      },
      {
        source: "/services/:slug",
        destination: "/finance/services/:slug",
        permanent: true,
      },
      {
        source: "/services/:slug/",
        destination: "/finance/services/:slug",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/about-us/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/lets-connect",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/lets-connect/",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/process",
        destination: "/technology/process",
        permanent: true,
      },
      {
        source: "/process/",
        destination: "/technology/process",
        permanent: true,
      },
      {
        source: "/why-ledgerbyte-tech",
        destination: "/technology/why-ledgerbyte",
        permanent: true,
      },
      {
        source: "/why-ledgerbyte-tech/",
        destination: "/technology/why-ledgerbyte",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms-of-use",
        permanent: true,
      },
      {
        source: "/terms-of-service/",
        destination: "/terms-of-use",
        permanent: true,
      },
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
