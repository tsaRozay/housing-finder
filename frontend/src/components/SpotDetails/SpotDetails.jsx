import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import "./SpotDetails.css";
import { MdOutlineStar } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { fetchReviewsForSpot } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal.jsx";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal.jsx";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal.jsx";

function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const spotData = useSelector((state) => state.spots.spotDetails);
    const reviews = useSelector(
        (state) => state.reviews.reviewsBySpot[spotId] || {}
    );
    const loggedInUser = useSelector((state) => state.session.user);

    const isOwner = loggedInUser && spotData.Owner?.id === loggedInUser.id;
    const hasReviewed = Object.values(reviews).some(
        (review) => review.User?.id === loggedInUser?.id
    );

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
        dispatch(fetchReviewsForSpot(spotId));
    }, [dispatch, spotId]);

    if (!spotData || Object.keys(spotData).length === 0) {
        return <p>Loading spot details...</p>;
    }

    const mainImage =
        spotData.SpotImages?.length > 0
            ? spotData.SpotImages[0].url
            : "https://placehold.co/600x400/ffcc00/png";
    const extraImages =
        spotData.SpotImages?.slice(1, 5).map((img) => img.url) || [];

    return (
        <div className="spot-wrapper">
            <div className="hero-image-container">
                <img
                    className="hero-image"
                    src={mainImage}
                    alt={`${spotData.name} main`}
                />
                <div className="hero-overlay">
                    <h1 className="hero-title">{spotData.name}</h1>
                    <div className="hero-location">
                        {spotData.city}, {spotData.state}, {spotData.country}
                    </div>
                </div>
            </div>

            <div className="gallery-section">
                {extraImages.map((imgUrl, index) => (
                    <div className="gallery-image" key={index}>
                        <img
                            src={imgUrl}
                            alt={`${spotData.name} view ${index + 1}`}
                        />
                    </div>
                ))}
            </div>

            <div className="details-booking-section">
                <div className="spot-info-card">
                    <div className="host-row">
                        <span className="host-badge">SUPERHOST</span>
                        <span className="spot-host">
                            Hosted by {spotData.Owner?.firstName}{" "}
                            {spotData.Owner?.lastName}
                        </span>
                    </div>
                    <p className="spot-description">{spotData.description}</p>
                    <div className="amenities-row">
                        <span className="amenity">🛏️ 2 Beds</span>
                        <span className="amenity">🛁 1 Bath</span>
                        <span className="amenity">📶 Wifi</span>
                        <span className="amenity">🚭 No Smoking</span>
                        {/* Add more amenities as needed */}
                    </div>
                </div>

                <div className="booking-card">
                    <div className="booking-header">
                        <span className="booking-price">
                            $
                            {spotData.price !== undefined &&
                            !isNaN(parseFloat(spotData.price))
                                ? parseFloat(spotData.price).toFixed(2)
                                : "N/A"}{" "}
                            <span className="per-night">night</span>
                        </span>
                        <span className="booking-rating">
                            <MdOutlineStar />{" "}
                            {spotData.avgStarRating
                                ? spotData.avgStarRating.toFixed(1)
                                : "New"}
                        </span>
                        {spotData.numReviews > 0 && <GoDotFill size={8} />}
                        {spotData.numReviews > 0 && (
                            <span className="review-count">
                                {spotData.numReviews}{" "}
                                {spotData.numReviews === 1
                                    ? "Review"
                                    : "Reviews"}
                            </span>
                        )}
                    </div>
                    <button
                        className="booking-button"
                        onClick={() => alert("Feature coming soon")}
                    >
                        Reserve
                    </button>
                </div>
            </div>

            <hr className="section-divider" />

            <div className="reviews-section">
                <div className="review-header">
                    <h3>
                        <MdOutlineStar />{" "}
                        {spotData.avgStarRating
                            ? spotData.avgStarRating.toFixed(1)
                            : "New"}
                    </h3>
                    {spotData.numReviews > 0 && (
                        <span className="go-dot-fill" />
                    )}
                    {spotData.numReviews > 0 && (
                        <h3>
                            {spotData.numReviews}{" "}
                            {spotData.numReviews === 1 ? "Review" : "Reviews"}
                        </h3>
                    )}
                </div>

                <div className="post-review-div">
                    {loggedInUser && !isOwner && !hasReviewed && (
                        <OpenModalButton
                            buttonText="Post Your Review"
                            modalComponent={
                                <CreateReviewModal spotId={spotId} />
                            }
                            className="post-review-button"
                        />
                    )}
                </div>

                {reviews && Object.keys(reviews).length > 0
                    ? Object.values(reviews)
                          .sort(
                              (a, b) =>
                                  new Date(b.createdAt) - new Date(a.createdAt)
                          )
                          .map((review) => {
                              const reviewDate = new Date(review.createdAt);
                              const formattedDate = reviewDate.toLocaleString(
                                  "en-US",
                                  { month: "long", year: "numeric" }
                              );
                              const isReviewAuthor =
                                  loggedInUser &&
                                  review.User?.id === loggedInUser.id;

                              // Avatar: use first initial or fallback star
                              const avatar = review.User?.firstName ? (
                                  review.User.firstName[0].toUpperCase()
                              ) : (
                                  <MdOutlineStar />
                              );

                              return (
                                  <div key={review.id} className="review-card">
                                      <div className="review-header">
                                          <div className="review-avatar">
                                              {avatar}
                                          </div>
                                          <div style={{ flex: 1 }}>
                                              <div className="review-name-date">
                                                  <strong>
                                                      {review.User?.firstName}
                                                  </strong>
                                                  <span className="review-date">
                                                      {formattedDate}
                                                  </span>
                                              </div>
                                              <div className="review-stars">
                                                  {[...Array(5)].map((_, i) => (
                                                      <MdOutlineStar
                                                          key={i}
                                                          style={{
                                                              color:
                                                                  i <
                                                                  review.stars
                                                                      ? "#FFB400"
                                                                      : "#e4e5e9",
                                                          }}
                                                      />
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                      <div className="review-body">
                                          <p>{review.review}</p>
                                      </div>
                                      {isReviewAuthor && (
                                          <div className="update-delete-div">
                                              <OpenModalButton
                                                  buttonText="Update"
                                                  modalComponent={
                                                      <UpdateReviewModal
                                                          reviewId={review.id}
                                                          initialReview={
                                                              review.review
                                                          }
                                                          initialRating={
                                                              review.stars
                                                          }
                                                          spotId={review.spotId}
                                                          pageType="spot"
                                                      />
                                                  }
                                                  className="update-modal"
                                              />
                                              <OpenModalButton
                                                  buttonText="Delete"
                                                  modalComponent={
                                                      <DeleteReviewModal
                                                          reviewId={review.id}
                                                          spotId={spotId}
                                                      />
                                                  }
                                                  className="delete-modal"
                                              />
                                          </div>
                                      )}
                                  </div>
                              );
                          })
                    : !isOwner && <p>Be the first to post a review!</p>}
            </div>
        </div>
    );
}

export default SpotDetails;
