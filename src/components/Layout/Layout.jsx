import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";

const Layout = ({
  children,
  title = "Ecommerce App - shop Now",
  description = "Menstack Project",
  keywords = "mern,node,express,react,mongodb",
  author = "Aquib Khan",
}) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "73.3vh" }}>
        <Toaster />
        {(() => {
          try {
            return children;
          } catch (error) {
            console.log("Error rendering children", error);
          }
        })()}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
