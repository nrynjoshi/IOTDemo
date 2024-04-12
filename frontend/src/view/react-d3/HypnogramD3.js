 
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const HypnogramD3 = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;


    const margin = {top: 10, right: 30, bottom: 50, left: 140};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse timestamp strings into Date objects
    const parseTime = d3.timeParse('%m/%d/%Y %I:%M');
    data.forEach(d => {
      d.date = parseTime(d.timestamp);
    });

    // Define scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, innerWidth]);

    const yScale = d3.scaleBand()
      .domain(['Awake', 'Poor Sleep', 'Light Sleep', 'Deep Sleep'])
      .range([0, innerHeight])
      .padding(0.1);

    // Draw rectangles for sleep stages
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale(d.stage))
      .attr('width', innerWidth / data.length)
      .attr('height', yScale.bandwidth())
      .attr('fill', d => {
        // Assign colors based on sleep stage
        switch (d.stage) {
          case 'Awake':
            return 'red';
          case 'Poor Sleep':
            return 'black';
          case 'Light Sleep':
            return 'yellow';
          case 'Deep Sleep':
            return 'green';
          default:
            return 'gray';
        }
      });

    // Draw axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%d')); // Format the ticks as day of the month
    svg.append('g').attr('transform', `translate(0, ${innerHeight})`).call(xAxis);

    // Add X axis label
    svg.append("text")
      .attr('class', 'x-axis-label')
      .attr('transform', `translate(${innerWidth / 2},${height- margin.bottom/ 2})`)
      .style('text-anchor', 'middle')
      .text('Day of the Month');

    const yAxis = d3.axisLeft(yScale);
    svg.append('g').call(yAxis);

    // Add Y axis label
    svg.append("text")
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left / 2)
      .attr('x', -innerHeight / 2)
      .style('text-anchor', 'middle')
      .text('Sleep Quality');

  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}>
  </svg>
  );
};

export default HypnogramD3;