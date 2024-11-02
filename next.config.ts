import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //url of uploadthing images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
