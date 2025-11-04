import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./ImageSlider.css";
import Chatbot from "./Chatbot";

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

function ImageSlider() {
  const history = useHistory();
  const queryParams = useQueryParams();

  const [selectedCategory, setSelectedCategory] = useState(queryParams.get("category") || "bookName");
  const [query, setQuery] = useState(queryParams.get("query") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/books?category=${selectedCategory}&query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="image-container">
      {/* Background Image */}
      <img className="d-block w-100" src="/school_picture4.jpg" alt="CUSV Library" />
      <div className="image-overlay"></div>

      {/* Header */}
      <div className="search-header">
        <h1>Welcome to CUSV Library</h1>
        <p>Search for books, articles, and resources to support your studies.</p>
      </div>

      {/* Search Bar */}
      <div className="search-box">
        <select
          className="filter-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="bookName">Book</option>
          <option value="author">Author</option>
          <option value="categories">Category</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
        />

        <button type="submit" onClick={handleSearch}>🔍</button>
      </div>
      <Chatbot />
    </div>
  );
}

export default ImageSlider;
