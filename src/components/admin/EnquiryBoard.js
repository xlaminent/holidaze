import EnquiryMessages from "../enquiry/EnquiryMessages";
import { Col } from "react-bootstrap";

export default function EnquiryBoard() {
    return (
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <h1 className="text-md-center">EnquiryBoard</h1>
            <EnquiryMessages/>
        </Col>
    );
}