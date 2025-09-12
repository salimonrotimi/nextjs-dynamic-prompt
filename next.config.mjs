/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [{
                protocol: "https",
                hostname: "avatars.githubusercontent.com", // GitHub profile avatars
                port: "",
                pathname: "/u/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com", // Google profile images
                port: "",
                pathname: "/**",
            },
        ],
    },

    async headers() {
        return [{
            source: "/(.*)",
            headers: [
                // Prevent clickjacking
                { key: "X-Frame-Options", value: "DENY" },
                // Prevent MIME type sniffing
                { key: "X-Content-Type-Options", value: "nosniff" },
                // XSS Protection
                { key: "X-XSS-Protection", value: "1; mode=block" },
                // Referrer Policy
                { key: "Referrer-Policy", value: "origin-when-cross-origin" },
                // Content Security Policy
                {
                    key: "Content-Security-Policy",
                    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
                },
                // Strict Transport Security
                {
                    key: "Strict-Transport-Security",
                    value: "max-age=31536000; includeSubDomains; preload",
                },
                // Permissions Policy
                {
                    key: "Permissions-Policy",
                    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
                },
            ],
        }, ];
    },
};


export default nextConfig;