import clsx from "clsx";
import PropTypes from "prop-types";
import Link from "next/link";

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
    return (
        <ul className={clsx({}, className)}>
            {items.map((link) => (
                <li key={link.name}>
                    <Link
                        href={link.href || "#"}
                        className="flex items-center hover:text-danger"
                    >
                        {link.icon || link.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default LinkList;
