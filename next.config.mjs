/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    i18n: {
        locales: ["en", "zh-TW", "jp", "kr"],
        defaultLocale: "zh-TW",
        localeDetection: true,
    },
};

export default nextConfig;
