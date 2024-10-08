import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import { AiOutlineReload } from "react-icons/ai";
import formatPrice from "../components/formatPrice";
import banner from "../Images/banner.jpg";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const { cart, setCart, handleCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // New state for total pages
  const [loading, setLoading] = useState(false);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.allCategories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Get products based on page
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
      setTotalPages(data.totalPages); // Update total pages
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Load more products when page changes
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
      setTotalPages(data.totalPages); // Update total pages
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Filter products by category and price
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length && !radio.length) {
      getAllProducts();
    } else {
      filterProduct();
    }
  }, [checked, radio, page]);

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `/api/v1/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"Shark Electronics - Home"}>
      {/* banner image */}
      <img src={banner} className="banner-img" alt="bannerimage" />
      {/* banner image */}
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filters By Category</h4>
          <hr />
          <div className="d-flex flex-column mx-2">
            {categories?.map((c, i) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
                className={`${i === 0 ? "mx-0" : ""}`}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filters By Price</h4>
          <hr />
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <button
            className="btn btn-danger mb-2"
            onClick={() => window.location.reload()}
          >
            RESET FILTERS
          </button>
        </div>
        <div className="col-md-9 allProducts">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-3" key={p._id}>
                <img
                  src={`/api/v1/product/get-photo/${p._id}`}
                  className="card-img-top"
                  style={{ cursor: "pointer" }}
                  width={"100%"}
                  onClick={() => navigate(`/product/${p.slug}`)}
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      ₹{formatPrice(p.price)}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 30)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className={`btn btn-dark ms-1 ${!auth?.user && "d-none"}`}
                      onClick={() => handleCart(auth?.user?._id, p._id)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  if (page >= totalPages) {
                    setPage(1);
                  } else {
                    setPage(page + 1);
                  }
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    Load more <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
