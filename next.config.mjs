/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    i18n: {
        locales: ["en-US", "zh-TW", "ja-JP", "ko-KR"],
        defaultLocale: "zh-TW",
    },
};

export default nextConfig;
