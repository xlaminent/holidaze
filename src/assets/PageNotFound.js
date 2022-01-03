import React from "react";
import PropTypes from "prop-types";
import { Col } from "react-bootstrap";

function PageNotFound({content}) {
    return (
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <p className="fs-5">{content}</p>
        </Col>
    );
}

PageNotFound.propTypes = {
    content: PropTypes.string,
};

export default PageNotFound;