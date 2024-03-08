import { FaSquareXTwitter } from "react-icons/fa6";
import {
    IoLogoGithub,
    IoLogoInstagram,
    IoLogoLinkedin,
    IoMdGlobe,
} from "react-icons/io";

const QUICK_LINKS = [
    { name: "首頁", href: "/" },
    { name: "聊天室", href: "/chat" },
    { name: "關於我們", href: "/about" },
    { name: "聯繫我們", href: "/" },
];

const LANGS = [
    { name: "中文", href: "/" },
    { name: "English", href: "/" },
    { name: "日本語", href: "/" },
    { name: "한국어", href: "/" },
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

export { LANGS, QUICK_LINKS, SOCIALS };
