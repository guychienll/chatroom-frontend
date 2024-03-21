import * as userApi from "@/api/User";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import { LocaleSwitch } from "@/components/Layout/LocaleSwitch";
import LoginPane from "@/components/Layout/LoginPane";
import Logo from "@/components/Logo";
import useUserStore from "@/stores/user";
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { setProfile, setLoading } = useUserStore((state) => state);
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];

    const MENU_ITEMS = [
        {
            key: "chat",
            label: t["navigation_link_chat"],
            action: async () => {
                router.push("/chat");
            },
        },
        {
            key: "about",
            label: t["navigation_link_about"],
            action: async () => {
                router.push("/about");
            },
        },
        {
            key: "contact",
            label: t["navigation_link_contact"],
            action: async () => {
                router.push("/contact");
            },
        },
    ];

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const _profile = await userApi.profile();

                setProfile(_profile);
            } catch (e) {
                console.error(e);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [setLoading, setProfile]);

    return (
        <div className="bg-[#ffffff]">
            <Header />
            <Navbar
                isBlurred
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
                className="sticky flex items-center"
            >
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                    className="absolute left-4 sm:hidden"
                    color="danger"
                />
                <NavbarBrand className="flex justify-center md:justify-start">
                    <Link href="/">
                        <Logo className="text-2xl" />
                    </Link>
                </NavbarBrand>
                <NavbarContent
                    className="hidden gap-4 sm:flex"
                    justify="center"
                >
                    <NavbarItem isActive={router.pathname === "/chat"}>
                        <Link className="text-danger" href="/chat">
                            {t["navigation_link_chat"]}
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive={router.pathname === "/about"}>
                        <Link className="text-danger" href="/about">
                            {t["navigation_link_about"]}
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive={router.pathname === "/contact"}>
                        <Link className="text-danger" href="/contact">
                            {t["quick_link_contact"]}
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent className="hidden gap-4 sm:flex" justify="end">
                    <LocaleSwitch />
                    <LoginPane />
                </NavbarContent>

                <NavbarMenu className="flex flex-col py-4 pb-36">
                    {MENU_ITEMS.map((item) => (
                        <NavbarMenuItem key={item.key}>
                            <Button
                                color="default"
                                className="w-full"
                                variant="text"
                                size="lg"
                                onClick={async () => {
                                    await item.action();
                                    setIsMenuOpen(false);
                                }}
                            >
                                {item.label}
                            </Button>
                        </NavbarMenuItem>
                    ))}
                    <LoginPane
                        className="flex justify-center"
                        onClick={() => {
                            setIsMenuOpen(false);
                        }}
                    />
                    <div className="flex-1"></div>
                    <LocaleSwitch />
                </NavbarMenu>
            </Navbar>
            <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
            {isShowFooter(router) && <Footer />}
        </div>
    );
}

function isShowFooter(router) {
    const EXCLUDE_FOOTER_PATHS = [
        "/chat",
        "/auth",
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
    ];
    return EXCLUDE_FOOTER_PATHS.every((path) => path !== router.pathname);
}

export default Layout;
