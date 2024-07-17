import React from "react";
import Layout from "../components/Layout/Layout";
import aboutImage from "../Images/AboutUs.jpg";

const About = () => {
  return (
    <Layout title="About us - Ecommerce App">
      <div className="row about">
        <div className="col-md-6">
          <img src={aboutImage} width={"100%"} alt="" />
        </div>
        <div className="col-md-4">
        <div className="aboutText text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt non
          rerum quia a soluta sint minima fuga voluptate ut assumenda numquam,
          molestiae dolorem suscipit odit vero ipsum magnam. Vitae, nulla? Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Nostrum accusamus
          error obcaecati, dolores deleniti dolor in ratione assumenda,
          explicabo dolore iusto, cumque non temporibus cupiditate ullam. Nobis
          repudiandae commodi officiis.
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
