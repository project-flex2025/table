import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/search",
        destination: "http://183.82.7.208:3002/anyapp/search/",
      },
      {
        source: "/api/create",
        destination:"http://183.82.7.208:3002/anyapp/create/"
      },
      {
        source: "/api/update",
        destination:"http://183.82.7.208:3002/anyapp/update/"
      },
      {
        source: "/api/delete",
        destination:"http://183.82.7.208:3002/anyapp/delete/"
      }
    ];
  },

};

export default nextConfig;
