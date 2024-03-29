import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useIntl } from "react-intl";

function Header() {
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];

    useEffect(() => {
        document.addEventListener("gesturestart", function (e) {
            e.preventDefault();
        });
    }, []);

    return (
        <Head>
            <title>{t["title"]}</title>

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />

            <meta name="description" content={t["description"]} />

            <meta property="og:title" content={t["title"]} />
            <meta property="og:description" content={t["description"]} />
            <meta property="og:image" content="/logo.png" />
            <meta property="og:type" content="website" />
            <meta
                property="og:url"
                content="https://chatroom.guychienll.dev/"
            />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@guychienll" />
            <meta name="twitter:title" content={t["title"]} />
            <meta name="twitter:description" content={t["description"]} />
            <meta name="twitter:image" content="/logo.png" />
        </Head>
    );
}

export default Header;
