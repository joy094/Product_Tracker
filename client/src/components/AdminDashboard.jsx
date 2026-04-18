import "./AdminDashboard.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

// স্টেজগুলোর নাম বাংলায় রূপান্তর করা হয়েছে
const defaultStages = [
  { name: "চায়না ওয়ারহাউসে গ্রহণ করা হয়েছে", emoji: "📦", done: false },
  { name: "এয়ারপোর্টের পথে", emoji: "🚚", done: false },
  { name: "বিমানে রওনা হয়েছে", emoji: "✈️", done: false },
  { name: "বাংলাদেশ এয়ারপোর্টে পৌঁছেছে", emoji: "🛬", done: false },
  { name: "কাস্টমস ক্লিয়ারেন্স চলছে", emoji: "🛃", done: false },
  { name: "ডেলিভারি প্রক্রিয়াধীন", emoji: "🏍️", done: false },
  { name: "ডেলিভারি সম্পন্ন", emoji: "🏠", done: false },
];

const AdminDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [newShipment, setNewShipment] = useState({
    trackingNumber: "",
    name: "",
    totalCartoons: "",
    weight: "",
    cbm: "",
    recivedDate: "",
    transport: "Air",
    status: "চায়না ওয়ারহাউসে গ্রহণ করা হয়েছে",
    stages: defaultStages,
  });
  const [statusUpdate, setStatusUpdate] = useState("");

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await axios.get(
        "/api/tracking",
      );
      setShipments(res.data);
    } catch (error) {
      console.error("শিপমেন্ট লোড করতে সমস্যা হয়েছে:", error);
    }
  };

  const handleAddShipment = async (e) => {
    e.preventDefault();
    try {
      const shipmentToSend = {
        ...newShipment,
        stages: newShipment.stages.map((s) => ({ ...s, done: false })),
      };

      await axios.post(
        "/api/tracking",
        shipmentToSend,
        { headers: { "Content-Type": "application/json" } },
      );
      alert("শিপমেন্ট সফলভাবে যুক্ত করা হয়েছে ✅");
      setNewShipment({
        trackingNumber: "",
        name: "",
        totalCartoons: "",
        weight: "",
        cbm: "",
        recivedDate: "",
        transport: "Air",
        status: "চায়না ওয়ারহাউসে গ্রহণ করা হয়েছে",
        stages: defaultStages,
      });
      fetchShipments();
    } catch (error) {
      alert("শিপমেন্ট যোগ করতে সমস্যা হয়েছে ❌");
    }
  };

  const handleSelectShipment = (id) => {
    if (selectedShipments.includes(id)) {
      setSelectedShipments(selectedShipments.filter((s) => s !== id));
    } else {
      setSelectedShipments([...selectedShipments, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments(shipments.map((s) => s._id));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkUpdate = async () => {
    if (selectedShipments.length === 0 || !statusUpdate) {
      alert("অনুগ্রহ করে শিপমেন্ট এবং স্ট্যাটাস সিলেক্ট করুন 🚨");
      return;
    }
    try {
      await axios.put(
        "/api/tracking/bulk-update",
        {
          ids: selectedShipments,
          status: statusUpdate,
        },
      );
      alert("স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে ✅");
      setSelectedShipments([]);
      setSelectAll(false);
      setStatusUpdate("");
      fetchShipments();
    } catch (error) {
      alert("আপডেট করতে সমস্যা হয়েছে ❌");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>👨🏻‍💻 অ্যাডমিন ড্যাশবোর্ড</h1>

      {/* শিপমেন্ট যোগ করার ফর্ম */}
      <section className="card">
        <h2>নতুন শিপমেন্ট যুক্ত করুন</h2>
        <form onSubmit={handleAddShipment}>
          <input
            type="text"
            placeholder="ট্র্যাকিং নম্বর"
            value={newShipment.trackingNumber}
            onChange={(e) =>
              setNewShipment({ ...newShipment, trackingNumber: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="কাস্টমারের নাম"
            value={newShipment.name}
            onChange={(e) =>
              setNewShipment({ ...newShipment, name: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="মোট কার্টুন সংখ্যা"
            value={newShipment.totalCartoons}
            onChange={(e) =>
              setNewShipment({
                ...newShipment,
                totalCartoons: parseInt(e.target.value),
              })
            }
            required
          />
          <input
            type="number"
            placeholder="ওজন (কেজি)"
            value={newShipment.weight}
            onChange={(e) =>
              setNewShipment({
                ...newShipment,
                weight: parseFloat(e.target.value),
              })
            }
            required
          />
          <input
            type="number"
            placeholder="CBM"
            value={newShipment.cbm}
            onChange={(e) =>
              setNewShipment({
                ...newShipment,
                cbm: parseFloat(e.target.value),
              })
            }
            required
          />
          <input
            type="date"
            value={newShipment.recivedDate}
            onChange={(e) =>
              setNewShipment({ ...newShipment, recivedDate: e.target.value })
            }
            required
          />

          <select
            value={newShipment.transport}
            onChange={(e) =>
              setNewShipment({ ...newShipment, transport: e.target.value })
            }
          >
            <option value="Air">এয়ার (Air)</option>
            <option value="Sea">সী (Sea)</option>
          </select>

          <select
            value={newShipment.status}
            onChange={(e) =>
              setNewShipment({ ...newShipment, status: e.target.value })
            }
          >
            {defaultStages.map((stage, idx) => (
              <option key={idx} value={stage.name}>
                {stage.name}
              </option>
            ))}
          </select>
          <button type="submit">শিপমেন্ট যুক্ত করুন</button>
        </form>
      </section>

      {/* শিপমেন্ট আপডেট সেকশন */}
      <section className="card">
        <h2>শিপমেন্ট আপডেট করুন</h2>

        <div className="select-all">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            id="selectAll"
          />
          <label htmlFor="selectAll">সবগুলো সিলেক্ট করুন</label>
        </div>

        <div className="shipment-cards">
          {shipments.map((s) => (
            <div key={s._id} className="shipment-card">
              <input
                type="checkbox"
                checked={selectedShipments.includes(s._id)}
                onChange={() => handleSelectShipment(s._id)}
              />
              <div className="shipment-info">
                <h3>{s.trackingNumber}</h3>
                <p>
                  <strong>নাম:</strong> {s.name}
                </p>
                <p>
                  <strong>পরিবহন:</strong>{" "}
                  {s.transport === "Air" ? "এয়ার" : "সী"}
                </p>
                <p>
                  <strong>অবস্থা:</strong>{" "}
                  <span className="status-text">{s.status}</span>
                </p>

                <div className="stages">
                  {s.stages.map((stage, idx) => (
                    <span
                      key={idx}
                      className={`stage ${stage.done ? "done" : ""}`}
                      title={stage.name}
                    >
                      {stage.emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bulk-update">
          <select
            value={statusUpdate}
            onChange={(e) => setStatusUpdate(e.target.value)}
          >
            <option value="">-- স্ট্যাটাস সিলেক্ট করুন --</option>
            {defaultStages.map((stage, idx) => (
              <option key={idx} value={stage.name}>
                {stage.name}
              </option>
            ))}
          </select>
          <button onClick={handleBulkUpdate}>
            সিলেক্ট করা শিপমেন্ট আপডেট করুন
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
