import type { NextConfig } from "next";
import accounting from "./src/content/accounting.json" with { type: "json" };

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
  experimental: { globalNotFound: true },
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
    const retiredHost = [{ type: "host" as const, value: "tech\\.ledgerbyte\\.io" }];
    const alternateHost = [
      { type: "host" as const, value: "(?:www\\.ledgerbyte\\.io|ledgerbyte-site\\.vercel\\.app)" },
    ];
    const financeSlugs = accounting.services.map(({ slug }) => slug).join("|");
    const aliases = [
      ["/services", "/finance/services"],
      [`/services/:slug(${financeSlugs})`, "/finance/services/:slug"],
      ["/about-us", "/about"],
      ["/lets-connect", "/contact"],
      ["/terms-of-service", "/terms-of-use"],
    ];

    // Keep retired paths out of host and trailing-slash redirects so they return a 404 directly.
    const retiredPaths = "(?:technology|process|why-ledgerbyte-tech)(?:/|$)";
    const unknownService = `(?:finance/)?services/(?=[^/])(?!(?:${financeSlugs})/?$)`;
    const excluded = `${retiredPaths}|${unknownService}`;
    const canonicalPath = `/:path((?!${excluded}).*)`;
    const trailingPath = `/:path((?!${excluded}).+)/`;

    return [
      ...aliases.flatMap(([path, target]) =>
        [path, `${path}/`].flatMap((source) => [
          { source, has: alternateHost, destination: `https://ledgerbyte.io${target}`, permanent: true },
          { source, missing: retiredHost, destination: target, permanent: true },
        ]),
      ),
      { source: trailingPath, has: alternateHost, destination: "https://ledgerbyte.io/:path", permanent: true },
      { source: canonicalPath, has: alternateHost, destination: "https://ledgerbyte.io/:path", permanent: true },
      { source: trailingPath, missing: retiredHost, destination: "/:path", permanent: true },
    ];
  },
};

export default nextConfig;
