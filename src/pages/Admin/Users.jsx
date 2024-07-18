import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/admin-getallusers`
      );
      if (data?.success) {
        setUsers(data?.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <Layout title="Dashboard - All Users">
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-md-3 p-4">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h3 className="px-3">All Users</h3>
            <div className="container">
              {users?.map((u) => {
                return (
                  <div
                    className="card my-4 shadow p-3" key={u._id}
                    style={{ maxWidth: "600px" }}
                  >
                    <h5 className="card-title">
                      <b>Name : </b>
                      {u.name}
                    </h5>
                    <div className="card-text">
                      <b>Email : </b>
                      {u.email}
                    </div>
                    <div className="card-text">
                      <b>Phone : </b>
                      {u.phone}
                    </div>
                    <div className="card-text">
                      <b>Address : </b>
                      {u.address.toString()}
                    </div>
                    <div className="card-text">
                      <b>Answer : </b>
                      {u.answer}
                    </div>
                    <div className="card-text">
                      <b>Role : </b>
                      {u.role === 0 ? "User" : "Admin"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
