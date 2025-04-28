import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [vehicleData, setVehicleData] = useState({
    Mode: "",
    Latitude: null,
    Longitude: null,
    Yaw: null,
    Altitude: null,
    Velocity: [0, 0, 0],
    Pitch: null,
    Roll: null,
    Speed: null,
    Heading: null,
    Armed: false  // Added Armed status
  });

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://127.0.0.1:5000/data")
        .then((response) => {
          setVehicleData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching vehicle data:", error);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); 
    return () => clearInterval(interval); 
  }, []);

  const moveVehicle = (direction) => {
    axios
      .post("http://127.0.0.1:5000/vehicle/move", { acceleration: 10, direction })
      .then((response) => {
        alert(response.data.message);
        setTimeout(() => {
          axios.get("http://127.0.0.1:5000/data").then((res) => setVehicleData(res.data));
        }, 500); 
      })
      .catch((error) => {
        console.error("Error moving vehicle:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Vehicle Data</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <ul className="space-y-2">
          <li><strong>Mode:</strong> {vehicleData.Mode}</li>
          <li><strong>Latitude:</strong> {vehicleData.Latitude}</li>
          <li><strong>Longitude:</strong> {vehicleData.Longitude}</li>
          <li><strong>Yaw:</strong> {vehicleData.Yaw}</li>
          <li><strong>Altitude:</strong> {vehicleData.Altitude}</li>
          <li><strong>Velocity:</strong> ({vehicleData.Velocity[0]}, {vehicleData.Velocity[1]}, {vehicleData.Velocity[2]})</li>
          <li><strong>Pitch:</strong> {vehicleData.Pitch}</li>
          <li><strong>Roll:</strong> {vehicleData.Roll}</li>
          <li><strong>Speed:</strong> {vehicleData.Speed}</li>
          <li><strong>Heading:</strong> {vehicleData.Heading}</li>
          <li><strong>Armed:</strong> {vehicleData.Armed ? "Yes" : "No"}</li> {/* Display armed status */}
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-6">Move Vehicle</h2>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <button onClick={() => moveVehicle("forward")} className="btn bg-yellow-500">Forward</button>
        <button onClick={() => moveVehicle("left")} className="btn bg-yellow-500">Left</button>
        <button onClick={() => moveVehicle("right")} className="btn bg-yellow-500">Right</button>
        <button onClick={() => moveVehicle("backward")} className="btn bg-yellow-500 col-span-3">Backward</button>
        <button onClick={() => moveVehicle("up")} className="btn bg-yellow-500">Up</button>
        <button onClick={() => moveVehicle("down")} className="btn bg-yellow-500">Down</button>
        <button onClick={() => moveVehicle("stop")} className="btn bg-red-500">Down</button>
      </div>
    </div>
  );
}

export default App;
