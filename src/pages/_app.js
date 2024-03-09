import Layout from "@/components/Layout";
import en_US from "@/locales/en_US";
import jp from "@/locales/jp";
import kr from "@/locales/kr";
import zh_TW from "@/locales/zh_TW";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { IntlProvider } from "react-intl";

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};

function App({ Component, pageProps }) {
    const router = useRouter();
    return (
        <IntlProvider
            locale={router.locale}
            messages={{ en: en_US, "zh-TW": zh_TW, jp: jp, kr: kr }}
        >
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </IntlProvider>
    );
}

export default App;
