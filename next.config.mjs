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
  // at runtime instead, which Vercel's build already installs correctly.
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

export default nextConfig;
