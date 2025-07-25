import React from "react";

export default function Spinner() {
  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-light bg-opacity-75"
          style={{ zIndex: 1050 }}>
          {/* <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div> */}
          <div className="spinner-grow" style={{ width: "7rem", height: "7rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </>
  );
}
