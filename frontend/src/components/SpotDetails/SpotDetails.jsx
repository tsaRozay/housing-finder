// src/components/Spots/SpotDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import { fetchSpotReviews } from '../../store/reviews';
import ReviewsList from '../Reviews/ReviewsList';
import './SpotDetails.css';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.singleSpot);
  const reviews = useSelector(state => Object.values(state.reviews.spot || {}));
  const user = useSelector(state => state.session.user);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchSpotReviews(spotId));
  }, [dispatch, spotId]);

  if (!spot.id) {
    return <div className="loading">Loading spot details...</div>;
  }

  // Check if current user is the owner
  const isOwner = user && spot.Owner && user.id === spot.Owner.id;
  
  // Check if current user already has a review
  const hasReview = user && reviews.some(review => review.userId === user.id);
  
  // Determine if "Post Your Review" button should be shown
  const showPostReviewButton = user && !isOwner && !hasReview;

  // Calculate average rating and review count
  const avgRating = spot.avgRating || 0;
  const reviewCount = reviews.length;
  
  // Format review count text
  const reviewCountText = reviewCount === 1 ? '1 Review' : `${reviewCount} Reviews`;

  // Handle reserve button click
  const handleReserve = () => {
    alert('Feature coming soon');
  };

  // Handle open review form
  const handlePostReview = () => {
    setShowReviewForm(true);
  };

  return (
    <div className="spot-details-container">
      <h1 className="spot-name">{spot.name}</h1>
      <p className="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </p>
      
      <div className="spot-images">
        <div className="main-image">
          {spot.SpotImages && spot.SpotImages.length > 0 ? (
            <img src={spot.SpotImages[0].url} alt={spot.name} />
          ) : (
            <div className="placeholder-image">No image available</div>
          )}
        </div>
        <div className="small-images">
          {spot.SpotImages && spot.SpotImages.slice(1, 5).map((image, idx) => (
            <div key={idx} className="small-image">
              <img src={image.url} alt={`${spot.name} ${idx + 2}`} />
            </div>
          ))}
          {/* Add placeholder images if there are less than 4 additional images */}
          {spot.SpotImages && [...Array(Math.max(0, 4 - (spot.SpotImages.length - 1)))].map((_, idx) => (
            <div key={`placeholder-${idx}`} className="small-image placeholder-image">
              No image
            </div>
          ))}
        </div>
      </div>
      
      <div className="spot-info-container">
        <div className="spot-host-description">
          <h2>
            Hosted by {spot.Owner ? `${spot.Owner.firstName} ${spot.Owner.lastName}` : 'Unknown Host'}
          </h2>
          <p className="spot-description">{spot.description}</p>
        </div>
        
        <div className="spot-booking-info">
          <div className="booking-callout">
            <div className="price-rating">
              <span className="price">${spot.price} night</span>
              <div className="rating-summary">
                <span className="stars">
                  <i className="fas fa-star"></i>
                  {avgRating > 0 ? parseFloat(avgRating).toFixed(1) : 'New'}
                </span>
                {reviewCount > 0 && (
                  <>
                    <span className="dot">·</span>
                    <span className="review-count">{reviewCountText}</span>
                  </>
                )}
              </div>
            </div>
            <button className="reserve-button" onClick={handleReserve}>
              Reserve
            </button>
          </div>
        </div>
      </div>
      
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>
            <i className="fas fa-star"></i>
            {avgRating > 0 ? parseFloat(avgRating).toFixed(1) : 'New'}
            {reviewCount > 0 && (
              <>
                <span className="dot">·</span>
                <span className="review-count">{reviewCountText}</span>
              </>
            )}
          </h2>
          
          {showPostReviewButton && (
            <button className="post-review-button" onClick={handlePostReview}>
              Post Your Review
            </button>
          )}
        </div>
        
        {/* Show "Be the first to post a review!" if no reviews and user is logged in and not owner */}
        {reviewCount === 0 && user && !isOwner ? (
          <p className="no-reviews-message">Be the first to post a review!</p>
        ) : (
          <ReviewsList reviews={reviews} currentUser={user} />
        )}
      </div>
    </div>
  );
};

export default SpotDetails;