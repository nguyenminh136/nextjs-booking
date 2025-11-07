import type { NextConfig } from "next";
import { InjectManifest } from "workbox-webpack-plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true
      }
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new InjectManifest({
          swSrc: "workbox/sw-template.js",
          swDest: "public/sw.js",
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
        })
      );
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com" // nếu bạn có login GitHub
      }
    ]
  }
};

export default nextConfig;
