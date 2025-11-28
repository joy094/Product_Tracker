import React from "react";
import TrackingForm from "../components/TrackingForm";

const TrackingPage = () => {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">✈️ Welcome to Demo Cargo Tracker</h1>

        <TrackingForm />
      </div>
    </div>
  );
};

export default TrackingPage;
