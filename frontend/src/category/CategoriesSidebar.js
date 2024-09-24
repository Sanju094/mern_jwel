import React, { useState, useEffect } from "react";
import "./CategoriesSidebar.css"; 
import { Link } from "react-router-dom";

const typesByCategory = {
  Gold: [
    "Ring",
    "Earring",
    "Kadas",
    "Bracelet",
    "Bangle",
    "Chain",
    "Mangalyam",
    "Necklace",
    "Haram",
  ],
  Silver: ["Ring", "Earring", "Bracelet", "Chain", "Anklet"],
  Diamond: ["Ring", "Earring", "Nosepin", "Necklace"],
  Gifts: ["God statue", "Vizhaku", "Pen", "Pendant", "Mugappu"],
};

const CategoriesSidebar = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);

  const fetchProducts = async (category, type) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/propro?category=${category}&type=${type}`
      );
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Network response was not ok: ${errorDetails}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubcategoryClick = (category, subcategory) => {
    fetchProducts(category, subcategory);
  };

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <div className="sidebar">
            <h2>Categories</h2>
            {Object.entries(typesByCategory).map(
              ([category, subcategories]) => (
                <div key={category} className="category-card">
                  <h3 onClick={() => handleCategoryClick(category)}>
                    <b style={{ cursor: "pointer" }}>{category}</b>
                    <span className="toggle-icon">
                      {openCategory === category ? "▲" : "▼"}
                    </span>
                  </h3>
                  {openCategory === category && (
                    <ul>
                      {subcategories.map((subcategory) => (
                        <li
                          key={subcategory}
                          onClick={() =>
                            handleSubcategoryClick(category, subcategory)
                          }
                        >
                          {subcategory}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        <div className="col-6">
          <div className="content">
            <h2>All Products</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <div className="product-list">
              {products.length > 0 ? (
                products.map((product) => (
                  <div className={`col-sm-12 col-md-6 col-lg-9 my-3`}>
                    <div className="card p-3 rounded">
                      {product.images.length > 0 && (
                        <img
                          className="card-img-top mx-auto"
                          src={product.images[0].image}
                          alt={product.name}
                        />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">
                          <Link to={`/product/${product._id}`}>
                            {product.name}
                          </Link>
                        </h5>
                        <div className="ratings mt-auto">
                          <div className="rating-outer">
                            <div
                              className="rating-inner"
                              style={{
                                width: `${(product.ratings / 5) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span id="no_of_reviews">
                            ({product.numOfReviews} Reviews)
                          </span>
                        </div>
                        <p
                          className="card-text"
                          style={{ textDecoration: "line-through" }}
                        >
                          ₹{product.price}
                        </p>
                        <h4>Our Price</h4>
                        <b>
                          <p className="card-text">₹{product.rtprice}</p>
                        </b>
                        <Link
                          to={`/product/${product._id}`}
                          id="view_btn"
                          className="btn btn-block"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                {/* <img src="E:\consultancy\ecom\frontend\public\images\search.jpg"/> */}
                <p>Choose category to get the products.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesSidebar;
