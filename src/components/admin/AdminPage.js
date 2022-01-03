import { useContext } from "react";
import AccessContext from "../../context/AccessContext";
import { PageTitle } from "../../hooks/useTitleChange";
import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";

export default function AdminPage() {
    const [auth,] = useContext(AccessContext);

    return (
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <PageTitle title="Administrator"/>

            {!auth ? 
                (<p>You don't have acccess to this page. To access this page please log in.</p>) 
                : 
                (
                    <section className="split">
                        <h1 className="text-center">Administrator panel</h1>
                        <div className="split__box split__box--left push-sm">
                            <div className="split__box__section">
                                <h2>Contact Messages</h2>
                                <p><Link to={`/admin/message-board`} className="text-link">Go to message board</Link>.</p>
                            </div>
                            <div className="split__box__section">
                                <h2>incoming enquiries</h2>
                                <p><Link to={`/admin/enquiries`} className="text-link">Go to enquiry overview</Link>.</p>
                            </div>
                        </div>
                        <div className="split__box split__box--right">
                            <div className="split__box__section">
                                <h2>Establishment options</h2>
                                <p><Link to={`/admin/create-establishment`} className="text-link">Create a new entity (establishment)</Link>.</p>
                            </div>
                        </div>
                    </section>  
                )
            }
        </Col>
    );
}