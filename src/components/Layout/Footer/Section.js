import PropTypes from "prop-types";

Section.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
};

function Section({ title, children }) {
    return (
        <div className="footer-links">
            <h3 className="mb-4 text-lg font-semibold text-danger">{title}</h3>
            {children}
        </div>
    );
}

export default Section;
