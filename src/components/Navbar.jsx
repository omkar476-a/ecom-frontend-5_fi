import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Navbar = ({ onSelectCategory }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light-theme");
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark-theme" ? "light-theme" : "dark-theme");
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length > 0) {
      try {
        const response = await axios.get(
          `http://spring-boot-project-2.onrender.com/api/product/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setSearchResults([]);
      setNoResults(false);
      setShowSearchResults(false);
    }
  };

  // Hide search on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="https://organicindia.com/">Organic</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link active" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/add_product">Add Product</a></li>
              <li className="nav-item"><a className="nav-link" href="/wtparts">Windchill Parts</a></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown">
                  Categories
                </a>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button className="dropdown-item" onClick={() => onSelectCategory(category)}>
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>

              {/* ✅ Added Login & Register Links */}
              <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
              <li className="nav-item"><a className="nav-link" href="/register">Register</a></li>
            </ul>

            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "dark-theme" ? <i className="bi bi-moon-fill" /> : <i className="bi bi-sun-fill" />}
            </button>

            <div className="d-flex align-items-center position-relative" ref={searchRef}>
              <a href="/cart" className="nav-link text-dark me-2">
                <i className="bi bi-cart"> Cart</i>
              </a>

              <input
                className="form-control"
                type="search"
                placeholder="Search"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
              />

              {showSearchResults && (
                <ul className="list-group position-absolute" style={{ top: "100%", zIndex: 1000, width: "100%" }}>
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <li key={result.id} className="list-group-item">
                        <a href={`/product/${result.id}`} className="search-result-link">
                          {result.name}
                        </a>
                      </li>
                    ))
                  ) : (
                    noResults && <li className="list-group-item text-danger">No Product with such Name</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
