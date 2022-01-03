import PropTypes from "prop-types";
import { apiUrl } from "../../../data/apiData";

function RoomGallery({ galleryImages }) {
    return (<>
        {galleryImages.map(function (room_images) {
            return (
                <div className="gallery__item" key={room_images.id}>
                    <div className="gallery__item__img">
                        <img  src={`${apiUrl}${room_images.url.substring(1)}`} alt={room_images.name}/>
                    </div>
                </div>
            );
        })}
    </>);
}

RoomGallery.propTypes = {
	galleryImages: PropTypes.arrayOf(PropTypes.object),
};

export default RoomGallery;