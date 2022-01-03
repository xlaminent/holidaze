import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../data/apiData";
import useAxios from "../../hooks/useAxios";
import PageNotFound from "../../assets/PageNotFound";
import Loading from "../../assets/Loading";
import { PageTitle } from "../../hooks/useTitleChange";
import { Col } from "react-bootstrap";

export default function RenderEstablishmentByType() {
    const [filter, setFilter] = useState(""); 
    const navigate = useNavigate();
    const { type } = useParams();
    const { data: accommodations, loading, error } = useAxios("get", apiUrl + `establishments?type=${type}`, null);

    if (error) throw error; 
    if (loading) return <Loading/>
    if (accommodations.length === 0) return <> <PageTitle title={type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + "s"}/>
        <PageNotFound content={`There are no ${type}s available for the moment, please check back later or contact us directly.`} />
    </>;

    const handleFilterInput = event => {
        setFilter({ filter: event.target.value });
    };

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

                                {accommodation.availability === true ? <>
                                    <p>Available for booking</p>
                                    <button className="button button__primary items__item__buttons--button" onClick={() => navigate(`/accommodation/all/${accommodation.slug}`)} title={`Check available dates for ${accommodation.name}`}>Check Availability</button>
                                    </>:<>
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

    const accommodationSearch = filter ? filter.filter.toLowerCase() : "";

    const filteredData = accommodations.filter(accommodation => {
        return accommodation.name.toLowerCase().includes(accommodationSearch)
    });

    return (<>
        <PageTitle title={`${accommodations[0].type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}` + "s"}/>
        <div className="divider">
            <Col className="main__container__content p-lg-0 p-md-0 mb-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
                <h1 className="d-md-inline-block">all {type + "s"}
                    <span className="shout">
                        {filteredData.length === 0 ? "0 available" : filteredData.length >= 1 ? `${filteredData.length}  available` : `${filteredData.length} ${type}` + (filteredData.length > 1 ? "s" : "") + ` available`}
                    </span>
                </h1> 
                <div className="divider__sorting">
                    {accommodations.length >= 1 ? 
                    <div className="divider__sorting__input divider__sorting__input--search d-inline align-bottom">
                        <label className="shout align-baseline">Filter by name </label>{" "}
                        <div>
                            <input className="nav__searchbar--input" placeholder="Search.." value={filter ? filter.filter : ""} onChange={(e) => handleFilterInput(e)}  />
                            <i className="bi bi-search"></i>
                        </div>
                    </div> : ""}
                </div>
            </Col>
        </div>
        <Col className="main__container__content p-lg-0 p-md-0 mt-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <section className="items">
                {filteredData.length === 0 ? <p className="text-center pt-5">Found no available accommodations by that name, please try again.</p> : ""}
                {filteredData.length >= 1 ? filteredData.map(renderAccommodations) : ""}
            </section>   
        </Col>
    </>);
}

