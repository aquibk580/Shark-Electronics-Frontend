import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import moment from "moment";
import axios from "axios";
import { Select } from "antd";
import formatPrice from "../../components/formatPrice";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [auth, setAuth] = useAuth();
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/order/all-orders`
      );
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

  const handleChange = async (orderId, status) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/order/order-status/${orderId}`,
        { status }
      );
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  return (
    <Layout title="All Orders Data">
      <div className="continer-fluid p-3 admin-order">
        <div className="row">
          <div className="col-md-3 p-4">
            <AdminMenu />
          </div>
          <div className="col-md-9 orders">
            <h1 className="text-center">All Orders</h1>
            {orders.map((o, i) => {
              return (
                <div className="border shadow" key={i}>
                  <table className="admin-table">
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
                        <td>
                          <Select
                            variant={false}
                            defaultValue={o?.status}
                            onChange={(value) => {
                              handleChange(o._id, value);
                            }}
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
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
                            src={`${process.env.REACT_APP_API}/api/v1/product/get-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                            height="200px"
                          />
                        </div>
                        <div className="col-md-8 pt-3">
                          <h5>{p.name}</h5>
                          <p>{p.description}</p>
                          <p>Price: ₹{formatPrice(p.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
