import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../hooks/useApi";
import "../styles/pages/CreateListing.scss";

const CATEGORIES = [
  "Elektronik",
  "Fordon",
  "Möbler",
  "Kläder",
  "Sport & Fritid",
  "Övrigt",
];

const EditListing = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        const listing = response.data;

        if (user?.id !== listing.user._id) {
          navigate("/");
          return;
        }

        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
        });
        if (listing.image) {
          setImagePreview(`https://blocket-clone.onrender.com${listing.image}`);
        }
      } catch (err) {
        setError("Annonsen hittades inte");
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("category", formData.category);
      if (image) submitData.append("image", image);

      await api.put(`/listings/${id}`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing">
      <div className="create-listing__card">
        <h1 className="create-listing__title">Redigera annons</h1>

        {error && <div className="create-listing__error">{error}</div>}

        <form className="create-listing__form" onSubmit={handleSubmit}>
          <div className="create-listing__field">
            <label className="create-listing__label">Titel</label>
            <input
              className="create-listing__input"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="create-listing__field">
            <label className="create-listing__label">Kategori</label>
            <select
              className="create-listing__select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Välj kategori</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="create-listing__field">
            <label className="create-listing__label">Pris (kr)</label>
            <input
              className="create-listing__input"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="create-listing__field">
            <label className="create-listing__label">Beskrivning</label>
            <textarea
              className="create-listing__textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className="create-listing__field">
            <label className="create-listing__label">Bild</label>
            <label className="create-listing__image-upload">
              {imagePreview ? (
                <img
                  className="create-listing__image-preview"
                  src={imagePreview}
                  alt="Förhandsvisning"
                />
              ) : (
                <div className="create-listing__image-placeholder">
                  <span className="create-listing__image-icon">📷</span>
                  <span>Klicka för att ladda upp bild</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <button
            className="create-listing__submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sparar..." : "Spara ändringar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
