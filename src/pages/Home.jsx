import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../hooks/useApi";
import ListingCard from "../components/ListingCard";
import "../styles/pages/Home.scss";

const CATEGORIES = [
  "Alla kategorier",
  "Elektronik",
  "Fordon",
  "Möbler",
  "Kläder",
  "Sport & Fritid",
  "Övrigt",
];

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alla kategorier");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== "Alla kategorier")
        params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await api.get("/listings", { params });
      setListings(response.data);
    } catch (err) {
      console.error("Kunde inte hämta annonser:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchListings();
  };

  const handleListingClick = (listingId) => {
    navigate(`/listings/${listingId}`);
  };

  return (
    <div className="home">
      <div className="home__hero">
        <form className="home__search-bar" onSubmit={handleSearch}>
          <input
            className="home__search-input"
            type="text"
            placeholder="Vad letar du efter?"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button className="home__search-button" type="submit">
            Sök
          </button>
        </form>
      </div>

      <div className="home__content">
        <aside className="home__sidebar">
          <div className="home__filter-section">
            <h3 className="home__filter-title">Kategorier</h3>
            <ul className="home__categories">
              {CATEGORIES.map((category) => (
                <li
                  key={category}
                  className={`home__category ${selectedCategory === category ? "home__category--active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="home__filter-section">
            <h3 className="home__filter-title">Pris</h3>
            <div className="home__price-inputs">
              <input
                className="home__price-input"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />
              <span>-</span>
              <input
                className="home__price-input"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </div>
            <button className="home__filter-button" onClick={fetchListings}>
              Tillämpa filter
            </button>
          </div>
        </aside>

        <div className="home__listings">
          <div className="home__listings-header">
            <h2 className="home__listings-title">
              {selectedCategory === "Alla kategorier"
                ? "Senaste annonserna"
                : selectedCategory}
            </h2>
            <span className="home__listings-count">
              {listings.length} annonser
            </span>
          </div>

          {loading ? (
            <div className="home__loading">Laddar annonser...</div>
          ) : listings.length === 0 ? (
            <div className="home__empty">Inga annonser hittades</div>
          ) : (
            <div className="home__grid">
              {listings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  onClick={() => handleListingClick(listing._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
