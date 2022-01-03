import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../../data/apiData";
import useGraphQl from "../../hooks/useGraphQl";
import PageNotFound from "../../assets/PageNotFound";
import renderRoomData from "../accommodation/room/RoomRender";
import Loading from "../../assets/Loading";
import { PageTitle } from "../../hooks/useTitleChange";
import EstablishmentGallery from "./EstablishmentGallery";
import { Col } from "react-bootstrap";
import BackgroundImage from "../layout/BackgroundImg";

export default function EstablishmentDetails() {
    const [size, setOccupancySize] = useState(""); 
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: availability, loading, error} = useGraphQl(slug, null);

    if (loading) return <Loading/>
    if (!availability) return <PageNotFound content="Couldn't find any establishment by that name." />;
    if (error) throw error;

    let filterBySize;

    if(availability.rooms) {
        filterBySize = size ? availability.rooms.filter((occupancy) => occupancy.beds.find((roomSpace) => roomSpace.space === parseInt(size))) : availability.rooms;
    }

    const handleOnclick = (event, accommodationId, accommodationName) => {
        event.preventDefault();
        navigate('/enquiry',
            {state: { accommodationId, accommodationName}}
        )
    };
  
    return (<>
        <PageTitle title={availability.name}/>
        <section className="background">
            <BackgroundImage background={`${apiUrl}${availability.default_img.url.substring(1)}`} imageHeight="740" position="middle" alt={availability.name}></BackgroundImage>
            <div className="background__content">
                <h1>{availability.name}</h1>
                <span className="items__item__heading--map"><i className="bi bi-geo-alt-fill"></i>{availability.address}</span>
            </div>
        </section>
        <Col className={`main__container__content p-lg-0 p-md-0 ${availability.rooms.length === 0 ? "mt-0" : "my-0"}`} md={{ span: 10, offset: 1 }} sm={{span: 12}}>   
            <section className="est">
                <section className="est__section">
                    <section className="est__section__top text-md-center">
                        {availability.pool === true ? <p>Pool</p> : ""}
                        {availability.gym === true ? <p>Gym</p> : ""}
                        {availability.spa === true ? <p>Spa</p> : ""}
                        {availability.playroom === true ? <p>Playroom</p> : ""}
                    </section>
                    <section className="est__section__middle push-sm">
                        <div className="est__section__middle--details">
                            <div className="split">
                                <div className="split__box split__box--left">
                                    <h2 className="mb-3">{availability.tagline}</h2>
                                    <p>{availability.short_description}</p>
                                    <p>{availability.long_description}</p>
                                    <div className="split__box split__box--middle">
                                        <div>
                                            <h3 className="text-uppercase mt-4">Services provided</h3>
                                            <ul>
                                                {availability.pet_friendly === true ? <li>Pet Friendly</li> : ""}
                                                {availability.store === true ? <li>In-House Store</li> : ""}
                                                {availability.rental_services === true ? <li>Rental Services</li> : ""}
                                                {availability.concierge === true ? <li>Concierge</li> : ""}
                                                {availability.room_service === true ? <li>Room Service</li> : ""}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="split__box split__box--right">
                                    <div className={`split__box__section mb-0 ${availability.type === "hotel" || availability.type === "resort" ? "" : "d-block"}`}>
                                        <div>
                                            <i className="bi bi-calendar-check"></i>
                                            <p className="shout ">Check-in / Out</p>
                                            <p className="d-inline">After 3:00 PM / </p>
                                            <p className="d-inline">Before 13:00 PM</p>
                                        </div>
                                        {availability.type === "hotel" || availability.type === "resort" ? <>
                                                <div>
                                                    <i className="bi bi-cup"></i>
                                                    <p className="shout">Breakfast</p>
                                                    <p className="d-inline">Every day </p>
                                                    <p className="d-inline">7:00 - 11:30 PM</p>
                                                </div>
                                            </> : ""}
                                    </div>
                                    <div className="split__box__section text-center">
                                        <input type="hidden" name="accommodationId" defaultValue={availability.id} />
                                        <input type="hidden" name="accommodationName" defaultValue={availability.name}/>
                                        <h3 className="text-uppercase">Get in touch</h3>
                                        <button className="button button__primary items__item__buttons--button d-inline-block w-75" onClick={(event) => handleOnclick(event, availability.id, availability.name)} title={`Send an enquiry to ${availability.name}`}>Send enquiry</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="est__section__middle--images">
                            <h3>Gallery</h3>
                            <div className="gallery ">
                                <EstablishmentGallery galleryImages={availability.images} />
                            </div>                        
                        </div>
                    </section>
                </section>
            </section>
        </Col>

        <div className="divider">
            <Col className="main__container__content p-lg-0 p-md-0 mb-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
                <h1 className="d-md-inline-block">Rooms
                    <span className="shout">
                        {filterBySize.length === 0 ? "0 available rooms" : filterBySize.length === 1 ? `${filterBySize.length} available room` : `Found ${filterBySize.length} available rooms`}
                    </span>
                </h1> 
                <div className="divider__sorting">
                    {availability.rooms.length >= 1 ? 
                        <div className="divider__sorting__input d-inline align-bottom">
                            <label className="shout">Filter by type </label>{" "}
                            <select value={size} onChange={(event) => setOccupancySize(event.target.value)}>
                                <option value="">All rooms</option>
                                <option value="1">Standard</option>
                                <option value="2">Double</option>
                                <option value="3">Double Plus</option>
                                <option value="4">Family</option>
                                <option value="5">Family Suite</option>
                                <option value="6">Superior</option>
                            </select>
                        </div>
                    : ""}
                </div>
            </Col>
        </div>
        {availability.rooms.length === 0 ? "" :  
            <Col className="main__container__content p-lg-0 p-md-0 mt-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
                <section className="items">
                        {filterBySize.length === 0 ? <p className="text-center pt-5">Found none available rooms by that type, please try another type.</p> : ""}
                        {filterBySize.length >= 1 ? filterBySize.map(renderRoomData) : ""}
                </section>   
            </Col>
        }
    </>);
}

