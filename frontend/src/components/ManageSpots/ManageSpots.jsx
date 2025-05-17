import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdStar } from 'react-icons/io';
import { fetchSpots } from '../../store/spots';
import { Tooltip } from 'react-tooltip';
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal.jsx';
import './ManageSpots.css';

function ManageSpotsModal() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.session.user);
    const allSpots = useSelector((state) => state.spots.allSpots);

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    if (!currentUser) {
        navigate('/', {
            state: { error: 'You must be logged in to manage your spots' },
            replace: true,
        });
        return null;
    }

    const userListings = Object.values(allSpots).filter((spot) => spot.ownerId === currentUser.id);

    return (
        <div className="manage-spots-page">
            <div className="manage-spots-header">
                <h1>Manage Your Spots</h1>
                <Link to="/api/spots" className="new-listing-button">
                    Create a New Spot
                </Link>
            </div>

            {userListings.length === 0 ? (
                <p className="no-listings-message">You haven&apos;t added any spots yet.</p>
            ) : (
                <div className="listings-container">
                    {userListings.map((listing) => (
                        <div key={listing.id} className="listing-card">
                            <Link to={`/api/spots/${listing.id}`} className="listing-link">
                                <div className="listing-image-wrapper">
                                    <img src={listing.previewImage} alt={listing.name} />
                                </div>
                                <div className="listing-info">
                                    <p className="listing-location">
                                        {listing.city}, {listing.state}
                                        <span className="listing-rating">
                                            <IoMdStar />
                                            {listing.avgRating ? listing.avgRating.toFixed(1) : 'New'}
                                        </span>
                                    </p>
                                    <p className="listing-price">
                                    ${listing.price !== undefined && !isNaN(parseFloat(listing.price)) ? parseFloat(listing.price).toFixed(2) : "N/A"} <span>night</span>
                                    </p>
                                </div>
                                <Tooltip id={`tooltip-${listing.id}`} place="top" effect="solid" className="tooltip">
                                    {listing.name}
                                </Tooltip>
                            </Link>
                            <div className="listing-actions">
                                <button className="edit-listing-button" onClick={() => navigate(`/api/spots/${listing.id}/edit`)}>
                                    Update
                                </button>

                                {/* Delete button for spots */}
                                <OpenModalButton
                                    buttonText="Delete"
                                    className="delete-modal"
                                    modalComponent={({ closeModal }) => (
                                    <DeleteSpotModal spot={listing} closeModal={closeModal} />
                                )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageSpotsModal;