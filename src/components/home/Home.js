import { PageTitle } from "../../hooks/useTitleChange";
import { Col } from "react-bootstrap";
import CarouselByType from "../layout/Carousel";
import FullPageBackground from "../home/HomeFullPageBG";
import Highlight from "../home/HomeHighlight";

export default function Home() {
    return (<>
        <FullPageBackground/>
        <PageTitle title="Home"/>     
        <Col className="main__container__content p-lg-0 p-md-0 mb-5" md={{ span: 10, offset: 1 }} sm={{span: 12}}>
            <div className="slider">
                <h2 className="mb-4"><span>Fall</span> is finally here</h2>
                <h3>Time for fall foliage, bonfires and hikes</h3>
                <p className="mt-md-5">Take a look at some of our offbeat, charming guest houses that are perfect for a fall stay</p>
                <CarouselByType/>
            </div>   
        </Col>
        <div className="divider">
            <div className="divider__textbox">
                <p>
                    We believe that every stay - be it for vacations, small visits, exploratory tours or what may have you, 
                    you should be able to enjoy beautiful destinations while staying at incredible accommodations.
                    It just so happens that Bergen offers all of that and more!
                </p>
                <p></p>
                <p> 
                    At Holidaze we pride ourself at offering bookings for only the best accommodations
                    across Bergen; from luxury resorts that will rejuvenate your soul and body - to amazing guest houses
                    that provides unique experiences to everyone of its guests.
                </p>
            </div>
        </div>
        <Col className="main__container__content p-lg-0 p-md-0" md={{ span: 10, offset: 1 }} sm={{span: 12}}> 
            <Highlight/>  
        </Col>
    </>);
}