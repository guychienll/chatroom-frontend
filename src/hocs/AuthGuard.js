import useUserStore from "@/stores/user";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

AuthGuard.propTypes = {
    children: PropTypes.node,
    renderAutoLoginFailed: PropTypes.func,
};

function AuthGuard({ children, renderAutoLoginFailed }) {
    const { profile, loading } = useUserStore((state) => state);
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];

    if (!profile && loading) {
        return (
            <div className="flex h-[calc(100dvh-4rem)] w-full items-center justify-center">
                <Spinner
                    label={t["auto_login"]}
                    color="danger"
                    labelColor="danger"
                />
            </div>
        );
    }

    if (!profile) {
        return renderAutoLoginFailed();
    }

    return children;
}

function withAuthGuard(Component, renderAutoLoginFailed) {
    return function AuthGuardHOC(props) {
        return (
            <AuthGuard renderAutoLoginFailed={renderAutoLoginFailed}>
                <Component {...props} />
            </AuthGuard>
        );
    };
}

export { withAuthGuard };

export default AuthGuard;
