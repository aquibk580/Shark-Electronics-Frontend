import React from "react";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchInput = () => {
  const navigate = useNavigate();
  const [values, setValues] = useSearch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className="d-flex mx-2 mb-1" role="search" onSubmit={handleSubmit}>
      <input
        className="form-control me-2"
        type="search"
        id="search-bar"
        placeholder="Search"
        aria-label="Search"
        value={values.keyword}
        onChange={(e) => {
          setValues({ ...values, keyword: e.target.value });
          if(e.target.value == ""){
            navigate("/")
          }
        }}
      />
      <button className="btn btn-outline-success" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
