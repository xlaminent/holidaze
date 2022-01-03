import React, { useState } from "react";
import { apiUrl } from "../../data/apiData";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";

export default function EstablishmentSearch(props) {
    const [search, setSearch] = useState(""); 
    const { data: accommodations, error } = useAxios("get", apiUrl + "establishments", null);
    const navigate = useNavigate();
    const { toggleSearch } = props;

    if (error) throw error; 

    const handleSearchInput = event => {
        setSearch({ search: event.target.value });
        document.querySelector(".searches__error").style.display = "block";
    };

    const closeSearch = () => {
        setSearch("");
    };

    const accommodationSearch = search ? search.search.toLowerCase() : "";

    let searchableData; 
    let noSearchMatch;

    if (accommodationSearch === "") {
        searchableData = [];
    } else {
        searchableData = accommodations.filter(accommodation => {
            return accommodation.name.toLowerCase().includes(accommodationSearch);
        });
    }

    if (accommodationSearch !== "" && searchableData.length === 0) {
        noSearchMatch = "Couldn't find any accommodations matching that name.";
    }

    const clearSearch = () => {
        document.querySelector(".nav__searchbar--input").value = "";
        document.querySelector(".searches__error").style.display = "none";
    };

    return (<>
        <div className="nav__searchbar--container ">
            <p>Search for accommodations by name</p>
            <input className="nav__searchbar--input" placeholder="Search.." value={search ? search.search : ""} onBlur={() => clearSearch()} onChange={(e) => handleSearchInput(e)} />
            <i className="bi bi-search"></i>
        </div>
        <div className="searches">                                                                                       
            <p className="searches__error">{noSearchMatch}</p>
            {searchableData.map(accommodation => (
                <div key={accommodation.id} title={`Continue to ${accommodation.name}`} className="searches__card pointer" onClick={() => {navigate(`accommodation/search/${accommodation.slug}`); toggleSearch(); closeSearch();}}>
                    <div className="searches__card--img">
                        <img src={`${apiUrl}${accommodation.default_img.url.substring(1)}`} alt={accommodation.name}/>
                    </div>
                    <div className="searches__card--desc">
                        <p>{accommodation.name}</p>
                    </div>
                    <div className="searches__card--availability">
                        <p>{accommodation.availability === true ? "Available Rooms": "No Availability"}</p>
                        {accommodation.availability === true ?  <button className="button button__primary" title={`Check available dates for ${accommodation.name}`}>Check Dates</button> : <button className="button button__secondary" title={`Go to ${accommodation.name}`}>Visit Page</button>}
                    </div>
                </div>
            ))}
        </div>
    </>);
}
