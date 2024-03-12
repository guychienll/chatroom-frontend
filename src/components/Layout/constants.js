import { FaSquareXTwitter } from "react-icons/fa6";
import {
    IoLogoGithub,
    IoLogoInstagram,
    IoLogoLinkedin,
    IoMdGlobe,
} from "react-icons/io";

const QUICK_LINKS = [
    { name: "quick_link_home", href: "/" },
    { name: "quick_link_chat", href: "/chat" },
    { name: "quick_link_about", href: "/about" },
    { name: "quick_link_contact", href: "/contact" },
];

const LANGS = [
    { name: "中文", locale: "zh-TW" },
    { name: "English", locale: "en-US" },
    { name: "日本語", locale: "ja-JP" },
    { name: "한국어", locale: "ko-KR" },
];

const SOCIALS = [
    {
        name: "Twitter",
        href: "https://twitter.com/guychienll",
        icon: <FaSquareXTwitter size={24} />,
    },
    {
        name: "Linkedin",
        href: "https://www.linkedin.com/in/guy-chien-0566b61b9/",
        icon: <IoLogoLinkedin size={24} />,
    },
    {
        name: "Github",
        href: "https://github.com/guychienll/",
        icon: <IoLogoGithub size={24} />,
    },
    {
        name: "Instagram",
        href: "https://www.instagram.com/_chienli_/",
        icon: <IoLogoInstagram size={24} />,
    },
    {
        name: "Website",
        href: "https://www.guychienll.dev/",
        icon: <IoMdGlobe size={24} />,
    },
];

const LOCALES = [
    {
        key: "zh_TW",
        label: "中文",
        value: "zh-TW",
    },
    {
        key: "en_US",
        label: "English",
        value: "en-US",
    },
    {
        key: "ja_JP",
        label: "日本語",
        value: "ja-JP",
    },
    {
        key: "ko_KR",
        label: "한국어",
        value: "ko-KR",
    },
];

export { LANGS, LOCALES, QUICK_LINKS, SOCIALS };
