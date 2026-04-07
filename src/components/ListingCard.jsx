import "../styles/components/ListingCard.scss";

const ListingCard = ({ listing, onClick }) => {
  const imageUrl = listing.image
    ? `https://blocket-clone.onrender.com${listing.image}`
    : null;

  return (
    <div className="listing-card" onClick={onClick}>
      <div className="listing-card__image-wrapper">
        {imageUrl ? (
          <img
            className="listing-card__image"
            src={imageUrl}
            alt={listing.title}
          />
        ) : (
          <div className="listing-card__no-image">Ingen bild</div>
        )}
      </div>
      <div className="listing-card__body">
        <h3 className="listing-card__title">{listing.title}</h3>
        <p className="listing-card__price">
          {listing.price.toLocaleString("sv-SE")} kr
        </p>
        <p className="listing-card__category">{listing.category}</p>
        <p className="listing-card__seller">
          {listing.user?.username || "Okänd säljare"}
        </p>
      </div>
    </div>
  );
};

export default ListingCard;
