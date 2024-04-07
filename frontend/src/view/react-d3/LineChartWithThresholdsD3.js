import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChartWithThresholdsD3 = ({ data, width, height, mild, normal, severe }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    if (!data || !data.length) return;

    const margin =  {top: 10, right: 30, bottom: 50, left: 85};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse the date/time
    const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    
    // Format the date/time
    const formatTime = d3.timeFormat('%H:%M');

    // X scale
    const x = d3.scaleTime()
      .range([0, innerWidth])
      .domain(d3.extent(data, d => parseTime(d.timestamp)));

    // Y scale
    const y = d3.scaleLinear()
      .range([innerHeight, 0])
      .domain([0, d3.max(data, d => d.spo2)]);

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(formatTime));

      // Add X axis label
      svg.append("text")
      .attr('class', 'x-axis-label')
      .attr('transform', `translate(${innerWidth / 2},${height - margin.bottom / 3})`)
      .style('text-anchor', 'middle')
      .text('Today');

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

      // Add Y axis label
      svg.append("text")
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left / 2)
      .attr('x', -innerHeight / 2)
      .style('text-anchor', 'middle')
      .text('Respiration Count');

    // Define the line
    const line = d3.line()
      .x(d => x(parseTime(d.timestamp)))
      .y(d => y(d.spo2));

    // Draw the line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Define threshold values
    const thresholds = [{'value': mild, 'text':'mild'}, {'value': normal, 'text':'normal'}, {'value': severe, 'text':'severe'}] // Example threshold values

    // Draw threshold lines
    thresholds.forEach((threshold, index) => {
      svg.append('line')
        .attr('x1', 0)
        .attr('y1', y(threshold['value']))
        .attr('x2', width)
        .attr('y2', y(threshold['value']))
        .attr('stroke', `red`)
        .attr('stroke-dasharray', '4')
        .attr('stroke-width', 1);

      // Add label for threshold
      svg.append('text')
        .attr('x', innerHeight)
        .attr('y', y(threshold['value']))
        .attr('dy', index === 0 ? '-0.5em' : '0.35em')
        .text(`Threshold ${index + 1}: ${threshold['text']}`)
        .style('fill', 'red');
    });

  }, [data, width, height]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default LineChartWithThresholdsD3;