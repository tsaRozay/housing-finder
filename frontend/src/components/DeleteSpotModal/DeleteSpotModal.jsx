import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots';
import './DeleteSpotModal.css';

const DeleteSpotModal = ({ spot, closeModal }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    await dispatch(deleteSpot(spot.id));
    closeModal();
  };

  return (
    <div className="delete-modal-container">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <div className="delete-modal-buttons">
        <button className="confirm-delete-btn" onClick={handleDelete}>
          Yes (Delete Spot)
        </button>
        <button className="cancel-delete-btn" onClick={closeModal}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
};

export default DeleteSpotModal;
