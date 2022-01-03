import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AccessContext from "../../context/AccessContext";
import AccessModal from "../access/AccessModal";
import EstablishmentSearch from "../accommodation/EstablishmentSearch";

function MainNavigation() {
    const [auth,] = useContext(AccessContext);
    const [open, toggleOpen] = useState(false);
    const [show, setShowSearch] = useState(false);

	function toggleMenu() {
		toggleOpen(!open);
	}

    function toggleSearch() {
        setShowSearch(!show);
    }
	return (
        <nav className="nav container-fluid" {...(show ? { onMouseLeave: () => toggleSearch() }: undefined)}>
            <div className="nav__top nav__list">
                <div className="nav__top__logo">
                    <Link to="/"><img src="/graphics/logo_flat.svg" className="nav__top__logo--img" alt="Holidaze Logo"/></Link>
                </div>

                <ul className="nav__top__list">
                    <li className="nav__top__list__link hidden-sm"><Link className="nav__link nav__link--top" title="Contact us" to="/contact-us">Contact</Link></li>
                    {auth ? (<li className="nav__top__list__link hidden-sm"><Link className="nav__link nav__link--top" to="/admin">Admin</Link></li>) : (<></>) }
                    <AccessModal/>
                    <li className="nav__top__list__link hidden-sm"><Link className="button button__nav" to="/book-accommodations">Reservations</Link></li>
                </ul>
                <i className={`nav__top__menu--btn show-sm hide pointer bi ${open  ? "bi-x" : "bi-list"}`} onClick={toggleMenu}></i>
            </div>
            
            <div className={`nav__main nav__list ${open ? "" : "hidden-sm"}`}>
                <Link className="button button__nav show-sm hide" to="/book-accommodations" onClick={toggleMenu}>Reservations</Link>
                <ul className="nav__primary">
                    <li className="nav__primary__link"><Link className="nav__link" onClick={() => toggleMenu()} {...(show ? { onClick: () => toggleSearch() }: undefined)} to="/accommodation">All Accommodations</Link></li>
                    <li className="nav__primary__link"><Link className="nav__link" onClick={() => toggleMenu()} {...(show ? { onClick: () => toggleSearch() }: undefined)} to="/accommodation/hotel">Hotels</Link></li>
                    <li className="nav__primary__link"><Link className="nav__link" onClick={() => toggleMenu()} {...(show ? { onClick: () => toggleSearch() }: undefined)} to="/accommodation/resort">Resorts</Link></li>
                    <li className="nav__primary__link"><Link className="nav__link" onClick={() => toggleMenu()} {...(show ? { onClick: () => toggleSearch() }: undefined)} to="/accommodation/bed-breakfast">B & B's</Link></li>
                    <li className="nav__primary__link"><Link className="nav__link" onClick={() => toggleMenu()} {...(show ? { onClick: () => toggleSearch() }: undefined)} to="/accommodation/guesthouse">Guesthouses</Link></li>
                </ul>
                <i className="bi bi-search hidden-sm pointer" onClick={toggleSearch}></i>

                <ul className="nav__extras pb-4">
                    <li className="nav__top__list__link"><Link className="nav__link" onClick={toggleMenu} to="/contact-us">Contact Us</Link></li>
                    {auth ? (<li className="nav__top__list__link"><Link className="nav__link" onClick={toggleMenu} to="/admin">Administrator Panel</Link></li>) : (<></>) }
                </ul>
                <div className="nav__searchbar nav__searchbar--md" onMouseLeave={() => toggleSearch()}>
                    <EstablishmentSearch toggleSearch={toggleSearch}/>
                </div>
            </div>
            <div className={`nav__searchbar nav__searchbar--lg hidden-sm ${show ? "nav__searchbar--show" : ""}`}>
                <EstablishmentSearch toggleSearch={toggleSearch}/>
            </div>
        </nav>
	);
}

export default MainNavigation;