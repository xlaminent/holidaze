import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import AccessContext from "../../context/AccessContext";
import LoginForm from "./login/LoginForm";

export default function AccessModal() {
    const [open, display] = useState(false);
    const [auth, setAuth] = useContext(AccessContext);
    const navigate = useNavigate();

    const closeModal = () => {
        display(false);
    };

    const showModal = () =>  {
        display(true);
    }

    function logout() {
		setAuth(null);
		navigate("/");
	}

    return (<>
        {auth ? 
            (<li className="nav__top__list__link" onClick={logout} title="Logout of account"><span className="nav__link nav__link--top">Logout</span></li>) 
        : 
            (<li className="nav__top__list__link" title="Login to account"><span onClick={showModal} className="nav__link nav__link--top">Login</span></li>)
        }
        <Modal centered show={open} onHide={closeModal} animation={false} className="modal">
            <Modal.Header>
                <h1 className="modal__heading">Log in</h1>
                <i className="bi bi-x-circle-fill modal__heading--icon" onClick={closeModal} title="Close"></i>
            </Modal.Header>
            <Modal.Body className="pt-0"> 
                <LoginForm closeModal={closeModal}/>
            </Modal.Body>
        </Modal>
    </>);
}