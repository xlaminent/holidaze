import { useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../../data/apiData";
import useAxios from "../../hooks/useAxios";
import axios from "axios";
import AccessContext from "../../context/AccessContext";
import PageNotFound from "../../assets/PageNotFound";
import Loading from "../../assets/Loading";
import { Col } from "react-bootstrap";

export default function EnquiryDetail() {
    const [auth, ] = useContext(AccessContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: enquiries, loading, error } = useAxios("get", apiUrl + `enquiries/${id}`, null, 
        {
            headers: {
                Authorization: `Bearer ${auth.jwt}`
            },
        }
    );

    if (error) throw error; 
    if (loading) return <Loading/>
    if (!enquiries) return <PageNotFound content="Couldn't open the enquiry." />;

    async function deleteEnquiry() {  
        const confirmDelete = window.confirm("Are you sure you want to delete this enquiry?");

        if (confirmDelete) {
            try {
                await axios.delete(apiUrl + `enquiries/${id}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${auth.jwt}`
                        },
                    }); 
                navigate("/admin/enquiries");
            } catch (error) {
                console.log(error);
            }
        }
    }

    let enquiryDate; 
    enquiryDate = new Date(enquiries.created_at).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit'});

    return (
        
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
        <h1 className="text-md-center">EnquiryBoard</h1>
        <section className="d-sm-block d-md-flex justify-content-sm-center panel push-sm">
            <Col md="10" sm="12" className="panel__section">
                {!auth ? (<h2>You don't have acccess to this page. To access this page please log in.</h2>) 
                : ( <>
                    <div className="d-block mb-4">
                        <i className="bi bi-arrow-return-left"></i> <Link to={`/admin/enquiries`} title="Back to the enquiry board" className="text-link"> Go back</Link>
                    </div>
                    <h2 className="d-inline-block lh-lg">enquiry</h2>
                    <button className="button button__primary button--sm d-inline-block float__right" onClick={() => deleteEnquiry()} title="Delete this enquiry">Delete</button>

                    <div key={enquiries.id} className="message mt-3">
                        <div className="message__header">
                            <p className="fw-bold"><span>For: </span>{enquiries.establishment_name === null ? "general" : enquiries.establishment_name}</p>
                            <p className="fw-bold"><span>From: </span>{enquiries.name}</p>
                            <p><span>Company: </span>{enquiries.company_name === "" ? "-" : enquiries.company_name}</p>
                        </div>
                        <div className="message__header">
                            <p><span>Sent: </span>{enquiryDate}</p>
                            <p><span>Email: </span>{enquiries.email}</p>
                            <p><span>Phone: </span>{enquiries.number}</p>
                        </div>
                        <div className="message__header mt-3">
                            <p><span>Type: </span> {enquiries.type}</p>
                        </div>
                        <div className="message__content mt-2">
                            <p><span>Subject: </span> {enquiries.subject}</p>
                            <p><span>Message: </span>{enquiries.message}</p>
                        </div>
                    </div>
                </>)}
            </Col>
        </section>
    </Col>
    );
}