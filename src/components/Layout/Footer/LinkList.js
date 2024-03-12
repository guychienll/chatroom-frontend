import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

LinkList.propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            href: PropTypes.string,
        }),
    ),
};

function LinkList({ items = [], className }) {
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];
    return (
        <ul className={clsx({}, className)}>
            {items.map((link) => (
                <li key={link.name}>
                    <Link
                        href={link.href || router.pathname}
                        className="flex items-center hover:text-danger"
                        locale={link.locale || router.locale}
                    >
                        {link.icon || t[link.name] || link.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default LinkList;
