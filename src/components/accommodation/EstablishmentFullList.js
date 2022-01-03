import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../data/apiData";
import useAxios from "../../hooks/useAxios";
import PageNotFound from "../../assets/PageNotFound";
import Loading from "../../assets/Loading";
import { PageTitle } from "../../hooks/useTitleChange";
import { Col } from "react-bootstrap";

export default function EstablishmentList() {
    const [types, setType] = useState(""); 
    const navigate = useNavigate();
    const { data: accommodations, loading, error } = useAxios("get", apiUrl + "establishments", null);

    if (error) throw error; 
    if (loading) return <Loading/>
    if (accommodations.length === 0) return <PageNotFound content="Couldn't find any accommodations." />;

    const handleOnclick = (event, accommodationId, accommodationName) => {
        event.preventDefault();
        navigate('/enquiry',
            {state: { accommodationId, accommodationName}}
        )
    };

    function renderAccommodations(accommodation) {
        return  <div className="items__item" key={accommodation.id}>
                    <div className="items__item__part items__item__part--right">
                        <div className="items__item__img">
                            <img src={`${apiUrl}${accommodation.default_img.url.substring(1)}`} alt={accommodation.name}/>
                        </div>
                    </div>
                    <div className="items__item__part items__item__part--left">
                        <div className="items__item__heading">
                            <p>{accommodation.name}</p>
                            <span className="items__item__heading--map"><i className="bi bi-geo-alt-fill"></i>{accommodation.address}</span>
                        </div>

                        <div className="d-block">
                            <p>{accommodation.short_description}</p>
                            <div className="items__item__tags mb-4">
                                <div>
                                    {accommodation.pet_friendly === true ? <span className="items__item__tags--tag">Pet Friendly</span> : ""}
                                    {accommodation.store === true ? <span className="items__item__tags--tag">In-House Store</span> : ""}
                                    {accommodation.rental_services === true ? <span className="items__item__tags--tag">Rental Services</span> : ""}
                                    {accommodation.concierge === true ? <span className="items__item__tags--tag">Concierge</span> : ""}
                                    {accommodation.room_service === true ? <span className="items__item__tags--tag">Room Service</span> : ""}
                                </div>
                            </div>

                            <div className="items__item__buttons mb-4">  
                                <input type="hidden" name="accommodationId" defaultValue={accommodation.id} />
                                <input type="hidden" name="accommodationName" defaultValue={accommodation.name}/>

                                {accommodation.availability === true ? 
                                    <>
                                        <p>Available for booking</p>
                                        <button className="button button__primary items__item__buttons--button" onClick={() => navigate(`/accommodation/all/${accommodation.slug}`)} title={`Check available dates for ${accommodation.name}`}>Check Availability</button>
                                    </>
                                    : 
                                    <>
                                        <p className="mb-0">Not available for booking </p>
                                        <span>You can send an enquiry to <b>{accommodation.name}</b> <span className="text-link" onClick={(event) => handleOnclick(event, accommodation.id, accommodation.name)}>here</span>.</span>
                                        <button className="button button__secondary items__item__buttons--button mt-3" onClick={() => navigate(`/accommodation/all/${accommodation.slug}`)} title={`Go to ${accommodation.name}`}>Visit Page</button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
    } 

    let filterType;

    if (accommodations) {
        filterType = types ? accommodations.filter((t) => t.type === types) : accommodations;
    }

    return (<>
            <PageTitle title="All Accommodations"/>
            <div className="divider">
                <Col className="main__container__content p-lg-0 p-md-0 mb-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
                    <h1 className="d-md-inline-block">all accommodations 
                        <span className="shout">
                            {filterType.length === 0 ? "0 available" : filterType.length >= 1 && types === "" ? `${filterType.length}  available` : `${filterType.length} ${types}` + (filterType.length > 1 ? "s" : "") + ` available`}
                        </span>
                    </h1> 
                    <div className="divider__sorting">
                        {accommodations.length >= 1 ? 
                        <div className="divider__sorting__input d-inline align-bottom">
                            <label className="shout">Filter by type </label>{" "}
                            <select value={types} onChange={(event) => setType(event.target.value)}>
                                <option value="">All types</option>
                                <option value="resort">Resort</option>
                                <option value="bed-breakfast">B & B</option>
                                <option value="guesthouse">Guesthouse</option>
                                <option value="hotel">Hotel</option>
                            </select>
                        </div> : ""}
                    </div>
                </Col>
            </div>
            <Col className="main__container__content p-lg-0 p-md-0 mt-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
                <section className="items">
                    {filterType.length === 0 ? <p className="text-center pt-5">Found none available accommodations by that type, please try another type.</p> : ""}
                    {filterType.length >= 1 ? filterType.map(renderAccommodations) : ""}
                </section>   
            </Col>
    </>);
}

