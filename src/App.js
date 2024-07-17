import "./App.css";
import React from "react";
import {} from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import PageNotFound from "./pages/PageNotFound";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProducts from "./pages/Admin/CreateProducts";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/Admin/AdminOrders";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: "/policy",
      element: <Policy />,
    },
    {
      path: "/*",
      element: <PageNotFound />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/categories",
      element: <Categories />,
    },
    {
      path: "/Category/:slug",
      element: <CategoryProduct />,
    },
    {
      path: "/cart",
      element: <CartPage />,
    },
    {
      path: "/search",
      element: <Search />,
    },
    {
      path: "/product/:slug",
      element: <ProductDetails />,
    },
    {
      path: "/dashboard",
      element: <PrivateRoute />,
      children: [
        {
          path: "user",
          element: <Dashboard />,
        },
        {
          path: "user/orders",
          element: <Orders />,
        },
        {
          path: "user/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/dashboard",
      element: <AdminRoute />,
      children: [
        {
          path: "admin",
          element: <AdminDashboard />,
        },
        {
          path: "admin/create-category",
          element: <CreateCategory />,
        },
        {
          path: "admin/create-product",
          element: <CreateProducts />,
        },
        {
          path: "admin/product/:slug",
          element: <UpdateProduct />,
        },
        {
          path: "admin/product",
          element: <Products />,
        },
        {
          path: "admin/users",
          element: <Users />,
        },
        {
          path: "admin/orders",
          element: <AdminOrders />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
