import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../data/apiData";
import useAxios from "../../hooks/useAxios";
import Loading from "../../assets/Loading";

export default function Highlight() {
    const navigate = useNavigate();
    const { data: accommodations, loading, error } = useAxios("get", apiUrl + `establishments?type=hotel`, null);

    if (error) throw error; 
    if (loading) return <Loading/>

    function renderPromoItem(highlight) {
        return (
            <section className="highlight" key={highlight.id}>
                <div className="highlight__container highlight__text">
                    <div>
                        <h1>{highlight.name}</h1>
                        <p className="mt-3 hidden-xs">{highlight.short_description}</p>
                        <button type="button" className="button button__primary my-0  text-uppercase" onClick={() => navigate(`/accommodation/all/${highlight.slug}`)} title="Check Availability">Check Availability</button>
                    </div>
                </div>
                <div className="highlight__container highlight__img">
                    <img src={`${apiUrl}${highlight.default_img.url.substring(1)}`} alt={highlight.name}/>
                </div>
            </section>
        );
    }

    return (<>
        {accommodations.length === 0 ? "" : <> {accommodations.slice(0, 1).map(renderPromoItem)}</>}
    </>);
}