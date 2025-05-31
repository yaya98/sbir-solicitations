"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import TimelineModel from "models/TimelineModel";

export default function Timeline({
  timelineData,
}: {
  timelineData: TimelineModel[];
}) {
  const ref = useRef(null);
  useEffect(() => {
    const svg = d3.select(ref.current).attr("width", 700).attr("height", 150);
    svg.selectAll("*").remove();

    const circleRadius = 20;
    const lineLength = 120;
    const startX = 50;
    const centerY = 50;

    timelineData.forEach((item, i) => {
      // draw a circle for each timeline label
      let cx = startX + i * (lineLength + 2 * circleRadius);
      let fillColor = item.passed ? "darkgreen" : "grey";

      svg
        .append("circle")
        .attr("cx", cx)
        .attr("cy", centerY)
        .attr("r", circleRadius)
        .attr("fill", fillColor);

      if (i < timelineData.length - 1) {
        svg
          .append("line")
          .attr("x1", cx)
          .attr("x2", cx + circleRadius + lineLength)
          .attr("y1", centerY)
          .attr("y2", centerY)
          .attr("stroke", fillColor)
          .attr("stroke-width", 5);
      }

      // draw the label
      svg
        .append("text")
        .attr("x", cx)
        .attr("y", centerY + 40)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("fill", "darkred")
        .text(item.label);

      // draw the date
      svg
        .append("text")
        .attr("x", cx)
        .attr("y", centerY + 60)
        .attr("text-anchor", "middle")
        .attr("fill", "#2c3e50")
        .text(item.date.slice(0, 10));
    });
  }, [timelineData]);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <svg ref={ref}></svg>
    </div>
  );
}
