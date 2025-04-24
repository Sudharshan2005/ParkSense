import React, { useState, useEffect } from "react";
import Display from "./components/Display";
import Compass from "./components/Compass";
import Map from "./components/Map";
import "./App.css";

function App() {
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // Fetch vehicle data
  const fetchVehicleData = async () => {
    try {
      const response = await fetch("http://localhost:5000/data");
      if (!response.ok) {
        throw new Error("Failed to fetch vehicle data");
      }
      const data = await response.json();
      setVehicleData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to move vehicle
  const moveVehicle = async (direction) => {
    try {
      const response = await fetch("http://localhost:5000/vehicle/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      });
      if (!response.ok) {
        throw new Error("Failed to move vehicle");
      }
      const data = await response.json();
      console.log(data.message);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchVehicleData();
    const interval = setInterval(fetchVehicleData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Conditional rendering for loading and error states
  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <Display vehicleData={vehicleData} moveVehicle={moveVehicle} lat={lat} lng={lng} setLat={setLat} setLng={setLng}  />
        </div>

        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-center">
          <Compass angle={vehicleData.Heading || 0} />
        </div>

        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <Map startPoint={[vehicleData.Longitude, vehicleData.Latitude]} destination={[lng, lat]} />
        </div>
      </div>
    </div>
  );
}

export default App;
