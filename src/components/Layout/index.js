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
    User,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect } from "react";

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

function Layout({ children }) {
    const { profile, setProfile, cleanProfile, setLoading, loading } =
        useUserStore((state) => state);
    const router = useRouter();

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
            <Navbar isBlurred>
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
                <NavbarContent justify="end">
                    {profile ? (
                        <NavbarItem className="flex animate-appearance-in gap-x-4">
                            <User
                                name={
                                    profile.nickname ||
                                    profile.username.split("@")[0]
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
                                isLoading={loading}
                                as={Link}
                                href="/auth"
                                color="danger"
                                variant="flat"
                                className="tracking-wider"
                            >
                                登入 / 註冊
                            </Button>
                        </NavbarItem>
                    )}
                </NavbarContent>
            </Navbar>
            <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;
