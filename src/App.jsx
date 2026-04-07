import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListingDetail from "./pages/ListingDetail";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/:id/edit" element={<EditListing />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
