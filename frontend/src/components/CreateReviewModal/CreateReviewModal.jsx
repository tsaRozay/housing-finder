import './CreateReviewModal.css';
import { IoMdStar } from "react-icons/io";
import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { submitReview, fetchReviewsForSpot } from "../../store/reviews";
import { fetchSpotDetails } from "../../store/spots";
import { useModal } from "../../context/Modal";

function CreateReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setRating(0);
    setHoverRating(0);
    setReview('');
    setError(null);
  }, [spotId]);

  const fillStars = () => {
    return [0, 1, 2, 3, 4].map((index) => (
      <IoMdStar
        key={index}
        className={index < (hoverRating || rating) ? 'filled-star' : 'empty-star'}
        onClick={() => setRating(index + 1)}
        onMouseEnter={() => setHoverRating(index + 1)}
        onMouseLeave={() => setHoverRating(0)}
      />
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(submitReview(spotId, { review, stars: rating }));
      await dispatch(fetchReviewsForSpot(spotId));
      await dispatch(fetchSpotDetails(spotId));
      closeModal();
    } catch (err) {
      if (err instanceof Response) {
        try {
          const errorData = await err.json();
          setError(errorData.message || "Something went wrong. Please try again.");
        } catch (parseError) {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className='review-modal-container'>
      <h1 className='header-title'>How was your stay?</h1>
      {error && <p className='review-error'>{error}</p>}

      <textarea
        value={review}
        className='text'
        placeholder="Leave your review here..."
        onChange={(e) => setReview(e.target.value)}
      />

      <div className='stars-div'>
        {fillStars()}
      </div>
      <p className='stars-label'>Stars</p>

      <button
        className='submit-review-button'
        type="submit"
        onClick={handleSubmit}
        disabled={review.length < 10 || rating === 0}
      >
        Submit Your Review
      </button>
    </div>
  );
}

export default CreateReviewModal;
