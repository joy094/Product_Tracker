
//TrackingResult.jsx
import React from "react";
import "./TrackingResult.css";

const TrackingResult = ({ shipment }) => {
  // find index of last done stage
  const lastDoneIndex = shipment.stages
    .map((s) => s.done)
    .lastIndexOf(true);

  return (
    <div className="tracking-card">
      <h2>{shipment.trackingNumber} - {shipment.name}</h2>
      <p>Transport: {shipment.transport}</p>
      <p>Status: <strong>{shipment.status}</strong></p>

      <div className="tracking-stages">
        {shipment.stages.map((stage, idx) => {
          const isDone = idx <= lastDoneIndex;
          const isCurrent = idx === lastDoneIndex;
          return (
            <div
              key={idx}
              className={`stage ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
            >
              <span className="emoji">{stage.emoji}</span>
              {isDone && <span className="check">✅</span>}
              <span className="stage-name">{stage.name}</span>
              {idx < shipment.stages.length - 1 && <div className="connector"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingResult;
