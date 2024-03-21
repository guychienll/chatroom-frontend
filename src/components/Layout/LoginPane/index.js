import * as authApi from "@/api/Auth";
import useUserStore from "@/stores/user";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    NavbarItem,
    User,
} from "@nextui-org/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

LoginPane.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};

function LoginPane({ className, onClick }) {
    const { profile, loading, cleanProfile } = useUserStore((state) => state);
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];

    return (
        <div className={clsx("", className)}>
            {profile ? (
                <NavbarItem className="flex animate-appearance-in gap-x-4">
                    <Dropdown>
                        <DropdownTrigger>
                            <User
                                className="cursor-pointer"
                                name={
                                    profile.nickname ||
                                    profile.username.split("@")[0]
                                }
                                avatarProps={{
                                    src: profile.avatar,
                                    isBordered: true,
                                }}
                                description={
                                    <div className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap md:max-w-48">
                                        {profile.username}
                                    </div>
                                }
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Dynamic Actions"
                            items={[
                                {
                                    key: "profile",
                                    label: t["profile_editor"],
                                    action: async () => {
                                        await router.push("/profile");
                                        onClick && onClick();
                                    },
                                },
                                {
                                    key: "logout",
                                    label: t["logout"],
                                    action: async () => {
                                        await authApi.logout();
                                        await router.push("/");
                                        cleanProfile();
                                        onClick && onClick();
                                    },
                                },
                            ]}
                        >
                            {(item) => (
                                <DropdownItem
                                    key={item.key}
                                    color="danger"
                                    onPress={async () => {
                                        await item.action();
                                    }}
                                >
                                    {item.label}
                                </DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
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
                        {t["login_or_register"]}
                    </Button>
                </NavbarItem>
            )}
        </div>
    );
}

export default LoginPane;
