import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useGraphQlMultiple from "../../hooks/useGraphQlMultiple";
import Loading from "../../assets/Loading";
import { Form, Col, InputGroup } from "react-bootstrap";

export default function BookingList(props) {
    const { booking, removeBooking } = props;
    const [clicked, setClicked] = useState(false);

    const slugs = booking.map((room) => {
        return { 
            accommodationSlug: room.slug,
            roomSlug: room.roomSlug,
            guests: room.guests,
            roomId: room.roomId,
            reservedId: room.bookingId,
            startDate: room.startDate,
            endDate: room.endDate
        };
    });

    const { data: reservations, loading, error } = useGraphQlMultiple(slugs);

    if (loading) return <Loading/>
    if (error) throw error;

    function renderItem(itemInBooking) {
        const room = itemInBooking.rooms[0];
        const slug = slugs.find(slug => {
            return itemInBooking.slug === slug.accommodationSlug && room.slug === slug.roomSlug;
        });

        if (slug === undefined ) { return (<></>) }

        const guests = slug.guests;
        const roomName = room.name;
        const roomCapacity = room.beds[0].space;
        const roomPrice = room.price;
        const accommodation = itemInBooking.name;
        const accommodationSlug = itemInBooking.slug;
        const generatedBookingId = slug.reservedId;
        const stayFrom = slug.startDate;
        const stayTo = slug.endDate;

        return (
            <div className="booking__overview__list--item" key={generatedBookingId}>
                <Col md="8" sm="12" className="booking__col booking__detail d-inline-block position-relative">
                    <h3 className="text-uppercase">{roomName}</h3>
                    <div className="booking__iconbar">
                        <div className="booking__iconbar--icon" title="Guests reserved for">
                            <i className="bi bi-people-fill fs-5"></i>
                            <span> <b>Selected {guests}</b></span>
                        </div>
                        <div className="booking__iconbar--icon" title="Max occupancy">
                            <i className="bi bi-people fs-5"></i>
                            <span> Capacity {roomCapacity}</span>
                        </div>
                    </div>
                    <div className="booking__detail--summary">
                        <p>Reservation is for {stayFrom.substring(5).replace(/-/g, ".")} to {stayTo.substring(5).replace(/-/g, ".")}.</p>
                        <p>Room price per night $ {roomPrice}, per adult.</p>
                        <p>Price comes to <b>$ {guests * roomPrice * (stayTo.replace(/-/g, "") - stayFrom.replace(/-/g, ""))}</b> total for <b>{stayTo.replace(/-/g, "") - stayFrom.replace(/-/g, "")} nights.</b></p>
                    </div>
                    <button className="button button__secondary booking__btn booking__btn--delete" title="Remove room" onClick={() => removeBooking(generatedBookingId)}></button>
                </Col>                
                <Col md="4" sm="12" className="booking__col booking__hotel d-inline-block">
                    <h3 className="d-block mb-2">{accommodation}</h3>
                    <Link to={`/accommodation/all/${accommodationSlug}`}><p className="booking__hotel__contact d-md-inline-block" title="Go to accomodation page">Get In Touch</p><br/></Link>
                    <Col className="d-inline w-50 float__left mt-md-4">
                        <span className="fw-bold d-block">Check-in</span>
                        <span>After 3:00 PM</span>
                    </Col>
                    <Col className="d-inline w-50 float__left mt-md-4">
                        <span className="fw-bold d-block">Check-out</span>
                        <span>Before 12:00 PM</span>
                    </Col>
                </Col>
            </div>
        );
    }
    
    function showError() {
        setClicked({ clicked: true });
    }

    const guestsBooked = booking.reduce((total, resItem) => total + parseInt(resItem.guests), 0);

    let totalPrice = 0;

    if (guestsBooked > 0 ) {
        reservations.forEach((reservation) => { 
            const bookingItem = booking.find(resItem => resItem.slug === reservation.slug && resItem.roomSlug === reservation.rooms[0].slug);

            if (bookingItem) {
                totalPrice += + bookingItem.guests * reservation.rooms[0].price;
            }
        })
    } 

    function emptyBooking() {
        return (
            <section className="split d-inline-block">
                <div className="split__box split__box--left">
                    <h2 className="pb-2">Book your next dream stay</h2> 
                    <p className="booking__text__section fs-6">By booking through Holidaze you'll be eligible to earn special <span className="span__standout">guest rewards</span>, take advantage of our 
                        <span className="span__standout"> stay-satisfaction guarantee</span> and be safe in your choice of accommodation 
                        thanks to our <span className="span__standout">customer-forward cancelation policy</span>.
                    </p>
                </div>
                <div className="split__box split__box--right push-sm">
                    <h2 className="pb-2 text-capitalize">Find your reservation</h2>
                    <p className="text-muted pb-2 text-sm">The reservation code is listed in the confirmation email received after booking.</p>
                    <Form className="form form__section"> 
                        <fieldset>
                            <Form.Label className="form__label">Email Address</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text className="form__info" title="Enter your email address">
                                    <i className="bi bi-at px-1"></i>
                                </InputGroup.Text>
                                <Form.Control className="form__input" size="lg" type="email"/>
                            </InputGroup>

                            <Form.Label className="form__label">Reservation Code</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="form__info" title="Enter your reservation code">
                                    <i className="bi bi-hash px-1"></i>
                                </InputGroup.Text>
                                <Form.Control className="form__input" size="lg" type="text" />
                            </InputGroup>
                            <button type="button" size="sm" onClick={showError} className="mt-4 mb-4 form__btn button button__primary " title="Find reservation">Search</button>
                        </fieldset>
                    </Form>
                    <p className={`form__submit--error ${clicked ? "" : "hide"}`}>
                        Couldn't find any reservations matching that reservation code or your email. Please try again or contact us <Link className="text-link" to={`/contact-us`}>here</Link>.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="booking">
            {guestsBooked > 0 ? 
                <div className="booking__summary">
                    <h2 className="pb-2">{`Selected ${booking.length === 1 ? "room" : "rooms"}`}</h2> 
                    <span className="booking__summary__link float__right" title="Back to available accommodations">
                        <Link to={`/accommodation/`}><i className="bi bi-plus-circle-dotted"></i><p className="text-link mx-0">Add another room</p></Link>
                    </span>
                    <div className="booking__overview">
                        <div className="booking__overview__list">{reservations.map(renderItem)}</div>
                    </div>

                    <div className="booking__slip">
                        <p>{guestsBooked === 0 ? (emptyBooking()) : 
                            `This reservation will be for a total of ${guestsBooked} ${guestsBooked > 1 ? "guests" : "guest"} at ${reservations.length} ${reservations.length > 1 ? "different accommodations" : "accommodation"}.`}
                        </p>
                        {guestsBooked > 0 && <p>The price per night per guest comes to  <b>${totalPrice.toFixed(2)}</b>.</p>}
                    </div>
                </div>
                : emptyBooking()
            }
        </section> 
    );
}
