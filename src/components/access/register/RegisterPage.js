import { useState, useContext } from "react";
import { apiUrl } from "../../../data/apiData";
import AccessContext from "../../../context/AccessContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ValidationFeedback from "../../../assets/ValidationFeedback";
import { PageTitle } from "../../../hooks/useTitleChange";
import { useNavigate } from "react-router-dom";
import { Form, Col, InputGroup } from "react-bootstrap";

const schema = yup.object().shape({
    username: yup.string().required("Please enter a username."),
    email: yup.string().required("Please enter an email address.").email("Please enter a valid email address."),
    password: yup.string().required("Please enter a password.").min(4, "Password cannot be shorter than 4 characters."),
    confirmPassword: yup.string().required("Please repeat password.").oneOf([yup.ref("password"), null], "Passwords must match.")
});

export default function RegisterUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [auth, setAuth] = useContext(AccessContext);
    const navigate = useNavigate();

    const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(schema),
	});

    async function onSubmit(data) {
		setLoading(true);
		setError(null);

		try {
            const response = await axios.post(apiUrl + "auth/local/register/", data);
            setAuth(response.data);
		} catch (error) {
			setError(error.toString());
		} finally {
			setLoading(false);
            navigate("/");
		}
	}

    let registerError = "";

    if (error) {
        registerError += "An error occurred when trying to register a new user, please try again.";
    }
   
    return (
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <PageTitle title="Register User"/>
            <h1 className="text-md-center">Register User</h1>
            <section className="d-flex justify-content-sm-center">
                <Col md="6" sm="12">
                    {auth ?  <p className="fst-italic text-muted text-md-center">You are currently logged in with a registered account.</p> : ""}
                    <p className="text-md-center">Register as an user to create an account. You will be logged in upon creation. </p>

                    <Form className="form__section" onSubmit={handleSubmit(onSubmit)}> 
                        <fieldset disabled={loading}>
                            <Form.Label className="form__label">Username <span className="form__label--required" title="Required field">*</span></Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control className="form__input" size="sm" ref={register} type="text" name="username"/>
                                {errors.username && <ValidationFeedback>{errors.username.message}</ValidationFeedback>}
                            </InputGroup>

                            <Form.Label className="form__label">Email <span className="form__label--required" title="Required field">*</span></Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control className="form__input" size="sm" ref={register} type="email" name="email" />
                                {errors.email && <ValidationFeedback>{errors.email.message}</ValidationFeedback>}
                            </InputGroup>

                            <Form.Label className="form__label">Password <span className="form__label--required" title="Required field">*</span></Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control className="form__input" size="sm" ref={register} type="password" name="password"/>
                                {errors.password && <ValidationFeedback>{errors.password.message}</ValidationFeedback>}
                            </InputGroup>

                            <Form.Label className="form__label">Repeat Password <span className="form__label--required" title="Required field">*</span></Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control className="form__input" size="sm" ref={register} type="password" name="confirmPassword"/>
                                {errors.confirmPassword && <ValidationFeedback>{errors.confirmPassword.message}</ValidationFeedback>}
                            </InputGroup>

                            <div className="form__buttons">
                                <button type="submit" className="button button__primary mt-4 form__btn" title="Create an account">{loading ? "Creating user... " : "Register"}</button>
                                <button as="input" type="reset" value="Clear" title="Clear form" className="button button__secondary mt-4 form__btn">Clear</button>
                            </div>
                            <p className="form__submit--error mt-3">{registerError}</p>
                        </fieldset>
                    </Form>
                </Col>
            </section>
        </Col>
    );
}
