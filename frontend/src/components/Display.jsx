import React, { useState } from "react";

function Display({ vehicleData, moveVehicle ,lat,lng,setLat,setLng}) {
  
  const registeredPlates = ["AP12AB1234", "TS09CD5678", "MH14EF9101", "KA05GH2345", "DL03IJ6789"];
  const isRegistered = vehicleData.NumberPlate && registeredPlates.includes(vehicleData.NumberPlate);

  const handleMoveTo = async () => {
    if (!lat || !lng) {
      alert("Please enter both latitude and longitude.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/move_to", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: parseFloat(lat), longitude: parseFloat(lng) })
      });
      const data = await response.json();
      alert(`MoveTo Response: ${data.message || "Success"}`);
    } catch (error) {
      alert("Failed to move vehicle. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">Vehicle Telemetry Dashboard</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-400">Vehicle Status</h2>
        <ul className="space-y-4">
          <li className="flex justify-between"><span className="text-gray-300">Mode:</span><span className="font-medium">{vehicleData.Mode || "N/A"}</span></li>
          <li className="flex justify-between"><span className="text-gray-300">Latitude:</span><span className="font-medium">{vehicleData.Latitude || "N/A"}</span></li>
          <li className="flex justify-between"><span className="text-gray-300">Longitude:</span><span className="font-medium">{vehicleData.Longitude || "N/A"}</span></li>
          <li className="flex justify-between"><span className="text-gray-300">Yaw:</span><span className="font-medium">{vehicleData.Yaw || "N/A"}</span></li>
          <li className="flex justify-between"><span className="text-gray-300">Altitude:</span><span className="font-medium">{vehicleData.Altitude || "N/A"}</span></li>
          <li className="flex justify-between"><span className="text-gray-300">Velocity:</span><span className="font-medium">{vehicleData.Velocity ? `(${vehicleData.Velocity[0]}, ${vehicleData.Velocity[1]}, ${vehicleData.Velocity[2]})` : "N/A"}</span></li>
          <li className="flex justify-between"><span className="text-gray-300">Pitch:</span><span className="font-medium">{vehicleData.Pitch || "N/A"}</span></li>
          <li className="flex justify-between"><span className="text-gray-300">Roll:</span><span className="font-medium">{vehicleData.Roll || "N/A"}</span></li>
          <li className="flex justify-between"><span className="text-gray-300">Speed:</span><span className="font-medium">{vehicleData.Speed || "N/A"}</span></li>
          <li className="flex justify-between"><span className="text-gray-300">Heading:</span><span className="font-medium">{vehicleData.Heading || "N/A"}</span></li>
          <li className="flex justify-between"><span className="text-gray-300">Armed:</span><span className={`font-medium ${vehicleData.Armed ? "text-green-500" : "text-red-500"}`}>{vehicleData.Armed ? "Yes" : "No"}</span></li>
        </ul>
      </div>
      {vehicleData.NumberPlate && (
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg mt-8 w-full max-w-2xl text-center">
          <h2 className="text-xl font-bold text-green-400 mb-2">✅ Successfully Reached Target</h2>
          <p className="text-lg">📷 Detected Number Plate: <span className="font-semibold">{vehicleData.NumberPlate}</span></p>
          <p className={`text-lg font-semibold ${isRegistered ? "text-green-400" : "text-red-400"}`}>{isRegistered ? "✔ Registered Vehicle" : "❌ Unregistered Vehicle"}</p>
        </div>
      )}
      <h2 className="text-2xl font-semibold mt-10 mb-6 text-yellow-400">Move Vehicle To</h2>
      <div className="flex space-x-4 mb-6">
        <input type="number" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} className="p-2 rounded bg-gray-700 text-white border border-gray-500" />
        <input type="number" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} className="p-2 rounded bg-gray-700 text-white border border-gray-500" />
        <button onClick={handleMoveTo} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Move</button>
      </div>
      <h2 className="text-2xl font-semibold mt-10 mb-6 text-yellow-400">Movement Controls</h2>
      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        <button onClick={() => moveVehicle("forward")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300">▲ Forward</button>
        <button onClick={() => moveVehicle("left")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300">◀ Left</button>
        <button onClick={() => moveVehicle("right")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300">▶ Right</button>
        <button onClick={() => moveVehicle("backward")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg col-span-3 transition duration-300">▼ Backward</button>
        <button onClick={() => moveVehicle("up")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300">⬆ Up</button>
        <button onClick={() => moveVehicle("down")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300">⬇ Down</button>
        <button onClick={() => moveVehicle("stop")} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg col-span-3 transition duration-300">⛔ Stop</button>
      </div>
    </div>
  );
}

export default Display;
