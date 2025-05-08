import { csrfFetch } from "./csrf";

// Action Types
const LOAD_REVIEWS = "reviews/LOAD_REVIEWS";
const LOAD_USER_REVIEWS = "reviews/LOAD_USER_REVIEWS";
const CREATE_REVIEW = "reviews/CREATE_REVIEW";
const EDIT_REVIEW = "reviews/EDIT_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

// Action Creators
const loadReviews = (spotId, reviews) => ({
    type: LOAD_REVIEWS,
    payload: { spotId, reviews },
});

const loadUserReviews = (reviews) => ({
    type: LOAD_USER_REVIEWS,
    payload: reviews,
});

const createReviewAction = (spotId, review) => ({
    type: CREATE_REVIEW,
    payload: { spotId, review },
});

const editReviewAction = (spotId, review) => ({
    type: EDIT_REVIEW,
    payload: { spotId, review },
});

const deleteReviewAction = (reviewId, spotId) => ({
    type: DELETE_REVIEW,
    payload: { reviewId, spotId },
});

// Thunks
export const fetchReviewsForSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    dispatch(loadReviews(spotId, data.Reviews));
};

export const fetchUserReviews = () => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/current`);
    const data = await response.json();
    dispatch(loadUserReviews(data.Reviews));
};

export const submitReview = (spotId, reviewData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(reviewData),
    });
    const newReview = await response.json();
    dispatch(createReviewAction(spotId, newReview));
    dispatch(fetchReviewsForSpot(spotId));
    return true;
};

export const modifyReview = (reviewId, reviewData) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(reviewData),
    });
    const updatedReview = await response.json();
    dispatch(editReviewAction(updatedReview.spotId, updatedReview));
    dispatch(fetchReviewsForSpot(updatedReview.spotId));
    return updatedReview;
};

export const removeReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(deleteReviewAction(reviewId, data.spotId));
    } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review");
    }
};

// Initial State
const initialState = {
    reviewsBySpot: {},
    userReviews: {},
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const { spotId, reviews } = action.payload;
            const formattedReviews = reviews.reduce((acc, review) => {
                acc[review.id] = review;
                return acc;
            }, {});
            return {
                ...state,
                reviewsBySpot: {
                    ...state.reviewsBySpot,
                    [spotId]: formattedReviews,
                },
            };
        }
        case LOAD_USER_REVIEWS: {
            const formattedReviews = action.payload.reduce((acc, review) => {
                acc[review.id] = review;
                return acc;
            }, {});
            return { ...state, userReviews: formattedReviews };
        }
        case CREATE_REVIEW: {
            const { spotId, review } = action.payload;
            return {
                ...state,
                reviewsBySpot: {
                    ...state.reviewsBySpot,
                    [spotId]: {
                        ...(state.reviewsBySpot[spotId] || {}),
                        [review.id]: review,
                    },
                },
            };
        }
        case EDIT_REVIEW: {
            const { spotId, review } = action.payload;
            return {
                ...state,
                reviewsBySpot: {
                    ...state.reviewsBySpot,
                    [spotId]: {
                        ...(state.reviewsBySpot[spotId] || {}),
                        [review.id]: review,
                    },
                },
                userReviews: {
                    ...state.userReviews,
                    [review.id]: review,
                },
            };
        }
        case DELETE_REVIEW: {
            const { reviewId, spotId } = action.payload;
            const updatedSpotReviews = { ...state.reviewsBySpot[spotId] };
            delete updatedSpotReviews[reviewId];

            const updatedUserReviews = { ...state.userReviews };
            delete updatedUserReviews[reviewId];

            return {
                ...state,
                reviewsBySpot: {
                    ...state.reviewsBySpot,
                    [spotId]: updatedSpotReviews,
                },
                userReviews: updatedUserReviews,
            };
        }
        default:
            return state;
    }
};

export default reviewsReducer;