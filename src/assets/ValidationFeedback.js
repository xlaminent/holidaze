import PropTypes from "prop-types";

export default function ValidationFeedback({ children }) {
    return <p className="form__input__feedback">{children}</p>;
}

ValidationFeedback.proptTypes = {
    children: PropTypes.node.isRequired
};