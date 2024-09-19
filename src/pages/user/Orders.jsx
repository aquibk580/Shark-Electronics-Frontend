import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import toast from "react-hot-toast";

const Orders = () => {
  const [auth, setAuth] = useAuth();
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`/api/v1/order`);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders. Please try again.");
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  return (
    <Layout title="Dashboard - Your Orders">
      <div className="container-fluid p-3 user-order">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9 d-flex flex-column orders">
            <h2>All Orders</h2>
            {!Array.isArray(orders) || orders.length === 0 ? (
              <h3>No orders Found</h3>
            ) : (
              orders?.map((o, i) => {
                return (
                  <div className="border shadow" key={i}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Staus</th>
                          <th scope="col">Buyer</th>
                          <th scope="col">Date</th>
                          <th scope="col">Payment</th>
                          <th scope="col">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{i + 1}</td>
                          <td>{o?.status}</td>
                          <td>{o?.buyer?.name}</td>
                          <td>{moment(o?.createdAt).fromNow()}</td>
                          <td>{o?.payment.success ? "Success" : "Failed"}</td>
                          <td>{o?.products.length}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="container">
                      {o?.products?.map((p) => (
                        <div className="row mb-3 card flex-row" key={o._id}>
                          <div className="col-md-4">
                            <img
                              src={`/api/v1/product/get-photo/${p._id}`}
                              className="card-img-top"
                              alt={p.name}
                              height="200px"
                            />
                          </div>
                          <div className="col-md-8 pt-3">
                            <h5>{p.name}</h5>
                            <p>{p.description}</p>
                            <p>Price: ₹{p.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
