import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import "../styles/ProductDetails.css";
import formatPrice from "../components/formatPrice";

const ProductDetails = () => {
  const [auth, setAuth] = useAuth();
  const { handleCart } = useCart();
  const navigate = useNavigate();
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // get Product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getRelatedProdcuts(data?.product?._id, data?.product?.category?._id);
    } catch (error) {
      console.log(error);
    }
  };
  // get related Products
  const getRelatedProdcuts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title="Product - More Details">
      <div className="row container product-details">
        <div className="col-md-6 product-image">
          <img
            src={`/api/v1/product/get-photo/${product._id}`}
            className=""
            alt={product.name}
            height="400px"
            width={"400px"}
          />
        </div>
        <div className="col-md-6 product-details-info card">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h5>{product.name}</h5>
          <hr />
          <h5>{product.description}</h5>
          <hr />
          <h5>₹{product?.price}</h5>
          <hr />
          <h5>Category : {product?.category?.name}</h5>
          <hr />
          <button
            class={`btn btn-secondary ms-1 ${!auth?.user && "d-none"}`}
            onClick={() => handleCart(auth?.user?._id, product._id)}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap similar-products-container">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`/api/v1/product/get-photo/${p._id}`}
                className="card-img-top"
                onClick={() => navigate(`/product/${p.slug}`)}
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">₹{formatPrice(p.price)}</h5>
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
                  {/* <button
                className="btn btn-dark ms-1"
                onClick={() => {
                  setCart([...cart, p]);
                  localStorage.setItem(
                    "cart",
                    JSON.stringify([...cart, p])
                  );
                  toast.success("Item Added to cart");
                }}
              >
                ADD TO CART
              </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
