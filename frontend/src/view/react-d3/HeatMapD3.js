import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const HeatMapD3 = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const margin = { top: 10, right: 10, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleBand()
      .range([0, innerWidth])
      .domain(data.map(d => d.group))
      .padding(0.05);

    const yScale = d3.scaleBand()
      .range([innerHeight, 0])
      .domain(data.map(d => d.variable))
      .padding(0.05);

    const colorScale = d3.scaleSequential(d3.interpolateInferno)
      .domain([0, d3.max(data, d => d.value)]);

    svg.selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.group))
      .attr("y", d => yScale(d.variable))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", d => colorScale(d.value));

    svg.append("g")
      .attr("transform", "translate(0," + innerHeight + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

  }, [data, width, height]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default HeatMapD3;