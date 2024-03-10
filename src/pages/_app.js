import Layout from "@/components/Layout";
import en_US from "@/locales/en_US";
import ja_JP from "@/locales/jp";
import ko_KR from "@/locales/kr";
import zh_TW from "@/locales/zh_TW";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { IntlProvider } from "react-intl";

const Intl = {
    "zh-TW": zh_TW,
    "en-US": en_US,
    "ja-JP": ja_JP,
    "ko-KR": ko_KR,
};

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};

function App({ Component, pageProps }) {
    const router = useRouter();

    return (
        <IntlProvider locale={router.locale} messages={Intl}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </IntlProvider>
    );
}

export default App;
