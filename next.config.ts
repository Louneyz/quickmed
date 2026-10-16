import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Become a partner / driver are pop-ups now; old links open them on the homepage.
  async redirects() {
    return [
      { source: "/partners", destination: "/#become-a-partner", permanent: false },
      { source: "/drivers", destination: "/#become-a-driver", permanent: false },
    ];
  },
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/:path*", headers: base },
      // Portal pages hold patient data once loaded: keep them out of search engines
      // and never send the referring URL elsewhere.
      {
        source: "/(portal|admin|login|set-password)/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;
