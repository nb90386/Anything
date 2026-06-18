/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // better-sqlite3 and pg are native/node-only; keep them server-external.
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3", "pg"],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
