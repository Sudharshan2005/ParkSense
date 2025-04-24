import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = "pk.eyJ1IjoibWFub2owODExMyIsImEiOiJjbThqMHprbXowaXNrMmpxeXg0czgzZWxhIn0.aAUP-yfBvrzVrnBTJ2zlVA";
const Map = ({ start = [78.4867, 17.385], destination = [78.4824683, 17.3977464] }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const startMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  useEffect(() => {
    if (!mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: start,
        zoom: 14,
      });
      mapRef.current = map;
      startMarkerRef.current = new mapboxgl.Marker({ color: "green" });
      destinationMarkerRef.current = new mapboxgl.Marker({ color: "red" });
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      if (startMarkerRef.current) {
        startMarkerRef.current
          .setLngLat(start)
          .addTo(map);
      }
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current
          .setLngLat(destination)
          .addTo(map);
      }
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(start);
      bounds.extend(destination);
      map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 1000 });
    }
  }, [start, destination]);
  return <div ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />;
};
export default Map;