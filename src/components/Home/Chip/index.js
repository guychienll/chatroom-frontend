import PropTypes from "prop-types";

Chip.propTypes = {
    children: PropTypes.node,
};

function Chip({ children }) {
    return (
        <div className="inline min-w-[150px] rounded-2xl bg-danger/60 px-8 py-4 text-center text-xl tracking-widest text-white backdrop-blur-md md:text-3xl">
            {children}
        </div>
    );
}

export default Chip;
