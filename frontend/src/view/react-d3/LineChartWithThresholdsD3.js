import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChartWithThresholdsD3 = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.timestamp))
    .range([0, innerWidth]);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0]);

  const xAxis = d3.axisBottom(x);
  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(y);
  svg.append('g')
    .call(yAxis);

  const spo2Line = d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.spo2));

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', spo2Line);
  
  // Add threshold lines
  const thresholds = [
    { label: 'Normal Range', value: 95 },
    { label: 'Mild Hypoxemia', value: 90 },
    { label: 'Severe Hypoxemia', value: 85 }
  ];

  thresholds.forEach(threshold => {
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', y(threshold.value))
      .attr('x2', innerWidth)
      .attr('y2', y(threshold.value))
      .attr('stroke', 'red')
      .attr('stroke-dasharray', '4')
      .attr('stroke-width', 1);

    svg.append('text')
      .attr('x', innerWidth)
      .attr('y', y(threshold.value) - 5)
      .attr('text-anchor', 'end')
      .text(threshold.label)
      .style('font-size', '10px')
      .style('fill', 'red');
  });

  }, [data, width, height]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default LineChartWithThresholdsD3;