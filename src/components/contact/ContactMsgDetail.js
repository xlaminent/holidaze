import { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiUrl } from "../../data/apiData";
import useAxios from "../../hooks/useAxios";
import axios from "axios";
import AccessContext from "../../context/AccessContext";
import PageNotFound from "../../assets/PageNotFound";
import Loading from "../../assets/Loading";
import { Col, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function MessageDetail() {
    const [auth, ] = useContext(AccessContext);
    const { id } = useParams();
    const [created, setCreated] = useState(false);
    const [counter, setCounter] = useState();
    const [show, setShow] = useState(true);
    const navigate = useNavigate();

    // set message as read upon opening
    useAxios("put", apiUrl + `messages/${id}`, { read : true}, 
        {
            headers: {
                Authorization: `Bearer ${auth.jwt}`
            },
        }
    );

    const { data: messages, loading, error } = useAxios("get", apiUrl + `messages/${id}`, null, 
        {
            headers: {
                Authorization: `Bearer ${auth.jwt}`
            },
        }
    );

    useEffect(() => {
        let notification = counter >= 0 && setInterval(() => setCounter(counter + 1), 60000);
        return () => clearInterval(notification);
    }, [counter]);

    if (error) throw error; 
    if (loading) return <Loading/>
    if (!messages) return <PageNotFound content="Couldn't open the message." />;

    async function setUnread() {  
        try {
            await axios.put(apiUrl + `messages/${id}`, { read : false}, 
                {
                    headers: {
                        Authorization: `Bearer ${auth.jwt}`
                    },
                }); 
            setCreated(true);
            setCounter(0);
        } catch (error) {
            setCreated(false);
            setCounter();
            console.log(error);
        }
    }

    async function deleteMessage() {  
        const confirmDelete = window.confirm("Are you sure you want to delete this message?");

        if (confirmDelete) {
            try {
                await axios.delete(apiUrl + `messages/${id}`, 
                    {
                        headers: { 
                            Authorization: `Bearer ${auth.jwt}`
                        },
                    }); 
                navigate("/admin/message-board");
            } catch (error) {
                console.log(error);
            }
        }
    }

    let messageDate; 
    messageDate = new Date(messages.created_at).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit'});

    return (
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <h1 className="text-md-center">Message board</h1>
            <section className="d-sm-block d-md-flex justify-content-sm-center panel push-sm">
                <Col md="10" sm="12" className="panel__section">
                    {!auth ? (<h2>You don't have acccess to this page. To access this page please log in.</h2>) 
                    : ( <>
                        <div className="d-block mb-4">
                            <i className="bi bi-arrow-return-left"></i> <Link to={`/admin/message-board`} title="Back to the message board" className="text-link"> Go back</Link>
                        </div>
                        <h2 className="d-inline-block lh-lg">Message</h2>
                        <button className="button button__primary button--sm d-inline-block float__right" onClick={() => deleteMessage()} title="Delete this message">Delete</button>

                        <div key={messages.id} className="message mt-1">
                            <div className="message__header">
                                <p><span>Sent: </span>{messageDate}</p>
                                <p><span>Name: </span>{messages.name}</p>
                                <p><span>Email: </span>{messages.email}</p>
                            </div>
                            <div className="message__content">
                                <p><span>Subject: </span>{messages.subject}</p>
                                <p><span>Message: </span>{messages.message}</p>
                            </div>
                            <div className="message__status">
                                <div className=" d-sm-block d-md-inline">
                                    <input onClick={() => setUnread()} type="checkbox" name="read"></input>
                                    <p>Mark as unread</p>
                                </div>   
                            </div>
                        </div>
                    </>)}
                </Col>
            </section>
               { created && 
                    <ToastContainer className="form__notification p-3" position="bottom-end">
                        <Toast onClose={() => setShow(false)} show={show} delay={90000} className="form__notification__box" autohide>
                            <Toast.Header className="form__notification__box--header">
                                <strong className="me-auto">Updated!</strong>
                                <span>{counter === undefined || counter < 1 ? "NOW" : counter + " min ago"}</span>
                            </Toast.Header>
                            <Toast.Body>Message status updated to unread.</Toast.Body>
                        </Toast>
                    </ToastContainer>
                } 
        </Col>
    );
}        