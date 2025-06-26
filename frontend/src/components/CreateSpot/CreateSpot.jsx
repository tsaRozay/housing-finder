import "./CreateSpot.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createSpot, updateSpot, fetchSpotDetails } from "../../store/spots";

function CreateSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const user = useSelector((state) => state.session.user);
  const existingSpot = useSelector((state) => state.spots.spotDetails);

  const isUpdate = Boolean(spotId);
  const [errors, setErrors] = useState({});

  const [spotData, setSpotData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    price: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [otherImages, setOtherImages] = useState(["", "", "", ""]);

  useEffect(() => {
    if (!user) navigate("/", { state: { error: "Please login to create a spot" }, replace: true });
    if (isUpdate) dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId, user, navigate, isUpdate]);

  useEffect(() => {
    if (isUpdate && existingSpot) {
      setSpotData({
        name: existingSpot.name || "",
        address: existingSpot.address || "",
        city: existingSpot.city || "",
        state: existingSpot.state || "",
        country: existingSpot.country || "",
        price: existingSpot.price || "",
        description: existingSpot.description || "",
        latitude: existingSpot.lat || "",
        longitude: existingSpot.lng || "",
      });
      setPreviewImage(existingSpot.SpotImages?.[0]?.url || "");
      setOtherImages(existingSpot.SpotImages?.slice(1).map((img) => img.url) || ["", "", "", ""]);
    }
  }, [existingSpot, isUpdate]);

  const handleChange = (e) => {
    setSpotData({ ...spotData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...otherImages];
    updatedImages[index] = value;
    setOtherImages(updatedImages);
  };

  const validateFields = () => {
    const errors = {};
    const urlRegex = /(png|jpg|jpeg)$/i;
    if (!spotData.name) errors.name = "A name is required";
    if (!spotData.address) errors.address = "An address is required";
    if (!spotData.city) errors.city = "A city is required";
    if (!spotData.state) errors.state = "A state is required";
    if (!spotData.country) errors.country = "A country is required";
    if (!spotData.price || spotData.price <= 0) errors.price = "Price must be greater than 0";
    if (!spotData.description || spotData.description.length < 30) errors.description = "Description must be at least 30 characters";
    if (!previewImage || !urlRegex.test(previewImage)) errors.previewImage = "Image URL needs to end in .png or .jpg (or .jpeg)";
    otherImages.forEach((url) => {
      if (url.trim() && !urlRegex.test(url)) {
        errors.otherImages = "All images must be valid URLs ending in .png, .jpg, or .jpeg";
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedData = {
      ...spotData,
      price: parseFloat(spotData.price),
      lat: spotData.latitude ? parseFloat(spotData.latitude) : null,
      lng: spotData.longitude ? parseFloat(spotData.longitude) : null,
    };
    const imageUrls = [previewImage, ...otherImages.filter((url) => url.trim())];

    try {
      const spot = isUpdate ? await dispatch(updateSpot(spotId, formattedData)) : await dispatch(createSpot(formattedData, imageUrls));
      navigate(`/spots/${spot.id}`);
    } catch (error) {
      console.error("Error submitting spot:", error);
    }
  };

  return (
    <div className="create-spot-container">
      <h1>{isUpdate ? "Update Your Spot" : "Create a New Spot"}</h1>
      <form onSubmit={handleSubmit}>
      <h2>Wheres your place located?</h2>
      <p className="caption">Guests will only get your exact address once they booked a reservation.</p>
      <label>Country<input name="country" value={spotData.country} onChange={handleChange} /></label>
      {errors.country && <span className="error">{errors.country}</span>}

      <label>Street Address<input name="address" value={spotData.address} onChange={handleChange} /></label>
      {errors.address && <span className="error">{errors.address}</span>}

      <label>City<input name="city" value={spotData.city} onChange={handleChange} /></label>
      {errors.city && <span className="error">{errors.city}</span>}

      <label>State<input name="state" value={spotData.state} onChange={handleChange} /></label>
      {errors.state && <span className="error">{errors.state}</span>}


      <h2>Describe your place to guests</h2>
      <p className="caption">
      Mention the best features of your space, any special amenities like fast wifi or parking,
      and what you love about the neighborhood.
       </p>
      <label>Description<textarea name="description" value={spotData.description} onChange={handleChange} /></label>
      {errors.description && <span className="error">{errors.description}</span>}


      <h2>Create a title for your spot</h2>
      <p className="caption">
      Catch guests&#39 attention with a spot title that highlights what makes your place special.
      </p>
      <label>Name<input name="name" value={spotData.name} onChange={handleChange} /></label>
      {errors.name && <span className="error">{errors.name}</span>}


      <h2>Set a base price for your spot</h2>
      <p className="caption">
      Competitive pricing can help your listing stand out and rank higher in search results.
      </p>
      <label>Price<input name="price" type="number" min="1" value={spotData.price} onChange={handleChange} /></label>
      {errors.price && <span className="error">{errors.price}</span>}


      <h2>Liven up your spot with photos</h2>
      <p className="caption">
      Submit a link to at least one photo to publish your spot.
      </p>
      <label>Preview Image URL<input value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} /></label>
      {errors.previewImage && <span className="error">{errors.previewImage}</span>}

{otherImages.map((url, index) => (
  <div key={index}>
    <input placeholder="Image URL" value={url} onChange={(e) => handleImageChange(index, e.target.value)} />
    {errors.otherImages && <span className="error">{errors.otherImages}</span>}
  </div>
))}


        <div className="button-container">
        <button type="submit" disabled={Object.keys(validateFields()).length > 0}>
        {isUpdate ? "Update Listing" : "Create Spot"}
        </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSpot;