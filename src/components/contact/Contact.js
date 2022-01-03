import { PageTitle } from "../../hooks/useTitleChange";
import { useState } from "react";
import { apiUrl } from "../../data/apiData";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ValidationFeedback from "../../assets/ValidationFeedback";
import { characterCounter } from "../../assets/FormCharacterCount";
import { Form, Col, InputGroup } from "react-bootstrap";

const schema = yup.object().shape({
    name: yup.string().required("Please enter your name."),
    email: yup.string().required("Please enter your email.").email("Please enter a valid email address."),
    subject: yup.string().required("Please enter a subject."),
    message: yup.string().required("Please enter your message.").min(30, "The message must be at least 30 characters.").max(300, "Message can't be longer than 300 characters.")
});

export default function Contact() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [confirmed, setConformation] = useState(false);

    const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(schema)
	});

    async function onSubmit(data) {
		setLoading(true);
		setError(null);
         
		try {
            await axios.post(apiUrl + "messages", data);
            setConformation(true);
            document.querySelector("form").reset();
		} catch (error) {
			setError(error.toString());
            setConformation(false);
		} finally {
			setLoading(false);
		}
	}

    let submitError = "";

    if (error) {
        submitError += "An error occurred when trying to send the message, please check the fields and try again. ";
    }
   
    return (<>
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <PageTitle title="Contact Us"/>
            <section className="split">
                <h1 className="text-center">contact us at holidaze</h1>
                <div className="split__box split__box--left">
                    <div className="form">
                        <Col md="12" sm="12">
                            <h2>By form</h2>
                            <p>Contact us any time about anything! You can expect an answer within 5 days. </p>

                            <Form className="form__section" onSubmit={handleSubmit(onSubmit)}> 
                                <fieldset disabled={loading}>
                                    <Form.Label className="form__label">Full Name <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control className="form__input" size="sm" ref={register} type="text" name="name" />
                                        {errors.name && <ValidationFeedback>{errors.name.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Form.Label className="form__label">Email <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control className="form__input" size="sm" ref={register} type="email" name="email" />
                                        {errors.email && <ValidationFeedback>{errors.email.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Form.Label className="form__label">Subject <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control className="form__input" size="sm" ref={register} type="text" name="subject" />
                                        {errors.subject && <ValidationFeedback>{errors.subject.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Form.Label className="form__label">Message <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control className="form__input form__input__counter" as="textarea" onChange={characterCounter} maxLength="300" ref={register} rows={6} name="message"/>
                                        <div className="form__counter form__counter--sm text-muted"><span className="form__counter__remaining">300/</span><span>300</span></div>
                                        {errors.message && <ValidationFeedback>{errors.message.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <div className="form__buttons">
                                        <button type="submit" className="button button__primary mt-4 form__btn" title="Send Message">{loading ? "Sending... " : "Send"}</button>
                                        <button as="input" type="reset" value="Clear" title="Clear form" className="button button__secondary mt-4 form__btn">Clear</button>
                                    </div>
                                    <p className="form__submit--error mt-3">{submitError}</p>
                                </fieldset>
                            </Form>
                            { confirmed && 
                                <div>
                                    <h3>Message sendt</h3>
                                    <p>Thank you for contacting us. We usually answer within 2-4 work days.</p>
                                </div>
                            } 
                        </Col>
                    </div>
                </div>
                <div className="split__box split__box--right">
                    <div className="split__box__section push-sm">
                        <h2>By phone</h2>
                        <p>Reservation over the phone <span>+41 321 321 199</span></p>
                        <p>Toll free call <span>+41 111 111 291</span></p>
                    </div>
                    <div className="split__box__section">
                        <h2>By email</h2>
                        <p>Address <span>contact@holidaze.com</span></p>
                    </div>
                    <div className="split__box__section mb-0">
                        <h2>By faq</h2>
                        <p>You might find answers to your questions if you read our FAQs first. We have information on reservations, booking, our partners and subjects regarding dining, activities and other parts of a stay.</p>
                        <p className="text-link">Check out our FAQs</p>
                    </div>
                </div>
            </section>  
        </Col>
    </>);
}
  