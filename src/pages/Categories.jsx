import React from "react";
import Layout from "../components/Layout/Layout";
import useCategory from "../hooks/useCategory";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title="All Categories -Ecommerce App">
      <div className="container d-flex flex-row flex-wrap" style={{ marginTop: "100px" }}>
        {categories.map((c) => (
          <Link
            key={c._id}
            to={`/category/${c.slug}`}
            className="btn btn-secondary shadow mx-4 my-4 category-btn"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Categories;
