import PropTypes from "prop-types";
import clsx from "clsx";

Logo.propTypes = {
    className: PropTypes.string,
};

function Logo({ className }) {
    return (
        <div
            className={clsx(
                "font-bold italic tracking-wider text-danger",
                className,
            )}
        >
            ChatRoom
        </div>
    );
}

export default Logo;
