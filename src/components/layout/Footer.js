import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <Row className="justify-content-md-center footer__container" >
                  <div className="text-left footer__section footer__first">
                      <div className="footer__section--part">
                        <p className="footer__heading">Holidaze</p>
                        <div className="footer__content">
                            <p className="footer__detail">Second street 43</p>
                            <p className="footer__detail">Bergen, 5003</p>
                        </div>
                        <div className="footer__content">
                            <p className="footer__detail mt-3">Reservations</p>
                            <p className="footer__detail">+41 264 432 531</p>
                   
                        </div>
                        <div className="footer__content">
                            <p className="footer__detail mt-3">contact@holidaze.com</p>     
                        </div>    
                      </div>
                      <div className="footer__section--part">
                        <p className="footer__heading">Information</p>
                        <p className="footer__detail">About Us</p>
                        <p className="footer__detail"><Link className="footer__detail--link" to="/enquiry">Enquiries</Link></p>
                        <p className="footer__detail">FAQs</p>
                        <p className="footer__detail">Accessibility</p>
                        <p className="footer__detail">Career</p>
                      </div>
                      <div className="footer__section--part">
                        <p className="footer__heading">Connect</p>
                        <p className="footer__detail pointer"><i className="bi bi-twitter footer__icon"></i> Twitter</p>
                        <p className="footer__detail pointer"><i className="bi bi-instagram footer__icon"></i> Instagram</p>
                        <p className="footer__detail pointer"><i className="bi bi-facebook footer__icon"></i> Facebook</p>
                      </div>
                  </div>
                  <div className="text-center hidden-md footer__section footer__middle">
                      <div className="footer__section--logo">
                        <Link to="/"><img src="/graphics/logo_tall.svg" alt="Holidaze Logo"/></Link>
                      </div>
                  </div>
                  <div  className="footer__section footer__box">
                    <p className="footer__heading">Join Our Newsletter</p>
                    <p className="footer__detail">Get the best deals right to your email!</p>
                    <form className="form__section footer__form mt-2"> 
                        <input size="sm" type="email" placeholder="Your email address.."/>
                        <button size="sm" type="submit" title="Sign up for newsletter">Subscribe</button>
                    </form>
                  </div>
            </Row>
        </footer>
    )
}

export default Footer;