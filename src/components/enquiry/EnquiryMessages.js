import { PageTitle } from "../../hooks/useTitleChange";
import React, {useContext } from "react";
import { apiUrl } from "../../data/apiData";
import useAxios from "../../hooks/useAxios";
import PageNotFound from "../../assets/PageNotFound";
import { Link } from "react-router-dom";
import Loading from "../../assets/Loading";
import AccessContext from "../../context/AccessContext";
import { Col, Table } from "react-bootstrap";

export default function EnquiryMessages() {
    const [auth, ] = useContext(AccessContext);

    const { data: enquiries, loading, error } = useAxios("get", apiUrl + "enquiries", null,
        {
            headers: {
            Authorization: `Bearer ${auth.jwt}`
            },
        }
    );

    if (error) throw error; 
    if (loading) return <Loading/>
    if (enquiries.length === 0) return <PageNotFound content="Couldn't find any enquiries." />;

    function renderEnquiries(enquiry) {
        const dateComponents = new Date(enquiry.published_at).toDateString().split(" ");  
        
        let dayOfMonth = +dateComponents[2];
        dayOfMonth = dayOfMonth < 10 ? "0" + dayOfMonth : dayOfMonth; 
    
        const monthName = dateComponents[1];
        const year = dateComponents[3];
        const formattedDate = `${dayOfMonth} ${monthName} ${year}`;

        return (
            <tr key={enquiry.id}>
                <td><Link to={`enquiry/${enquiry.id}`} key={enquiry.id} className="table__link" title="Open enquiry">Open</Link></td>
                <td>{formattedDate}</td>
                <td>{enquiry.establishment_name === null ? "general" : enquiry.establishment_name}</td>
                <td>{enquiry.subject}</td>
                <td>{enquiry.name}</td>
            </tr>
        );
    }

    return (
        <section className="d-sm-block d-md-flex justify-content-sm-center panel push-sm">
            <PageTitle title="Admin - Enquiries"/>
            <Col md="11" sm="12" className="panel__section">
                <div className="d-block mb-4">
                    <i className="bi bi-arrow-return-left"></i> <Link to={`/admin`} title="Back to the administrator panel" className="text-link"> Go back</Link>
                </div>
                <h2>contact enquiries</h2>
                <div className="table--horizontal">
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>Actions</th>
                                <th>Date </th>
                                <th>Recipient</th>
                                <th>Subject</th>
                                <th>From</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enquiries.map(renderEnquiries)}
                        </tbody>
                    </Table>
                </div>
            </Col>
        </section>
    );
}
