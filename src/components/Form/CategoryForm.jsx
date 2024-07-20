import React from "react";

const CategoryForm = ({handleSubmit, value, setValue}) => {
    
  return (
    <div>
      <form onSubmit={handleSubmit} className="d-flex flex-column">
        <div className="mb-3">
          <input
            type="text"
            className={`form-control ${window.innerWidth >= 768 ? "w-50" : "w-100"}`}
            placeholder="Enter new Category"  
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{width:"100px"}}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
