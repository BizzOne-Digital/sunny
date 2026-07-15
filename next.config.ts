import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.dtdogs.ca" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
