 
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const HypnogramD3 = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const margin = { top: 10, right: 10, bottom: 30, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // set the dimensions and margins of the graph
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define scales
    const xScale = d3.scaleLinear()
      .domain([0, data.length])
      .range([0, innerWidth]);

    const yScale = d3.scaleBand()
      .domain(['Awake', 'Light sleep', 'Deep sleep', 'REM sleep'])
      .range([0, innerHeight])
      .padding(0.1);

    // Draw rectangles for sleep stages
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d.stage))
      .attr('width', width / data.length)
      .attr('height', yScale.bandwidth())
      .attr('fill', d => {
        // Assign colors based on sleep stage
        switch (d.stage) {
          case 'Awake':
            return 'red';
          case 'Light sleep':
            return 'yellow';
          case 'Deep sleep':
            return 'blue';
          case 'REM sleep':
            return 'green';
          default:
            return 'gray';
        }
      });

    // Draw axes
    const xAxis = d3.axisBottom(xScale);
    svg.append('g').attr('transform', `translate(0, ${innerHeight})`).call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg.append('g').call(yAxis);
  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}>
  </svg>
  );
};

export default HypnogramD3;