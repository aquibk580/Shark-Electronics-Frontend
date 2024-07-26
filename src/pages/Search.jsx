import React from "react";
import { useSearch } from "../context/search";
import formatPrice from "../components/formatPrice";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";

const Search = () => {
  const [values, setValues] = useSearch();
  const [auth, setAuth] = useAuth();
  const { handleCart } = useCart();

  // Ensure values.results is an array
  const results = Array.isArray(values.results) ? values.results : [];

  return (
    <Layout title="Search Results - Ecommerce App">
      <div className="container mt-3">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {results.length < 1 ? "No Product Found" : `Found ${results.length}`}
          </h6>
          <div className="d-flex flex-wrap justify-content-center">
            {results.length > 0 &&
              results.map((p) => (
                <div
                  className="card m-2"
                  style={{ width: "18rem" }}
                  key={p._id}
                >
                  <img
                    src={`/api/v1/product/get-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="card-text"> ₹{formatPrice(p.price)}</p>
                    <button className="btn btn-primary ms-1">
                      More Details
                    </button>
                    <button
                      className={`btn btn-secondary ms-1 ${
                        !auth?.user && "d-none"
                      }`}
                      onClick={() => handleCart(auth?.user?._id, p._id)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
