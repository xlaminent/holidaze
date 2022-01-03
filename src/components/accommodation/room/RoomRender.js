import { Link } from "react-router-dom";
import { apiUrl } from "../../../data/apiData";

export default function renderRoomData(room) {
    let roomOccupationData = "";
    
    room.beds.forEach(bed => {
        roomOccupationData = <><p className="text-capitalize">Beds: {bed.name} (fits {bed.space} {bed.space > 1 ? " people" : " person"})</p></> 
    });
    
    return (
        <div className="items__item" key={room.id}>
            <div className="items__item__part items__item__part--right">
                <div className="items__item__img">
                    <img src={`${apiUrl}${room.image.url.substring(1)}`} alt={room.name}/>
                </div>
            </div>
            <div className="items__item__part items__item__part--left">
                <div className="items__item__heading">
                    <p>{room.name}</p>
                    <span className="fs-5 text-uppercase">{room.room_standard}</span>
                </div>

                <div className="d-block">
                    {roomOccupationData}
                    <div className="items__item__tags mb-4">
                        <div>
                            <p>{room.description}</p>
                        </div>
                    </div>
                    <p className="fs-5"><span className="fs-4">${room.price}</span> Standard fee</p>

                    <div className="items__item__buttons mb-4">  
                        <Link to={`room/${room.slug}`}><span className="button button__primary items__item__buttons--button d-inline" title={`Continue to room page`}>Continue</span></Link>
                    </div>
                </div>
            </div>
        </div>
    )
} 