import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../hooks/useApi";
import "../styles/pages/ListingDetail.scss";

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        setError("Annonsen hittades inte");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Är du säker på att du vill ta bort annonsen?")) return;
    try {
      await api.delete(`/listings/${id}`);
      navigate("/");
    } catch (err) {
      setError("Kunde inte ta bort annonsen");
    }
  };

  const isOwner = user && listing && user.id === listing.user._id;

  if (loading)
    return <div className="listing-detail__loading">Laddar annons...</div>;
  if (error) return <div className="listing-detail__error">{error}</div>;

  return (
    <div className="listing-detail">
      <button className="listing-detail__back" onClick={() => navigate(-1)}>
        ← Tillbaka
      </button>

      <div className="listing-detail__content">
        <div className="listing-detail__image-wrapper">
          {listing.image ? (
            <img
              className="listing-detail__image"
              src={listing.image}
              alt={listing.title}
            />
          ) : (
            <div className="listing-detail__no-image">
              Ingen bild tillgänglig
            </div>
          )}
        </div>

        <div className="listing-detail__info">
          <div className="listing-detail__card">
            <h1 className="listing-detail__title">{listing.title}</h1>
            <p className="listing-detail__price">
              {listing.price.toLocaleString("sv-SE")} kr
            </p>
            <span className="listing-detail__category">{listing.category}</span>

            <div className="listing-detail__divider" />

            <h2 className="listing-detail__section-title">Beskrivning</h2>
            <p className="listing-detail__description">{listing.description}</p>

            <div className="listing-detail__divider" />

            <h2 className="listing-detail__section-title">Säljare</h2>
            <p className="listing-detail__seller">{listing.user?.username}</p>

            <p className="listing-detail__date">
              Publicerad{" "}
              {new Date(listing.createdAt).toLocaleDateString("sv-SE")}
            </p>

            {isOwner && (
              <div className="listing-detail__owner-actions">
                <button
                  className="listing-detail__edit-button"
                  onClick={() => navigate(`/listings/${id}/edit`)}
                >
                  Redigera annons
                </button>
                <button
                  className="listing-detail__delete-button"
                  onClick={handleDelete}
                >
                  Ta bort annons
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
