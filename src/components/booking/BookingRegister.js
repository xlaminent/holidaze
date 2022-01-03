import { useState } from "react";
import { useForm } from "react-hook-form";
import BackgroundImage from "../layout/BackgroundImg";
import ValidationFeedback from "../../assets/ValidationFeedback";
import { PageTitle } from "../../hooks/useTitleChange";
import { Form, Button, Col, Row, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import CarouselByType from "../layout/Carousel"; 

const FormBtn = ({ onClick, isDisabled, children }) => {
    return (<button onClick={onClick} disabled={isDisabled} title="To next step" type="button" className="button button__primary mt-3 form__btn form__btn--disabled">{children}</button>)
}

export default function BookingRegister(props) {
    const { clearBookings, booking  } = props;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [confirmed, setConformation] = useState(false);
    const [step, setStep] = useState(0);

    const { register, handleSubmit, formState: { errors, isValid }} = useForm({ mode: "onChange" })

    const stepForwards = () => { setStep(cur => cur + 1) }
    const stepBackwards = () => { setStep(cur => cur - 1) }

    async function onSubmit() {
		setLoading(true);
		setError(null);

		try {
            clearBookings();
            stepForwards();
            setConformation(true);
		} catch (error) {
            setConformation(false);
			setError(error.toString());
            stepBackwards();
		} finally {
			setLoading(false);
		}
	}

    function renderForm() {
        return (
            <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
                <section className="split d-inline-block">
                    <h1 className="text-center">Book your reservation</h1>
                    <div className="split__box split__box--left">
                        <Form className="form form__section" onSubmit={handleSubmit(onSubmit)}>
                            <fieldset disabled={loading}>
                                {step >= 0 && (
                                    <section className={`${step === 0 ? "" : "hide"}`}>
                                        <div className="form__progress">
                                            <div><p className="form__label form__label--active mb-2 mt-2">Guest Details </p><i className="bi bi-arrow-down"></i></div>     
                                            <p className="form__label mb-2 mt-2" title="Next step">Contact Information</p>
                                            <p className="form__label mb-2 mt-2" title="Next step">Payment</p>
                                        </div>
                                        <Row>
                                            <Col md="6">
                                                <Form.Label className="form__label">First Name <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control className="form__input" size="sm" ref={register({required: { message: "Please enter your first name.", value: true }})} type="text" name="fname" />
                                                    {errors.fname && <ValidationFeedback>{errors.fname.message}</ValidationFeedback>}
                                                </InputGroup>
                                            </Col>
                                            <Col md="6">
                                                <Form.Label className="form__label">Last Name <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control className="form__input" size="sm" ref={register({required: { message: "Please enter your last name.", value: true }})} type="text" name="lname" />
                                                    {errors.lname && <ValidationFeedback>{errors.lname.message}</ValidationFeedback>}
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <Form.Label className="form__label">Company Name <span className="text-muted">(optional)</span></Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control className="form__input" size="sm" type="text" name="company_name" />
                                        </InputGroup>
                                        <InputGroup className="mb-2">
                                            <Form.Check className="form__input" size="md"/>
                                            <Form.Label className="form__label form__label--checkbox">I'm booking for someone else</Form.Label>
                                        </InputGroup>
                                        <FormBtn onClick={stepForwards} isDisabled={!isValid}>Continue</FormBtn>
                                    </section>
                                )}
                                {step >= 1 && (
                                    <section className={`${step === 1 ? "" : "hide"}`}>
                                        <div className="form__progress">
                                            <p className="form__label mb-2 mt-2 pointer prev" title="Go back" onClick={stepBackwards}>Guest Details</p>
                                            <div><p className="form__label form__label--active mb-2 mt-2">Contact Information</p><i className="bi bi-arrow-down"></i></div>
                                            <p className="form__label mb-2 mt-2" title="Next step">Payment</p>
                                        </div>
                                        <Row>
                                            <Col md="6">
                                                <Form.Label className="form__label">Email <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control className="form__input" size="sm" type="email" name="email" 
                                                        ref={register({required: { message: "Please enter your email address.", value: true }, pattern: { message: "Email address must be valid.", value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ }})}/>
                                                    {errors.email && <ValidationFeedback>{errors.email.message}</ValidationFeedback>}
                                                </InputGroup>     
                                            </Col>
                                            <Col md="6">
                                                <Form.Label className="form__label">Phone Number <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control className="form__input" size="sm" maxLength="12" type="number" name="number"
                                                        ref={register({required: { message: "Please enter your phone number.", value: true }, minLength: { message: "Phone number can't be shorter than 8 characters.", value: 8 }, maxLength: { message: "Phone number can't be longer than 12.", value: 12 }})}/>
                                                    {errors.number && <ValidationFeedback>{errors.number.message}</ValidationFeedback>}
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="9">
                                                <Form.Label className="form__label">Address <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control className="form__input" size="sm" type="text" name="address" ref={register({required: { message: "Please enter your addess.", value: true }})}/>
                                                    {errors.address && <ValidationFeedback>{errors.address.message}</ValidationFeedback>}
                                                </InputGroup>
                                            </Col>
                                            <Col md="3">
                                                <Form.Label className="form__label">Number</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control className="form__input" size="sm" type="number" name="number"/>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="2">
                                            <Form.Label className="form__label">Zip Code <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-2">
                                                    <Form.Control className="form__input" size="sm" type="number" name="zip" ref={register({required: { message: "Please enter your areas zip code.", value: true }})} />
                                                    {errors.zip && <ValidationFeedback>{errors.zip.message}</ValidationFeedback>}
                                                </InputGroup>
                                            </Col>
                                            <Col md="5">
                                                <Form.Label className="form__label">City <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-2">
                                                    <Form.Control className="form__input" size="sm" type="text" name="city" ref={register({required: { message: "Please enter name of your city.", value: true }})} />
                                                    {errors.city && <ValidationFeedback>{errors.city.message}</ValidationFeedback>}
                                                </InputGroup>
                                            </Col>
                                            <Col md="5">
                                                <Form.Label className="form__label">Country <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-2">
                                                    <Form.Control className="form__input" size="sm" type="text" name="country" ref={register({required: { message: "Please enter your country of residence.", value: true }})} />
                                                    {errors.country && <ValidationFeedback>{errors.country.message}</ValidationFeedback>}
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <FormBtn onClick={stepForwards} isDisabled={!isValid}>Continue</FormBtn>
                                    </section>
                                )}
                                {step >= 2 && (
                                    <section className={`${step === 2 ? "" : "hide"}`}>
                                        <div className="form__progress">
                                            <p className="form__label mb-2 mt-2">Guest Details</p>
                                            <p className="form__label mb-2 mt-2 pointer prev" title="Go back" onClick={stepBackwards}>Contact Information</p>
                                            <div><p className="form__label form__label--active mb-2 mt-2">Payment</p><i className="bi bi-arrow-down"></i></div>
                                        </div>
                                        <Form.Label className="form__label">Cardholder name <span className="form__label--required" title="Required field">*</span></Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control className="form__input" size="sm" type="text" name="card_name" ref={register({required: { message: "Please enter card holders full name.", value: true }, minLength: { message: "Name can't be shorter than 4 characters.", value: 4 }})}/>
                                                {errors.card_name && <ValidationFeedback>{errors.card_name.message}</ValidationFeedback>}
                                            </InputGroup>
                                        <Row>
                                            <Col md="6">
                                                <Form.Label className="form__label">Card Number <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-2">
                                                    <Form.Control className="form__input" size="sm" maxLength="12" type="tel" name="card" placeholder="xxxx xxxx xxxx" ref={register({required: { message: "Please enter your card number.", value: true }, minLength: { message: "Card number must consist of at least 12 numbers.", value: 12 }})}/>
                                                    {errors.card && <ValidationFeedback>{errors.card.message}</ValidationFeedback>}
                                                </InputGroup>
                                            </Col>
                                            <Col md="3">
                                                <Form.Label className="form__label">Security <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-2">
                                                    <Form.Control className="form__input" size="sm" maxLength="3" type="tel" name="security" placeholder="xxx" ref={register({required: { message: "Please enter your card's security code.", value: true }, minLength: { message: "Code must be at least 3 characters long.", value: 3 }})}/>
                                                    {errors.security && <ValidationFeedback>{errors.security.message}</ValidationFeedback>}
                                                </InputGroup>
                                            </Col>
                                            <Col md="3">
                                                <Form.Label className="form__label">Exp Year <span className="form__label--required" title="Required field">*</span></Form.Label>
                                                <InputGroup className="mb-2">
                                                    <Form.Control className="form__input" size="sm" maxLength="4" type="tel" name="year" placeholder="yyyy" ref={register({required: { message: "Please enter your card's expiration date.", value: true }, minLength: { message: "Year must be at least 4 characters long.", value: 4 }})}/>
                                                    {errors.year && <ValidationFeedback>{errors.year.message}</ValidationFeedback>}
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <InputGroup className="mb-2">
                                            <Form.Check className="form__input" size="md" name="terms" ref={register({required: { message: "Consent needed to complete transaction.", value: true }})} />
                                            <Form.Label className="form__label form__label--checkbox">I agree to the Terms of Service</Form.Label>
                                            {errors.terms && <ValidationFeedback>{errors.terms.message}</ValidationFeedback>}
                                        </InputGroup>
                                        <Button disabled={!isValid} type="submit" className="mt-4 button button__primary form__btn booking__btn--submit" title="Complete booking">{loading ? "Booking your stay... " : "Book now"}</Button>
                                    </section>
                                )}
                                <p className="form__submit--error">{reservationError}</p>
                            </fieldset> 
                        </Form>
                    </div>
                    <div className="split__box split__box--right">
                        <div className="split__box__section">
                            <p className="mb-2">Fill out the form to complete your reservation. </p>
                            <p className="mb-0">Rooms won't be reserved until booking is completed.</p>
                            <p className="mt-0">Upon completion you will receive a confirmation email with all the details.</p>
                        </div>
                        <div className="split__box__section">
                            <h2>Reservation summary</h2>
                            <div className={booking.length >= 2 ? "booking__container" : "booking__container overflow-hidden" }>
                                {booking ? booking.map(function (book) {
                                    return (
                                        <div key={book.bookingId} className="booking__item">
                                            <div className="booking__item__wrapper">
                                                <i className="bi bi-building"></i><h4 className="booking__item__wrapper--header">Staying in</h4>
                                                <p>{book.roomName}</p>
                                            </div>
                                            <div className="booking__item__wrapper">
                                                <i className="bi bi-people"></i><h4 className="booking__item__wrapper--header">Guests booked</h4>
                                                <p>{book.guests === 1 ? `${book.guests} person` : `${book.guests} people`}</p>
                                            </div>
                                            <div className="booking__item__wrapper">
                                                <i className="bi bi-calendar-date"></i><h4 className="booking__item__wrapper--header">Check-In / Check-Out</h4>
                                                <p>{book.startDate.substring(5).replace(/-/g, ".")} - {book.endDate.substring(5).replace(/-/g, ".")} <span className="float-none">({book.endDate.replace(/-/g, "") - book.startDate.replace(/-/g, "")} nights)</span></p>
                                            </div>
                                            <div className="booking__item__wrapper px-4">
                                                <h4 className="fw-bold fs-5 mt-2 d-block"> Total</h4>
                                                <p> $ {book.guests * book.roomPrice * (book.endDate.replace(/-/g, "") - book.startDate.replace(/-/g, ""))}</p>
                                            </div>
                                        </div>);
                                }): ""}
                            </div>
                        </div>
                    </div>
                </section>  
            </Col>
        );
    }

    let reservationError = "";

    if (error) {
        reservationError += "An error occurred when trying to book your stay, please try again.";
    }

    return (
        <>
            { booking.length >= 1 ? (renderForm()) : !confirmed ? 
                <>
                <PageTitle title="Reservation not found"/>
                    <BackgroundImage background="/graphics/images/nik-lanus-YMOHw3F1Hdk-unsplash.jpg" imageHeight="500" position="middle"></BackgroundImage>
                    <Col className="main__container__content p-lg-0 p-md-0 text-md-center" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
                        <section className="booking pt-4">
                            <h2 className="mb-4">No Reservations</h2> 
                            <p className="booking__text__section">We couldn't find any reservations, did you forget to add them? You can find your perfect stay through our wonderful partners found <Link className="text-link" to={`/accommodation`}>here</Link>.</p> 
                            <p className="booking__text__section mb-5">By booking your next stay through Holidaze you can earn special <span className="span__standout">guest rewards</span>, take advantage of our <span className="span__standout">customer satisfaction-guarantee</span> and be 
                                safe in your choice of accommodation thanks to our <span className="span__standout">customer-forward cancelation policy</span>.
                            </p>
                            <h3 className="mb-3 mt-5">Some of our most popular choices at the moment</h3>
                            <CarouselByType/>
                        </section>
                    </Col>
                </> : ""
            }{ confirmed && 
                <>
                    <PageTitle title="Reservation booked"/>
                    <BackgroundImage background="/graphics/images/spurwing-agency-sFjY4AWDYUI-unsplash.jpg" imageHeight="500" position="center"></BackgroundImage>
                    <Col className="main__container__content p-lg-0 p-md-0 text-md-center" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
                        <section className="booking pt-4">
                            <h2 className="mb-4">Stay Successfully Booked </h2> 
                            <p className="my-2 booking__text__section">Your booking went through and is now in processing. We will send you the <span className="span__standout"> reservation-conformation</span> to your email-address within 5-10 minutes.</p>
                            <p className="my-2 booking__text__section mb-5">Thank you for choosing us, we hope you will have a wonderful stay! Should you have any questions feel free to <Link className="text-link" to={`/contact-us`}>contact us</Link> anytime.</p>
                            <h3 className="mt-5">Plan your next stay -</h3>
                            <h3 className="mb-4">check out our visitors favorite places!</h3>
                            <CarouselByType/>
                        </section>
                    </Col>
                </>
            } 
        </>
    );
}
  
