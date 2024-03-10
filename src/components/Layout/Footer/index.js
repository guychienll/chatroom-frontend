import LinkList from "@/components/Layout/Footer/LinkList";
import Section from "@/components/Layout/Footer/Section";
import { LANGS, QUICK_LINKS, SOCIALS } from "@/components/Layout/constants";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

const Footer = () => {
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];
    return (
        <footer className="border-t-2 leading-6 tracking-wider">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <Section title={t["footer_section_1_title"]}>
                        <LinkList items={QUICK_LINKS} />
                    </Section>
                    <Section title={t["footer_section_2_title"]}>
                        <LinkList items={LANGS} />
                    </Section>
                    <Section title={t["footer_section_3_title"]}>
                        <LinkList items={SOCIALS} className="flex" />
                    </Section>
                </div>
            </div>
            <div>
                <div className="container mx-auto py-4 text-center">
                    <div className="flex justify-center gap-x-2 text-sm">
                        <span>&copy; 2024</span>
                        <Logo className="inline text-sm" />
                        <span>{t["copy_right"]}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
