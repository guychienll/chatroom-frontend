import * as authApi from "@/api/Auth";
import useUserStore from "@/stores/user";
import { Button, NavbarItem } from "@nextui-org/react";
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
                        {t["logout"]}
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
                        {t["login_or_register"]}
                    </Button>
                </NavbarItem>
            )}
        </div>
    );
}

export default LoginPane;
