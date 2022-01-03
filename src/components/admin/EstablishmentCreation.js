import { useState, useContext, useEffect } from "react";
import { apiUrl } from "../../data/apiData";
import axios from "axios";
import { useForm } from "react-hook-form";
import AccessContext from "../../context/AccessContext";
import { PageTitle } from "../../hooks/useTitleChange";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ValidationFeedback from "../../assets/ValidationFeedback";
import { characterCounter } from "../../assets/FormCharacterCount";
import { Form, Button, Col, Row, InputGroup, OverlayTrigger, Tooltip, Toast, ToastContainer} from "react-bootstrap";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
    name: yup.string().required("Please enter the full name of the establishment."),
    slug: yup.string().required("Please enter a slug of the establishments name").matches(/^\S*$/, 'This field cannot contain blank spaces (use hyphens instead).').lowercase(),
    short_description: yup.string().required("Please enter a short description of the establishment.").min(30, "Description must be at least 30 characters").max(250, "Description can't be longer than 250 characters"),
    long_description: yup.string().required("Please enter a long description of the establishment.").min(80, "Description must be at least 80 characters").max(650, "Description can't be longer than 650 characters"),
    address: yup.string().required("Please enter an address."),
    city: yup.string().required("Please enter a city name."),
    zip: yup.string().required("Please enter the zip code."),
    tagline: yup.string().required("Please enter a tagline.").max(40, "Tagline can't be longer than 40 characters"),
    store: yup.string(),
    pet_friendly: yup.string(),
    rental_services: yup.string(),
    concierge: yup.string(),
    room_service: yup.string(),
    playroom: yup.string(),
    spa: yup.string(),
    gym: yup.string(),
    pool: yup.string(),
    library: yup.string(),
    tanning_lounge: yup.string(),
});

export default function CreateEstablishment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [created, setCreated] = useState(false);
    const [auth, ] = useContext(AccessContext);
    const [defaultImage, setDefaultImage] = useState([]);
    const [images, setImages] = useState([]);
    const [counter, setCounter] = useState();
    const [show, setShow] = useState(true);

    const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(schema),
	});

    const onImageChange = (event) => {
        setDefaultImage({
            defaultImage: event.target.files
        });
    };

    const onImagesChange = (event) => {
        setImages({
            images: event.target.files
        });
    };

    function addImages(id) {
        const promises = [];
        Array.from(images.images).forEach(images => {
            const formData = new FormData();
            formData.append('files', images);
            formData.append("ref", "Establishment");
            formData.append("refId", id);
            formData.append("field", "images");
            
            const img = {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${auth.jwt}`
                },
            }; 

            promises.push(fetch(apiUrl + "upload", img));
        });

        return promises;
    } 

    function addDefaultImage(id) {
        const formData = new FormData();

        Array.from(defaultImage.defaultImage).forEach(default_img => {
            formData.append('files', default_img);
            formData.append("ref", "Establishment");
            formData.append("refId", id);
            formData.append("field", "default_img");
        });

        const img = {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${auth.jwt}`
            },
        }; 
    
        return fetch(apiUrl + "upload", img);
    } 
   
    async function onSubmit(data) {
		setLoading(true);
		setError(null);
    
		try {
            data.images = [];
            const response = await axios.post(apiUrl + "establishments", data, {
                headers: {
                    Authorization: `Bearer ${auth.jwt}`
                },
            });
            await Promise.all(addImages(response.data.id));
            await addDefaultImage(response.data.id);

            setCreated(true);
            setCounter(0);
            document.querySelector("form").reset(); 
		} catch (error) {
			setError(error.toString());
            setCreated(false);
            setCounter();
		} finally {
			setLoading(false);
		}
	}

    let submitError = "";

    if (error) {
        submitError += "An error occurred when trying to create an establishment, are you missing some fields?";
    }
    
    useEffect(() => {
        let notification = counter >= 0 && setInterval(() => setCounter(counter + 1), 60000);
        return () => clearInterval(notification);
    }, [counter]);

    return (
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <PageTitle title="Admin - Create"/>
            <h1 className="text-md-center">create establishment</h1>
            <section className="d-sm-block d-md-flex justify-content-sm-center panel push-sm">
                <Col md="10" sm="12" className="panel__section">
                    <div className="d-block mb-4">
                        <i className="bi bi-arrow-return-left"></i> <Link to={`/admin`} title="Back to the administrator panel" className="text-link"> Go back</Link>
                    </div>
                    <h2 className="mb-2">create a new hotel, resort or other</h2>
                    <p>New establishments will be online within 5-10 minutes.</p>
                    <div className="form mt-4">
                        <Col md="12" sm="12">
                            <Form className="form__section" onSubmit={handleSubmit(onSubmit)}> 
                                <fieldset disabled={loading}>
                                    <Form.Label className="form__label">Name <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-4">
                                        <Form.Control className="form__input" size="sm" ref={register} type="text" name="name" />
                                        <InputGroup.Text className="form__info">
                                            <OverlayTrigger className="form__tooltip" placement="right" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>Full name of the establishment.</Tooltip>}>
                                                <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        {errors.name && <ValidationFeedback>{errors.name.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Form.Label className="form__label">Slug <span className="text-muted">(url name) </span><span className="form__label--required" title="Required field"> *</span></Form.Label>
                                    <InputGroup className="mb-4">
                                        <Form.Control className="form__input" size="sm" ref={register} type="text" name="slug" />
                                        <InputGroup.Text className="form__info">
                                            <OverlayTrigger className="form__tooltip" placement="right" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>The establishments name in lowercase letters and with hyphens instead of spaces if any. 'The Blue In' would be 'the-blue-in'.</Tooltip>}>
                                                <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        {errors.slug && <ValidationFeedback>{errors.slug.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Row>
                                        <Col md="5">
                                            <Form.Label className="form__label">Address <span className="form__label--required" title="Required field">*</span></Form.Label>
                                            <InputGroup className="mb-4" size="sm">
                                                <Form.Control className="form__input" ref={register} type="text" size="sm" name="address" />
                                                <InputGroup.Text className="form__info">
                                                    <OverlayTrigger className="form__tooltip" placement="bottom" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>Street name and number.</Tooltip>}>
                                                        <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                                    </OverlayTrigger>
                                                </InputGroup.Text>
                                                {errors.address && <ValidationFeedback>{errors.address.message}</ValidationFeedback>}
                                            </InputGroup>
                                        </Col>

                                        <Col md="4">
                                            <Form.Label className="form__label">City <span className="form__label--required" title="Required field">*</span></Form.Label>
                                            <InputGroup className="mb-4" size="sm">
                                                <Form.Control className="form__input" ref={register} type="text" size="sm" name="city"/>
                                                <InputGroup.Text className="form__info">
                                                    <OverlayTrigger className="form__tooltip" placement="bottom" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>Name of city which its in.</Tooltip>}>
                                                        <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                                    </OverlayTrigger>
                                                </InputGroup.Text>
                                                {errors.city && <ValidationFeedback>{errors.city.message}</ValidationFeedback>}
                                            </InputGroup>
                                        </Col>

                                        <Col md="3">
                                            <Form.Label className="form__label">Zip Code <span className="form__label--required" title="Required field">*</span></Form.Label>
                                            <InputGroup className="mb-4" size="sm">
                                                <Form.Control className="form__input" ref={register} type="number" size="sm" name="zip"/>
                                                <InputGroup.Text className="form__info">
                                                    <OverlayTrigger className="form__tooltip" placement="right" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>The establishments zip code.</Tooltip>}>
                                                        <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                                    </OverlayTrigger>
                                                </InputGroup.Text>
                                                {errors.zip && <ValidationFeedback>{errors.zip.message}</ValidationFeedback>}
                                            </InputGroup> 
                                        </Col>
                                    </Row>

                                    <Form.Label className="form__label">Business Category <span className="form__label--required" title="Required field"> *</span></Form.Label>
                                    <InputGroup className="mb-4">
                                        <Form.Select className="form__input" required name="type" ref={register}>
                                            <option value="">Select...</option>
                                            <option value="resort">Resort</option>
                                            <option value="bed-breakfast">B & B</option>
                                            <option value="guesthouse">Guesthouse</option>
                                            <option value="hotel">Hotel</option>
                                        </Form.Select>
                                        <InputGroup.Text className="form__info">
                                            <OverlayTrigger className="form__tooltip" placement="right" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>Select one category that best matches the establishments type of business.</Tooltip>}>
                                                <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        {errors.type && <ValidationFeedback>{errors.type.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Row>
                                        <Col md="6">
                                            <Form.Label className="form__label">Main Image <span className="form__label--required" title="Required field">*</span></Form.Label>
                                            <InputGroup className="mb-4" size="sm">
                                                <Form.Control className="form__input" ref={register} type="file" size="sm" required onChange={onImageChange} name="default_img" />
                                                <InputGroup.Text className="form__info">
                                                    <OverlayTrigger className="form__tooltip" placement="bottom" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>Main image of establishment. Will be used as main photo and banner on the site. </Tooltip>}>
                                                        <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                                    </OverlayTrigger>
                                                </InputGroup.Text>
                                                {errors.default_img && <ValidationFeedback>{errors.default_img.message}</ValidationFeedback>}
                                            </InputGroup>
                                        </Col>

                                        <Col md="6">
                                            <Form.Label className="form__label">Image Gallery <span className="form__label--required" title="Required field">*</span></Form.Label>
                                            <InputGroup className="mb-4" size="sm">
                                                <Form.Control className="form__input" ref={register} type="file" size="sm" required onChange={onImagesChange} multiple name="images"/>
                                                <InputGroup.Text className="form__info">
                                                    <OverlayTrigger className="form__tooltip" placement="right" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>Upload multiple images that will work as an image gallery. </Tooltip>}>
                                                        <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                                    </OverlayTrigger>
                                                </InputGroup.Text>
                                                {errors.images && <ValidationFeedback>{errors.images.message}</ValidationFeedback>}
                                            </InputGroup>
                                        </Col>
                                    </Row>

                                    <Form.Label className="form__label">Tagline <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-4">
                                        <Form.Control className="form__input" size="sm" ref={register} type="text" name="tagline" />
                                        <InputGroup.Text className="form__info">
                                            <OverlayTrigger className="form__tooltip" placement="right" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>Quick statement about/describing the establishment. Could be goals, achievements or intent.</Tooltip>}>
                                                <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        {errors.tagline && <ValidationFeedback>{errors.tagline.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Form.Label className="form__label">Short Description <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-4">
                                        <Form.Control className="form__input form__input__counter" as="textarea" maxLength="250" ref={register} rows={4} name="short_description"/>
                                        <InputGroup.Text className="form__info">
                                            <OverlayTrigger className="form__tooltip" placement="right" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>Short summary of offers in form of experiences, activities, amenities or what they strive to offer all guests. Max 250 characters.</Tooltip>}>
                                                <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        {errors.short_description && <ValidationFeedback>{errors.short_description.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Form.Label className="form__label">Long Description <span className="form__label--required" title="Required field">*</span></Form.Label>
                                    <InputGroup className="mb-4">
                                        <Form.Control className="form__input form__input__counter" as="textarea" onChange={characterCounter} maxLength="650" ref={register} rows={10} name="long_description"/>
                                        <div className="form__counter text-muted"><span className="form__counter__remaining">650/</span><span>650</span></div>
                                        <InputGroup.Text className="form__info">
                                            <OverlayTrigger className="form__tooltip" placement="right" delay={{ show: 200, hide: 100 }} size="sm" overlay={<Tooltip>Descriptive statement about the establishment. e.g. description of goals, visions, offers and services made available. Max 650 characters</Tooltip>}>
                                                <Button className="form__tooltip__btn" variant="light" size="sm"><i className="bi bi-question-lg form__tooltip__btn--icon"></i></Button>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        {errors.long_description && <ValidationFeedback>{errors.long_description.message}</ValidationFeedback>}
                                    </InputGroup>

                                    <Row className="mb-4">
                                        <Form.Label className="form__label">Specials & Services <span className="text-muted">(all optional) </span></Form.Label>
                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="In-House Store" ref={register} size="sm" name="store"  />
                                        </Col>

                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="Pet Friendly" ref={register} size="sm" name="pet_friendly"  />
                                        </Col>

                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="Rental Services" ref={register} size="sm" name="rental_services"  />
                                        </Col>

                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="Concierge" ref={register} size="sm" name="concierge"  />
                                        </Col>

                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="Room Service" ref={register} size="sm" name="room_service"  />
                                        </Col>
                                    </Row>

                                    <Row className="mb-5">
                                        <Form.Label className="form__label">Amenities <span className="text-muted">(all optional) </span></Form.Label>
                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="Playroom" ref={register} size="sm" name="playroom"  />
                                        </Col>

                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="Spa" ref={register} size="sm" name="spa"  />
                                        </Col>

                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="Gym" ref={register} size="sm" name="gym"  />
                                        </Col>

                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="Tanning lounge" ref={register} size="sm" name="tanning_lounge"  />
                                        </Col>

                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="Library" ref={register} size="sm" name="library"  />
                                        </Col>

                                        <Col md="3" sm="4" xs="6">
                                            <Form.Check className="form__input form__input__checkbox" type="checkbox" label="Pool" ref={register} size="sm" name="pool"  />
                                        </Col>
                                    </Row>

                                    <div className="form__buttons">
                                        <button type="submit" className="button button__primary mt-1 form__btn" title="Create now">{loading ? "Creating... " : "Create"}</button>
                                        <button as="input" type="reset" value="Clear" title="Clear form" className="button button__secondary mt-1 form__btn">Clear</button>
                                    </div>
                                    <p className="form__submit--error mt-3">{submitError}</p>
                                </fieldset>
                            </Form>
                        </Col>
                    </div>
                </Col>
            </section>
            { created && 
                <div>
                    <ToastContainer className="form__notification p-3" position="bottom-end">
                        <Toast onClose={() => setShow(false)} show={show} delay={90000} className="form__notification__box" autohide>
                            <Toast.Header className="form__notification__box--header">
                                <strong className="me-auto">Success!</strong>
                                <span>{counter === undefined || counter < 1 ? "NOW" : counter + " min ago"}</span>
                            </Toast.Header>
                            <Toast.Body>Establishment created. It will be publicly available now.</Toast.Body>
                        </Toast>
                    </ToastContainer>
                </div>
            } 
        </Col>
    );
}
  