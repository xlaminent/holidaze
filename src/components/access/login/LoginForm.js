import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../../data/apiData";
import AccessContext from "../../../context/AccessContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ValidationFeedback from "../../../assets/ValidationFeedback";
import { Form, InputGroup } from "react-bootstrap";

const schema = yup.object().shape({
    identifier: yup.string().required("Please enter your email.").email("Please enter a valid email address."),
    password: yup.string().required("Please enter your password.")
});

export default function LoginForm(props) {
    const { closeModal } = props;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [auth, setAuth] = useContext(AccessContext);

    const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(schema),
	});

    async function onSubmit(data) {
		setLoading(true);
		setError(null);

		try {
            const response = await axios.post(apiUrl + "auth/local/", data);
            setAuth(response.data);
			closeModal();
		} catch (error) {
			setError(error.toString());
		} finally {
			setLoading(false);
		}
	}

    let loginError = "";

    if (error) {
        loginError += "Something went wrong and login failed. Please look over your information and try again.";
    }
   
    return (
        <section className="form">
                { auth ? (<p className="form__submit--error mb-4 mt-2">You are already logged in.</p>) : ( 
                    <Form className="form__section" onSubmit={handleSubmit(onSubmit)}> 
                        <fieldset disabled={loading}>
                            <Form.Label className="form__label">Email <span className="form__label--required" title="Required field">*</span></Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control className="form__input" size="sm" type="email" ref={register} name="identifier"/>
                                {errors.identifier && <ValidationFeedback>{errors.identifier.message}</ValidationFeedback>}
                            </InputGroup>

                            <Form.Label className="form__label mt-2">Password <span className="form__label--required" title="Required field">*</span></Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control className="form__input" size="sm" ref={register} type="password" name="password"/>
                                {errors.password && <ValidationFeedback>{errors.password.message}</ValidationFeedback>}
                            </InputGroup>

                            <div className="form__buttons">
                                <button type="submit" className="button button__primary mt-2 form__btn" title="Login">{loading ? "Logging in... " : "Login"}</button>
                                <button as="input" type="reset" value="Clear" title="Clear form" className="button button__secondary mt-2 form__btn">Clear</button>
                            </div>
                            <p className="form__submit--error mt-3">{loginError}</p>
                        </fieldset>
                    </Form>
                )}
                <div className="mt-2">
                    <p className="mb-0 fw-bold">Don't have an account?</p>
                    <span className="modal__link text-link" onClick={() => {navigate("/register"); closeModal()}} title="Create Account">Register now</span>
                </div>
        </section>
    );
}
  