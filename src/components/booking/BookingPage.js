import React from "react";
import { useNavigate } from "react-router-dom";
import BookingList from "./BookingList";
import { PageTitle } from "../../hooks/useTitleChange";
import { Col } from "react-bootstrap";

export default function Booking(props) {
    const { booking, removeBooking } = props;
    const navigate = useNavigate();

    function reservationValid() {
        return (
            <button type="button" className="button button__primary booking__btn booking__btn--submit" onClick={() => navigate("/book-accommodations/reservation")}>Continue</button>
        );
    }
    
    return (
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <PageTitle title="Complete your reservation"/>
            <h1 className="text-md-center">Reservations</h1>
            <BookingList booking={booking} removeBooking={removeBooking}/>
            {booking.length >= 1 ? (reservationValid()) : "" }
        </Col>
    );
}
