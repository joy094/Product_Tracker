import React, { useState } from "react";
import "./TrackingForm.css";

function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!trackingNumber.trim()) {
      setError("অনুগ্রহ করে একটি ট্র্যাকিং নম্বর প্রদান করুন।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tracking/${trackingNumber.trim()}`);
      if (!res.ok) {
        setError("❌ এই ট্র্যাকিং নম্বরের কোনো তথ্য পাওয়া যায়নি।");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("⚠️ সার্ভারে সমস্যা হচ্ছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStageIndex = (stages) => {
    for (let i = stages.length - 1; i >= 0; i--) {
      if (stages[i].done) return i;
    }
    return -1;
  };

  return (
    <div className="tracking-main-wrapper">
      <div className="search-section neumorphic">
        <h2 className="search-title">📦 আপনার কার্গো ট্রাক করুন</h2>
        <form className="tracking-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ট্র্যাকিং নম্বরটি এখানে লিখুন"
            className="tracking-input"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <button type="submit" className="tracking-button" disabled={loading}>
            {loading ? "খোঁজা হচ্ছে..." : "ট্রাক করুন"}
          </button>
        </form>
      </div>

      {error && <p className="tracking-error-msg">{error}</p>}

      {result && (
        <div className="result-display">
          {/* বিস্তারিত শিপমেন্ট তথ্য */}
          <div className="shipment-info-card neumorphic">
            <h3 className="card-title">🚛 শিপমেন্টের বিস্তারিত তথ্য</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">গ্রাহকের নাম:</span>
                <span className="value">{result.name}</span>
              </div>
              <div className="info-item">
                <span className="label">মোট কার্টুন:</span>
                <span className="value">{result.totalCartoons} টি</span>
              </div>
              <div className="info-item">
                <span className="label">ওজন:</span>
                <span className="value">{result.weight} কেজি</span>
              </div>
              <div className="info-item">
                <span className="label">CBM:</span>
                <span className="value">{result.cbm}</span>
              </div>
              <div className="info-item">
                <span className="label">রিসিভ ডেট:</span>
                <span className="value">
                  {new Date(result.recivedDate).toLocaleDateString('bn-BD')}
                </span>
              </div>
              <div className="info-item">
                <span className="label">পরিবহন:</span>
                <span className="value">{result.transport === "Air" ? "✈️ এয়ার" : "🚢 সী"}</span>
              </div>
            </div>
            <p className="update-time">সর্বশেষ আপডেট: {new Date(result.lastUpdated).toLocaleString('bn-BD')}</p>
          </div>

          {/* ট্র্যাকিং প্রগ্রেস টাইমলাইন */}
          <div className="progress-section neumorphic">
            <h4 className="card-title">📍 কার্গো লোকেশন আপডেট</h4>
            <div className="stages-container">
              {result.stages.map((stage, idx) => {
                const currentStageIndex = getCurrentStageIndex(result.stages);
                const isDone = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={idx}
                    className={`stage-row ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                  >
                    <div className="stage-left">
                      <div className="icon-circle">
                        <span className="emoji">{stage.emoji}</span>
                        {isDone && !isCurrent && <span className="mini-check">✓</span>}
                      </div>
                      {idx < result.stages.length - 1 && <div className="line-connector"></div>}
                    </div>
                    <div className="stage-right">
                      <span className="stage-name-text">{stage.name}</span>
                      {isCurrent && <span className="live-status">বর্তমানে এখানে আছে</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackingForm;