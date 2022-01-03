import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../data/apiData";
import useAxios from "../../hooks/useAxios";
import Loading from "../../assets/Loading";

export default function CarouselByType() {
    const navigate = useNavigate();
    const { data: accommodations, loading, error } = useAxios("get", apiUrl + `establishments?type=guesthouse`, null);

    if (error) throw error; 
    if (loading) return <Loading/>

    function renderCarouselItem(item) {
        return (
            <Carousel.Item key={item.id}>
                    <div>
                        <img className="d-block w-100" src={`${apiUrl}${item.default_img.url.substring(1)}`} alt={item.name}/>
                    </div>
                    <Carousel.Caption>
                    <h3>{item.name}</h3>
                    <p>{item.tagline}</p>
                    <button className="button button__secondary items__item__buttons--button mt-3 mx-0 d-inline-block" onClick={() => navigate(`/accommodation/all/${item.slug}`)} title={`Go to ${item.name}`}>Continue</button>
                    </Carousel.Caption>
                </Carousel.Item>
        );
    }

    return (<>
        {accommodations.length === 0 ? "" : <>
            <Carousel interval={null}>
                {accommodations.slice(0, 3).map(renderCarouselItem)}
            </Carousel>
        </>}
    </>);
}