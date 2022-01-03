import ContactMessages from "../contact/ContactMessages";
import { Col } from "react-bootstrap";

export default function MessageBoard() {

    return (
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <h1 className="text-md-center">Message board</h1>
            <ContactMessages/>
        </Col>
    );
}