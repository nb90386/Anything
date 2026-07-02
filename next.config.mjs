/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  // better-sqlite3 is a native addon. Next's default serverless bundler traces
  // and re-packages dependencies for each route, which frequently drops the
  // compiled .node binary and crashes at runtime with an opaque "server-side
  // exception" (the real error only shows in the platform's function logs).
  // Marking it external makes Next require() it straight from node_modules
  // at runtime instead of bundling it. outputFileTracingIncludes is a second,
  // explicit safety net: it force-includes the compiled binary in every
  // route's deployment package even if Vercel's own file tracer fails to
  // detect the requirement on its own (a known failure mode for native
  // addons, since the trace is static analysis and can't always see through
  // a native require()).
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
    outputFileTracingIncludes: {
      "/*": ["./node_modules/better-sqlite3/build/Release/*.node"],
    },
  },
};

export default nextConfig;
