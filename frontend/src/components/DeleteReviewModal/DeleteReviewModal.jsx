import "./DeleteReviewModal.css";
import { useModal } from "../../context/modal";
import { useDispatch } from "react-redux";
import { removeReview, fetchReviewsForSpot } from "../../store/reviews";
import { fetchSpotDetails } from "../../store/spots";

function DeleteReviewModal({ reviewId, spotId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(removeReview(reviewId));
      dispatch(fetchReviewsForSpot(spotId));
      dispatch(fetchSpotDetails(spotId));
      closeModal();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <div className="modal-container">
      <h1>Confirm Delete</h1>
      <h4 className="h4-container">Are you sure you want to delete this review?</h4>
      <div className="action-buttons">
        <button onClick={handleDelete} className="yes">Yes (Delete Review)</button>
        <button onClick={closeModal} className="no">No (Keep Review)</button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;