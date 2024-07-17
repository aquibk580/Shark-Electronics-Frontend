import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import "../styles/Cart.css";
import formatPrice from "../components/formatPrice";

const CartPage = () => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const { cart, setCart } = useCart();
  const [auth, setAuth] = useAuth();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  //Total Price
  useEffect(() => {
    const calculateTotalPrice = () => {
      try {
        const total = cart?.items?.reduce((acc, item) => {
          return acc + item.productId.price * item.quantity;
        }, 0);

        setTotalPrice(
          total?.toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
          })
        );
      } catch (error) {
        console.error(error);
      }
    };
    calculateTotalPrice();
  }, [cart]);

  // Remove Item
  const removeCartItem = async (userId, productId) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/cart/delete-cartitem/${userId}/${productId}`
      );
      if (data?.success) {
        const updatedCartItems = cart.items.filter(
          (item) => item.productId._id !== productId
        );

        setCart({
          ...cart,
          items: updatedCartItems,
          updatedAt: new Date().toISOString(),
        });

        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const removeAllCartItems = async () => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/cart/remove-allitems/${auth?.user._id}`
      );
      if (data?.success) {
        setCart({ ...cart, items: [] });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      toast.success(data.message);
      await removeAllCartItems();
      navigate("/dashboard/user/orders");
    } catch (error) {
      setLoading(false);
      console.error("Payment Error:", error);
      toast.error("Payment failed");
    }
  };

  const handleQtyChange = async (userId, productId, action) => {
    try {
      const url =
        action === "increase"
          ? `${process.env.REACT_APP_API}/api/v1/cart/increase-quantity`
          : `${process.env.REACT_APP_API}/api/v1/cart/decrease-quantity`;
      const response = await axios.post(url, { userId, productId });
      const { data, status } = response;

      if (status === 200 && data?.success) {
        setCart(data?.cart);
        toast.success(data?.message);
      } else if (status === 400) {
        toast.error(data?.message);
        window.alert(data?.message);
        console.error(data?.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          const { message } = error.response.data;
          toast.error(message);
        } else {
          toast.error("An error occurred");
        }
      } else if (error.request) {
        toast.error("No response received from server");
      } else {
        toast.error("Error in setting up request");
      }
    }
  };

  return (
    <Layout title="Cart - Ecommerce App">
      {auth?.token ? (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-center bg-light p-2 mb-1">
                {`Hello ${auth?.token && auth?.user?.name}`}
              </h1>
              <h4 className="text-center">
                {cart?.items?.length
                  ? `You have ${cart?.items?.length} items in your cart ${
                      auth?.token ? "" : "Please login to checkout"
                    }`
                  : "Your cart is empty"}
              </h4>
            </div>
          </div>
          <div className="row my-4">
            <div className="col-md-7">
              {cart?.items?.map((p) => (
                <div className="row mb-3 card flex-row p-3" key={p.productId._id}>
                  <div className="col-md-4">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/get-photo/${p.productId._id}`}
                      className="card-img-top"
                      alt={p.productId.name}
                      height="200px"
                    />
                  </div>
                  <div className="col-md-8 pt-3">
                    <h5>{p.productId.name}</h5>
                    <p>{p.productId.description.substring(0, 120)}...</p>
                    <p>Price: ₹{formatPrice(p.productId.price)}</p>
                    <div className="d-flex flex-row">
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          removeCartItem(auth?.user?._id, p.productId._id)
                        }
                      >
                        Remove
                      </button>
                      <div className="mx-5">
                        <button
                          className="btn btn-primary mx-2 w-10 px-3"
                          onClick={() =>
                            handleQtyChange(
                              auth?.user?._id,
                              p.productId._id,
                              "decrease"
                            )
                          }
                        >
                          -
                        </button>
                        <span>QTY {p.quantity}</span>
                        <button
                          className="btn btn-primary mx-2 w-10"
                          onClick={() =>
                            handleQtyChange(
                              auth?.user?._id,
                              p.productId._id,
                              "increase"
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary px-5">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total: {totalPrice}</h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                  <div className="mt-2">
                    {!clientToken || !cart?.items.length ? (
                      ""
                    ) : (
                      <>
                        <DropIn
                          options={{
                            authorization: clientToken,
                            paypal: {
                              flow: "vault",
                            },
                          }}
                          onInstance={(instance) => setInstance(instance)}
                        />

                        <button
                          className="btn btn-primary"
                          onClick={handlePayment}
                          disabled={
                            loading || !instance || !auth?.user?.address
                          }
                        >
                          {loading ? "Processing ...." : "Make Payment"}
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token && (
                    <>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Update Address
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container d-flex flex-column align-items-center mt-5">
          <h1>Login to add item in the cart</h1>
          <button
            className="btn btn-outline-warning"
            onClick={() =>
              navigate("/login", {
                state: "/cart",
              })
            }
          >
            Please login to checkout
          </button>
        </div>
      )}
    </Layout>
  );
};

export default CartPage;
