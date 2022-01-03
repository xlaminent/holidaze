import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../data/apiData";
import useAxios from "../../hooks/useAxios";
import Loading from "../../assets/Loading";
import BackgroundImage from "../layout/BackgroundImg";
import { Form, InputGroup } from "react-bootstrap";
import dateFormatter from "../../assets/FormatDate";

export default function FullPageBackground() {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const { data: accommodations, loading, error } = useAxios("get", apiUrl + `establishments?type=resort`, null);

    if (error) throw error; 
    if (loading) return <Loading/>

    const todaysDate = new Date();
    const formattedDate = todaysDate.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit'}).split(" ");
    const nextDayDate = startDate ? dateFormatter(+startDate + 86400000) : dateFormatter(todaysDate.getTime()+ 86400000);

    function renderPromoItem(promo) {
        return (
            <section className="background background__fp" key="background-promo">
                <div className="background__promo background__promo__text">
                    <div>
                        <h1>{promo.name}</h1>
                        <p>{promo.tagline}</p>
                        <p>{promo.short_description}</p>
                    </div>
                </div>   
                   
                <div className="background__promo background__promo__img">
                    <BackgroundImage background={`${apiUrl}${promo.default_img.url.substring(1)}`} imageHeight="740" position="middle" alt={promo.name}></BackgroundImage>
                </div>
                <div className="background__sm">
                    <h1>{promo.name}</h1>
                    <p>{promo.tagline}</p>
                    <button type="button" className="button button__primary my-0 mx-0 text-uppercase" onClick={() => navigate(`/accommodation/all/${promo.slug}`)} title="Check Availability">Check Availability</button>
                </div>        
                <div className="background__dates">
                    <div className="background__dates__inputs d-md-inline">
                        <Form className="form__section w-100" > 
                            <fieldset disabled={loading}>
                                <div className="d-inline-block"> 
                                    <Form.Label className="form__label shout">Check-in</Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control size="sm" type="date" className="form__input" required min={formattedDate} max="2022-01-31" onChange={(e) => setStartDate(e.target.valueAsDate)}/>
                                    </InputGroup>
                                </div>
                                <div className="d-inline-block">
                                    <Form.Label className="form__label shout">Check-out</Form.Label>
                                    <InputGroup className="mb-2" title={!startDate ? "Check-in date missing" : ""}>
                                        <Form.Control size="sm" disabled={!startDate} type="date" required min={nextDayDate} max="2022-01-31" onChange={(e) => setEndDate(e.target.value)}/>
                                    </InputGroup>
                                </div>
                            </fieldset>
                        </Form>
                    </div>
                    <div className="background__dates__btn d-md-inline text-end">
                        <button disabled={!endDate || !startDate} type="button" className="button button__primary my-0 mx-0" onClick={() => navigate(`/accommodation/all/${promo.slug}`)} title={!endDate || !startDate ? "Pick dates first" : "Check Availability"}>{loading ? "Checking... " : "Check Availability"}</button>
                    </div>
                </div>
            </section>
        );
    }

    return (<>
        {accommodations.length === 0 ? "" : <> {accommodations.slice(0, 1).map(renderPromoItem)}</>}
    </>);
}