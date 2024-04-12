import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChartD3 = ({ data, width, height, xAxiasLable, yAxiasLable }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    // Parse dates
    const parseDate = d3.timeParse('%m/%d/%Y');
    data.forEach(d => {
      d.x = parseDate(d.x);
      d.y = +d.y; // Convert y to number
    });
    console.log(data);

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 50, left: 85 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Append SVG element to the DOM
    const svg = d3.select(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, function (d) { return d.x; }))
      .range([0, innerWidth]);

    svg.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x)
        .tickFormat(d => {
          const formatTime = d3.timeFormat('%a %d');
          return formatTime(d);
        })
      );

    // Add X axis label
    svg.append("text")
      .attr('class', 'x-axis-label')
      .attr('transform', `translate(${innerWidth / 2},${height - margin.bottom / 3})`)
      .style('text-anchor', 'middle')
      .text(xAxiasLable);

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return +d.y; })])
      .range([innerHeight, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));

    // Add Y axis label
    svg.append("text")
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left / 2)
      .attr('x', -innerHeight / 2)
      .style('text-anchor', 'middle')
      .text(yAxiasLable);

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) { return x(d.x) })
        .y(function (d) { return y(d.y) })
      );

  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g className="x-axis" />
      <g className="y-axis" />
      <text className="x-axis-label" />
      <text className="y-axis-label" />
      <path className="line" />
    </svg>
  );
};

export default LineChartD3;