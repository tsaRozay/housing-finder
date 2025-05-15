import { fetchSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MdStar } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import "./LandingPage.css";

function LandingPage() {
    const dispatch = useDispatch();
    const spotsList = useSelector((state) => state.spots.allSpots);

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    return (
        <section className="container">
            {Object.values(spotsList).map((spot) => (
                <Link to={`/spots/${spot.id}`} key={spot.id} className="spot-link">
                    <div className="spot-card" data-tooltip-id={`tooltip-${spot.id}`}>
                        <div className="spot-image">
                            <img src={spot.previewImage} alt={spot.name} />
                        </div>
                        <div className="spot-info">
                            <p className="spot-location">
                                {spot.city}, {spot.state}
                                <span className="spot-rating">
                                    <MdStar /> {Number(spot.avgRating) > 0 ? Number(spot.avgRating).toFixed(1) : "New"}
                                </span>
                            </p>
                            <p className="spot-price">
                                ${!isNaN(parseFloat(spot.price)) ? parseFloat(spot.price).toFixed(2) : "N/A"} <span>night</span>
                            </p>
                        </div>
                    </div>
                    <Tooltip id={`tooltip-${spot.id}`} place="top" effect="solid" className="tooltip">
                    {spot.name}
                    </Tooltip>
                </Link>
            ))}
        </section>
    );
}

export default LandingPage;