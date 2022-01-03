import { apiUrl } from "../../data/apiData";
import PropTypes from "prop-types";

function EstablishmentGallery({ galleryImages }) {
    return (<>
        {galleryImages.map(function (imgs) {
            return (
                <div className="gallery__item" key={imgs.id}>
                    <div className="gallery__item__img">
                        <img src={`${apiUrl}${imgs.url.substring(1)}`} alt={imgs.name}/>
                    </div>
                </div>
            );
        })}
    </>);
}

EstablishmentGallery.propTypes = {
	galleryImages: PropTypes.arrayOf(PropTypes.object),
};

export default EstablishmentGallery;