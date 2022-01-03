import { PageTitle } from "../../hooks/useTitleChange";
import React, {useContext } from "react";
import { apiUrl } from "../../data/apiData";
import useAxios from "../../hooks/useAxios";
import PageNotFound from "../../assets/PageNotFound";
import { Link } from "react-router-dom";
import Loading from "../../assets/Loading";
import AccessContext from "../../context/AccessContext";
import { Col, Tabs, Tab } from "react-bootstrap";

export default function ContactMessages() {
    const [auth, ] = useContext(AccessContext);
    const { data: messages, loading, error } = useAxios("get", apiUrl + "messages", null,
        {
            headers: {
                Authorization: `Bearer ${auth.jwt}`
            },
        }
    );

    if (error) throw error; 
    if (loading) return <Loading/>
    if (messages.length === 0) return <PageNotFound content="Couldn't find any messages." />;

    function renderMessages(message) {
        const dateComponents = new Date(message.created_at).toDateString().split(" ") 
        
        let dayOfMonth = +dateComponents[2];
        dayOfMonth = dayOfMonth < 10 ? "0" + dayOfMonth : dayOfMonth; 
    
        const monthName = dateComponents[1];
        const year = dateComponents[3];
        const formattedDate = `${dayOfMonth} ${monthName} ${year}`;

        return (
            <Link to={`message/${message.id}`} key={message.id}>
                <div className={`panel__message ${message.read === false ? "panel__message--unread" : "" }`}>
                    <i className={`bi ${message.read === false ? "bi-envelope-fill" : "bi-envelope-open" }`}></i>
                    <p>{formattedDate}</p>
                    <p>{message.email}</p>
                    <p>"{message.subject}"</p>
                </div>
            </Link>
        );
    }

    let emptyStatus = <p className="mt-4 text-center">No messages.</p>

    const unread = messages.filter((msg) => !msg.read).map(renderMessages);
    const unreadHtml = unread.length === 0 ? emptyStatus : unread;

    const read = messages.filter((msg) => msg.read).map(renderMessages);
    const readHtml = read.length === 0 ? emptyStatus : read;

    return (
        <section className="d-sm-block d-md-flex justify-content-sm-center panel push-sm">
            <PageTitle title="Admin - Messages"/>
            <Col md="10" sm="12" className="panel__section">
                <div className="d-block mb-4">
                    <i className="bi bi-arrow-return-left"></i> <Link to={`/admin`} title="Back to the administrator panel" className="text-link"> Go back</Link>
                </div>
                <h2>contact messages</h2>
                <Tabs className="panel__container" defaultActiveKey="all" transition={false} >
                    <Tab className="panel__tab" eventKey="all" title={"All messages (" + (messages.length === undefined ? `0` : `${messages.length}`) + ")"}>
                        {messages.map(renderMessages)}
                    </Tab>
                    <Tab className="panel__tab" eventKey="unread" title={"Unread (" + (unreadHtml.length === undefined ? `0` : `${unreadHtml.length}`) + ")"}>
                        {unreadHtml}
                    </Tab>
                    <Tab className="panel__tab" eventKey="read" title={"Read (" + (readHtml.length === undefined ? `0` : `${readHtml.length}`) + ")"}>
                        {readHtml}
                    </Tab>
                </Tabs>  
            </Col>
        </section>
    );
}
