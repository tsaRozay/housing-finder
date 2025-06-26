import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpot, fetchSpots } from "../../store/spots";
import "./DeleteSpotModal.css";

function DeleteSpotModal({ spot }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await dispatch(deleteSpot(spot.id));
            setTimeout(() => dispatch(fetchSpots()), 200);
            closeModal();
        } catch (error) {
            console.error("Failed to delete spot:", error);
        }
    };

    return (
        <div className="delete-modal">
            <h1>Confirm Delete</h1>
            <h4 className="h4-container">Are you sure you want to remove this spot?</h4>
            <div className="action-buttons">
                <button onClick={handleDelete} className="yes">Yes (Delete Spot)</button>
                <button onClick={closeModal} className="no">No (Keep Spot)</button>
            </div>
        </div>
    );
}

export default DeleteSpotModal;
