import * as authApi from "@/api/Auth";
import * as userApi from "@/api/User";
import Footer from "@/components/Layout/Footer";
import Logo from "@/components/Logo";
import { delay } from "@/helper/time";
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
    User,
} from "@nextui-org/react";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const title = "ChatRoom | Random Chat With Your Soul Mate";
const desc = "Quick match your soul math, and chat with";

LoginPane.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};
function LoginPane({ className, onClick }) {
    const { profile, loading, cleanProfile } = useUserStore((state) => state);
    const router = useRouter();
    return (
        <div className={clsx("", className)}>
            {profile ? (
                <NavbarItem className="flex animate-appearance-in gap-x-4">
                    <User
                        name={
                            profile.nickname || profile.username.split("@")[0]
                        }
                        description={profile.username}
                        avatarProps={{
                            size: "sm",
                            src: profile.avatar,
                        }}
                    />
                    <Button
                        onClick={async () => {
                            await authApi.logout();
                            await router.push("/");
                            cleanProfile();
                            onClick && onClick();
                        }}
                        color="danger"
                        variant="ghost"
                        className="tracking-wider"
                    >
                        登出
                    </Button>
                </NavbarItem>
            ) : (
                <NavbarItem>
                    <Button
                        onClick={async () => {
                            await router.push("/auth");
                            onClick && onClick();
                        }}
                        isLoading={loading}
                        color="danger"
                        variant="flat"
                        className="tracking-wider"
                    >
                        登入 / 註冊
                    </Button>
                </NavbarItem>
            )}
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { setProfile, setLoading } = useUserStore((state) => state);
    const router = useRouter();

    const MENU_ITEMS = [
        {
            key: "chat",
            label: "聊天室",
            action: async () => {
                router.push("/chat");
            },
        },
    ];

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                await delay(1500);
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
        <div className="min-h-screen bg-[#ffffff]">
            <Head>
                <title>{title}</title>
                <meta name="description" content={desc} />

                <meta property="og:title" content={title} />
                <meta property="og:description" content={desc} />
                <meta property="og:image" content="/logo.png" />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://chatroom.guychienll.dev/"
                />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@guychienll" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={desc} />
                <meta name="twitter:image" content="/logo.png" />
            </Head>
            <Navbar
                isBlurred
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
            >
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                    className="sm:hidden"
                    color="danger"
                />
                <NavbarBrand>
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
                            聊天室
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent className="hidden gap-4 sm:flex" justify="end">
                    <LoginPane />
                </NavbarContent>

                <NavbarMenu>
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
                </NavbarMenu>
            </Navbar>
            <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;
