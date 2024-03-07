import LinkList from "@/components/Layout/Footer/LinkList";
import Section from "@/components/Layout/Footer/Section";
import {
    LANGS,
    QUICK_LINKS,
    SOCIALS,
} from "@/components/Layout/Footer/constants";
import Logo from "@/components/Logo";

const Footer = () => {
    return (
        <footer className="border-t-2 leading-6 tracking-wider">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <Section title="快速連結">
                        <LinkList items={QUICK_LINKS} />
                    </Section>
                    <Section title="切換語系">
                        <LinkList items={LANGS} />
                    </Section>

                    <Section title="追蹤我們">
                        <LinkList items={SOCIALS} className="flex" />
                    </Section>
                </div>
            </div>
            <div>
                <div className="container mx-auto py-4 text-center">
                    <div className="flex justify-center gap-x-2 text-sm">
                        <span>&copy; 2024</span>
                        <Logo className="inline text-sm" />
                        <span>保留所有權利</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
