import { PageTitle } from "../../hooks/useTitleChange";
import { useState } from "react"
import { useLocation, Link } from "react-router-dom";
import { apiUrl } from "../../data/apiData";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ValidationFeedback from "../../assets/ValidationFeedback";
import { Form, Col, InputGroup } from "react-bootstrap";
import { characterCounter } from "../../assets/FormCharacterCount";

const schema = yup.object().shape({
    name: yup.string().required("Please enter your first name."),
    company_name: yup.string(),
    email: yup.string().required("Please enter your email.").email("Please enter a valid email address."),
    number: yup.string().required("Please enter your phone number.").min(8, "Phone number must consist of at least 8 numbers.").max(12, "Phone number can't be longer than 12 digits."),
    type: yup.string().required("Please pick one."),
    subject: yup.string().required("Please enter a subject line."),
    message: yup.string().required("Please enter your message").min(60, "The message must be at least 60 characters").max(500, "Message can't be longer than 500 characters.")
});

export default function EnquiryForm() {
    const {state} = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [confirmed, setConformation] = useState(false);

    let accommodationId;
    let accommodationName;

    if (state) {
        accommodationId = state.accommodationId;
        accommodationName = state.accommodationName;
    } else {
        accommodationId = null;
        accommodationName = null;
    }

    const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(schema),
	});

    async function onSubmit(data) {
		setLoading(true);
		setError(null);
         
		try {
            await axios.post(apiUrl + "enquiries", data);
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
        submitError += "An error occurred when trying to send the enquiry, please check the fields and try again.";
    }

    return (
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <PageTitle title="Enquiry Form"/>
            <section className="split">
                <h1 className="text-center">Send an enquiry</h1>
                <div className="split__box split__box--left">
                    <div className="form">
                        <Col md="12" sm="12">
                            <h2>By form</h2>
                            <Form className="form__section" onSubmit={handleSubmit(onSubmit)}>
                                <fieldset disabled={loading}>
                                    {accommodationName === null ? <></> : <>
                                        <input placeholder="hotel_name" type="hidden" value={accommodationName} name="establishment_name" ref={register()}/>
                                        <input placeholder="hotel_id" type="hidden" value={accommodationId} name="establishment_id" ref={register()}/> 
                                    </>}

                                    <Form.Label className="form__label">Full Name <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control className="form__input" size="sm" ref={register} type="text" name="name" />
                                        {errors.name && <ValidationFeedback>{errors.name.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Form.Label className="form__label">Company Name <span className="text-muted">(optional)</span></Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control className="form__input" size="sm" ref={register} type="text" name="company_name" />
                                    </InputGroup>

                                    <Form.Label className="form__label">Email Address <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control className="form__input" size="sm" ref={register} type="email" name="email" />
                                        {errors.email && <ValidationFeedback>{errors.email.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Form.Label className="form__label">Phone Number <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control className="form__input" size="sm" ref={register} type="number" name="number" />
                                        {errors.number && <ValidationFeedback>{errors.number.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Form.Label className="form__label">Type <span className="text-muted">(inquiry category) </span><span className="form__label--required" title="Required field"> *</span></Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Select className="form__input" name="type" required size="sm" ref={register} >
                                                <option value="">...</option>
                                                <option value="Billing">Billing</option>
                                                <option value="Booking">Booking</option>
                                                <option value="Customer-Service">Customer Service</option>
                                                <option value="Information">Information</option>
                                                <option value="Payment">Payment</option>
                                                <option value="Other">Other</option>
                                        </Form.Select>
                                        {errors.type && <ValidationFeedback>{errors.type.message}</ValidationFeedback>}
                                    </InputGroup> 

                                    <Form.Label className="form__label">Subject <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control className="form__input" size="sm" ref={register} type="text" name="subject" />
                                        {errors.subject && <ValidationFeedback>{errors.subject.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Form.Label className="form__label">Request / Message <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-1">
                                        <Form.Control className="form__input form__input__counter" as="textarea" onChange={characterCounter} maxLength="500" ref={register} rows={8} name="message"/>
                                        <div className="form__counter form__counter--sm text-muted"><span className="form__counter__remaining">500/</span><span>500</span></div>
                                        {errors.message && <ValidationFeedback>{errors.message.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <div className="form__buttons">
                                        <button type="submit" className="button button__primary mt-4 form__btn" title="Send">{loading ? "Sending... " : "Send"}</button>
                                        <button as="input" type="reset" value="Clear" title="Clear form" className="button button__secondary mt-4 form__btn">Clear</button>
                                    </div>
                                    <p className="form__submit--error mt-3">{submitError}</p>
                                </fieldset> 
                            </Form>
                            { confirmed && 
                                <div>
                                    <h3>enquiry sendt</h3>
                                    <p>We will be in touch shortly, you can expect a answer within 2-4 days.</p>
                                </div>
                            } 
                        </Col>
                    </div>
                </div>
                <div className="split__box split__box--right">
                    {accommodationName === null ? 
                        <div className="split__box__section">
                            <h2>!</h2>
                            <p>Enquiries are only meant for business purposes regarding the hotels, resorts and other accommodations we offer bookings for.
                                Send an enquiry regarding off-season stays, reservations for large groups, requests for business cooperation and or other larger matters.</p>
                            <p>For smaller matters, see our <Link className="text-link" to="/contact-us">contact form</Link>, read our <span className="text-link float-none">FAQs</span> or call us directly at +41 111 111 291.</p>
                        </div>
                    : 
                        <div className="split__box__section">
                            <h2>recipient <b>{accommodationName}</b></h2>
                            <p>You are now sending an enquiry with {accommodationName} as recipient. We might be able to solve it, but if not we will contact {accommodationName} to set up an solution. You can expect an answer within 2-4 days.</p>
                            <p>If you meant to send an enquiry for us as main recipient, Holidaze, <Link className="text-link" to="/enquiry">click here</Link>.</p>
                        </div>
                    }
                </div>
            </section>  
        </Col>
    )
}