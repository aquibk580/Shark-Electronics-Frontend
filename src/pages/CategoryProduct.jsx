import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import capitalizeFirstLetter from "../components/Capital";
import axios from "axios";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import formatPrice from "../components/formatPrice";
import "../styles/Category.css";

const CategoryProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [auth, setAuth] = useAuth();
  const { handleCart } = useCart();
  const [products, setProduct] = useState([]);
  const [category, setCategory] = useState([]);

  const getProductByCat = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProduct(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.slug) getProductByCat();
  }, [params?.slug]);
  return (
    <Layout title={capitalizeFirstLetter(params.slug) + " - Category"}>
      <div className="container mt-1 category">
        <h4 className="text-center">Categorys - {category?.name}</h4>
        <h6 className="text-center">{products?.length} Result Found</h6>
        <div className="row">
          <div className="col-md-9">
            <div className="d-flex flex-wrap justify-content-center">
              {products?.map((p) => (
                <div
                  className="card m-2 my-4"
                  style={{ width: "18rem" }}
                  key={p._id}
                >
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/get-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    height="200px"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-title card-price">
                      {" "}
                      ₹{formatPrice(p.price)}
                    </p>
                    <p className="card-text">
                      {p.description.substring(0, 30)}...
                    </p>
                    <button
                      className="btn btn-primary ms-1 mb-2"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
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
      </div>
    </Layout>
  );
};

export default CategoryProduct;
