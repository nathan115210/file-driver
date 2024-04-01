/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {hostname: "adamant-cod-579.convex.cloud"}
        ]
    }
};

export default nextConfig;
