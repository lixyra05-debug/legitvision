/** @type {import('next').NextConfig} */
const nextConfig = {
  // « next dev » n'écrit plus son bloc de consignes dans CLAUDE.md ni AGENTS.md :
  // CLAUDE.md est le fichier d'instructions du projet, tenu à la main.
  agentRules: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
