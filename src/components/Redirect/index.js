import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { delay } from "../../helper/time";

Redirect.propTypes = {
    path: PropTypes.string,
};

function Redirect({ path = "/auth" }) {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            await delay(2500);
            await router.push(path);
        })();
    }, [path, router]);

    return (
        <div className="flex h-[calc(100dvh-4rem)] w-full items-center justify-center">
            <Spinner label="自動導向" color="danger" labelColor="danger" />
        </div>
    );
}

export default Redirect;
