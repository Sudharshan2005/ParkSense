import { useEffect, useRef } from "react";
import * as d3 from "d3";

const Compass = ({ angle = 0 }) => {
  const ref = useRef();

  useEffect(() => {
    const size = 250;
    const radius = size / 2;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous drawing

    svg.attr("width", size).attr("height", size);

    // Draw Outer Circle
    svg.append("circle")
      .attr("cx", radius)
      .attr("cy", radius)
      .attr("r", radius - 10)
      .attr("fill", "#f8f8f8")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Draw 360° Markings
    for (let i = 0; i < 360; i += 10) {
      const isMajor = i % 90 === 0;
      const tickLength = isMajor ? 20 : 10;

      const x1 = radius + (radius - 15) * Math.cos((i - 90) * (Math.PI / 180));
      const y1 = radius + (radius - 15) * Math.sin((i - 90) * (Math.PI / 180));
      const x2 = radius + (radius - tickLength) * Math.cos((i - 90) * (Math.PI / 180));
      const y2 = radius + (radius - tickLength) * Math.sin((i - 90) * (Math.PI / 180));

      svg.append("line")
        .attr("x1", x1).attr("y1", y1)
        .attr("x2", x2).attr("y2", y2)
        .attr("stroke", "black")
        .attr("stroke-width", isMajor ? 2 : 1);

      // Add degree labels
      if (i % 30 === 0) {
        const textX = radius + (radius - 30) * Math.cos((i - 90) * (Math.PI / 180));
        const textY = radius + (radius - 30) * Math.sin((i - 90) * (Math.PI / 180));
        svg.append("text")
          .attr("x", textX)
          .attr("y", textY)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", "12px")
          .attr("fill", "black")
          .text(i);
      }
    }

    // Draw N, E, S, W labels
    const labels = { 0: "N", 90: "E", 180: "S", 270: "W" };
    Object.keys(labels).forEach((deg) => {
      const textX = radius + (radius - 40) * Math.cos((deg - 90) * (Math.PI / 180));
      const textY = radius + (radius - 40) * Math.sin((deg - 90) * (Math.PI / 180));
      svg.append("text")
        .attr("x", textX)
        .attr("y", textY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .text(labels[deg]);
    });

    // Draw Needle
    const needleLength = radius - 40;
    const xNeedle = radius + needleLength * Math.cos((angle - 90) * (Math.PI / 180));
    const yNeedle = radius + needleLength * Math.sin((angle - 90) * (Math.PI / 180));

    svg.append("line")
      .attr("x1", radius)
      .attr("y1", radius)
      .attr("x2", xNeedle)
      .attr("y2", yNeedle)
      .attr("stroke", "red")
      .attr("stroke-width", 4)
      .attr("stroke-linecap", "round");

    // Draw Center Circle
    svg.append("circle")
      .attr("cx", radius)
      .attr("cy", radius)
      .attr("r", 5)
      .attr("fill", "black");

  }, [angle]);

  return <svg ref={ref}></svg>;
};

export default Compass;
