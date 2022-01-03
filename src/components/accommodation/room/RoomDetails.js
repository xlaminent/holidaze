import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGraphQl from "../../../hooks/useGraphQl";
import { PageTitle } from "../../../hooks/useTitleChange";
import PageNotFound from "../../../assets/PageNotFound";
import generateLongId from "../../../assets/GeneratedId";
import dateFormatter from "../../../assets/FormatDate";
import Loading from "../../../assets/Loading";
import RoomGallery from "./RoomGallery";
import RoomExtras from "./RoomExtras";
import { Form, Col, InputGroup } from "react-bootstrap";

export default function RoomDetails(props) {
    const { slug, roomSlug } = useParams();
    const { data: accommodation,  loading, error} = useGraphQl(slug, roomSlug);
    const [guests, setNumberOfGuests] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();

    if (loading) return <Loading/>
    if (accommodation.rooms.length === 0) return <PageNotFound content="Couldn't find any room by that name." />;
    if (error) throw error;

    const todaysDate = new Date();
    const formattedDate = todaysDate.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit'}).split(" ");
    const nextDayDate = startDate ? dateFormatter(+startDate + 86400000) : dateFormatter(todaysDate.getTime()+ 86400000);
    
    return ( <>
        {accommodation.rooms.map(function (room) {
            let beds = [];
            room.beds.forEach(bed => {
                beds = <p className="text-capitalize">Beds: {bed.name} (fits {bed.space} {bed.space > 1 ? " people" : " person"})</p>
        });

        return ( <>
            <PageTitle title={room.name}/>
    
            <Col className="main__container__content p-lg-0 p-md-0 mt-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>   
                <section className="est">
                    <div className="est__section">
                        <div className="est__section__middle">
                            <div className="est__section__middle--details">
                                <div className="split">
                                    <div className="split__box split__box--left">
                                        <h2>{room.name}</h2>
                                        <p className="mt-4">{room.description}</p>
                                        {beds}

                                        <div className="split__box split__box--middle">
                                            <div className="mt-3">
                                                <h3 className="text-uppercase">room amenities</h3>
                                                <ul className="text-capitalize"><RoomExtras list={room.accommodations}/></ul>
                                            </div>
                                            <div className="mt-3">
                                                <h3 className="text-uppercase mt-4">Always included</h3>
                                                <ul>
                                                    {accommodation.type === "hotel" || accommodation.type === "resort" ? <>
                                                            <li>Gourmet Breakfast</li>
                                                            <li>Access to Gym </li>
                                                            <li>Water & Snack</li>
                                                            <li>Shoeshine</li>
                                                            <li>Free WIFI</li>
                                                        </> : <>
                                                            <li>Check-in with host</li>
                                                            <li>Coffee, Tea and Water</li>
                                                            <li>Washing Machine</li>
                                                            <li>Free WIFI</li>
                                                        </>
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="split__box split__box--right">
                                        <div className="split__box__section mb-0 d-block text-start">
                                            <Form className="form__section" > 
                                                <fieldset disabled={loading}>
                                                    <h2>Book this room</h2>
                                                    <div className="w-100 px-0 py-0 mt-3">
                                                        <Form.Label className="form__label shout">Guests</Form.Label>
                                                        <InputGroup className="mb-2 px-0 py-0">
                                                            <Form.Select className="form__input w-100" size="sm" value={guests} required onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}>
                                                                <option value="">...</option>
                                                                    {room.capacities.map((cap) => (
                                                                        <option key={cap.guests} value={cap.guests}>{cap.guests > 1 ? cap.guests + " people" : cap.guests + " person"}</option>))}
                                                            </Form.Select>
                                                        </InputGroup>
                                                    </div>
                                                    <div className="form__split w-100 mt-3">
                                                        <div>
                                                            <Form.Label className="form__label shout">Check-in</Form.Label>
                                                            <InputGroup className="mb-2 w-100" title={!guests ? "Select guests first" : "Pick a checkin date"}>
                                                                <Form.Control size="sm" disabled={!guests} type="date" className="form__input" required min={formattedDate} max="2022-01-31" onChange={(e) => setStartDate(e.target.valueAsDate)}/>
                                                            </InputGroup>
                                                        </div>
                                                        <div>
                                                            <Form.Label className="form__label shout">Check-out</Form.Label>
                                                            <InputGroup className="mb-2 w-100" title={!startDate ? "Pick checkin date first" : "Pick a checkout date"}>
                                                                <Form.Control size="sm" disabled={!startDate} type="date" required min={nextDayDate} max="2022-01-31" onChange={(e) => setEndDate(e.target.value)}/>
                                                            </InputGroup>
                                                        </div>
                                                    </div>
                                                    <div className="form__buttons w-100 px-0">
                                                        <button disabled={!endDate || !guests || !startDate} type="button" className="button button__primary mt-4 mb-0 form__btn" onClick={() => {props.addBooking(generateLongId(), room.id, room.name, room.price, slug, roomSlug, guests, dateFormatter(startDate), endDate); navigate("/book-accommodations")}} title={!endDate || !startDate ? "Pick dates and guests first" : "Book this room"}>{loading ? "Booking... " : "Book Room"}</button>
                                                    </div>
                                                </fieldset>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="est__section__middle--images push-sm mt-4">
                                <h3>Room Gallery</h3>
                                <div className="gallery">
                                    <RoomGallery galleryImages={room.gallery} />
                                </div>                        
                            </div>
                        </div>
                    </div>
                </section>
            </Col>
        </>)})}
    </>);
}