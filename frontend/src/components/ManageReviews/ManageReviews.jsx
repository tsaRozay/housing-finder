import "./ManageReviews.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal.jsx";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal.jsx";

function ManageReviews() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const userReviews = useSelector((state) => state.reviews.userReviews);

  useEffect(() => {
    dispatch(fetchUserReviews());
  }, [dispatch]);

  if (!user) {
    navigate("/", {
      state: { error: "You must be logged in to manage your reviews" },
      replace: true,
    });
    return null;
  }

  const reviewsArray = Object.values(userReviews);

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>Manage Your Reviews</h1>
      </div>
      {reviewsArray.length === 0 ? (
        <div className="no-reviews-message">
          <p>You haven&apos;t written any reviews yet.</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviewsArray.map((review) => {
            const formattedDate = new Date(review.createdAt).toLocaleString(
              "en-US",
              { month: "long", year: "numeric" }
            );

            return (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <strong>{review.Spot?.name || "Unnamed Spot"}</strong>
                  <span>{formattedDate}</span>
                </div>
                <div className="review-content">
                  <p>{review.review}</p>
                </div>
                <div className="review-actions">
                  <OpenModalButton
                    buttonText="Edit"
                    modalComponent={
                      <UpdateReviewModal
                        reviewId={review.id}
                        existingReview={review.review}
                        existingStars={review.stars}
                        spotId={review.spotId}
                        currentPage="manage"
                      />
                    }
                    className="edit-button"
                  />
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={
                      <DeleteReviewModal reviewId={review.id} spotId={review.spotId} />
                    }
                    className="delete-button"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ManageReviews;
