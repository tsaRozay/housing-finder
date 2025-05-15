import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";
const ADD_SPOT = "spots/ADD_SPOT";
const EDIT_SPOT = "spots/EDIT_SPOT";
const REMOVE_SPOT = "spots/REMOVE_SPOT";

// Action Creators
const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

const loadSpotDetails = (spot) => ({
    type: LOAD_SPOT_DETAILS,
    spot,
});

const addSpot = (spot) => ({
    type: ADD_SPOT,
    spot,
});

const editSpot = (spot) => ({
    type: EDIT_SPOT,
    spot,
});

const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId,
});

// Thunks
export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots");

    if (response.ok) {
        const { Spots } = await response.json();
        const normalizedSpots = Spots.reduce((acc, spot) => {
            acc[spot.id] = spot;
            return acc;
        }, {});
        dispatch(loadSpots(normalizedSpots));
    }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadSpotDetails(spot));
    }
};

export const createSpot = (spotData, imageUrls) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spotData),
    });

    if (response.ok) {
        const newSpot = await response.json();
        dispatch(addSpot(newSpot));

        for (let i = 0; i < imageUrls.length; i++) {
            await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: imageUrls[i], preview: i === 0 }),
            });
        }

        return newSpot;
    } else {
        const errorData = await response.json();
        throw errorData;
    }
};

export const updateSpot = (spotId, updatedData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });

    if (response.ok) {
        const updatedSpot = await response.json();
        dispatch(editSpot(updatedSpot));
        return updatedSpot;
    } else {
        const errorData = await response.json();
        throw errorData;
    }
};

export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(removeSpot(spotId));
    } else {
        const errorData = await response.json();
        throw errorData;
    }
};

// Initial State
const initialState = {
    allSpots: {},
    spotDetails: {},
};

// Reducer
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            return { ...state, allSpots: { ...action.spots } };

        case LOAD_SPOT_DETAILS:
            return {
                ...state,
                allSpots: { ...state.allSpots, [action.spot.id]: action.spot },
                spotDetails: action.spot,
            };

        case ADD_SPOT:
            return {
                ...state,
                allSpots: { ...state.allSpots, [action.spot.id]: action.spot },
                spotDetails: action.spot,
            };

        case EDIT_SPOT:
            return {
                ...state,
                allSpots: { ...state.allSpots, [action.spot.id]: action.spot },
                spotDetails: action.spot,
            };

        case REMOVE_SPOT: {
            const updatedSpots = { ...state.allSpots };
            delete updatedSpots[action.spotId];

            return {
                ...state,
                allSpots: { ...updatedSpots },
                spotDetails:
                    state.spotDetails.id === action.spotId
                        ? {}
                        : state.spotDetails,
            };
        }

        default:
            return state;
    }
};

export default spotsReducer;