import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import "../../styles/dashboard.css";

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title="Admin Dashboard - Ecommerce App">
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3 admin-menu">
            <AdminMenu />
          </div>
          <div className="col-md-9 d-flex flex-column align-items-center justify-content-center mb-5">
            <h4>Admin Details</h4>
            <div className="card w-75 p-3">
              <h4>Admin Name : {auth?.user?.name}</h4>
              <h4>Admin Email : {auth?.user?.email}</h4>
              <h4>Admin Contact : {auth?.user?.phone}</h4>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
