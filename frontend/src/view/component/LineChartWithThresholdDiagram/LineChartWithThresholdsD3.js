import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChartWithThresholdsD3 = ({ data, width, height, xAxiasLable, yAxiasLable, thresholdsContext }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    if (!data || !data.length) return;

    const margin = { top: 30, right: 30, bottom: 100, left: 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse the date/time
    const parseTime = d3.timeParse('%m/%d/%Y %H:%M');

    // Format the date/time
    const formatTime = d3.timeFormat('%H:%M');

    // X scale
    const x = d3.scaleTime()
      .range([0, innerWidth])
      .domain(d3.extent(data, d => parseTime(d.timestamp)));

    // Find the minimum and maximum y-values in your data
    const minY = d3.min(data, d => +d.spo2) - 10;
    const maxY = d3.max(data, d => +d.spo2);

    // Add a small padding to the upper limit
    const padding = 10; // Adjust as needed
    const adjustedMaxY = maxY + padding;

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([minY, adjustedMaxY]) // Set the domain to exclude 0 and include only the range from the minimum to maximum y-values
      .range([innerHeight, 0]);

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(formatTime));

    // Add X axis label
    svg.append("text")
      .attr('class', 'x-axis-label')
      .attr('transform', `translate(${innerWidth / 2},${height - margin.bottom / 3})`)
      .style('text-anchor', 'middle')
      .text(xAxiasLable);

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
      .text(yAxiasLable);

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
    if (thresholdsContext) {

      // Convert JSON key-value pairs to array of objects
      const thresholds = Object.keys(thresholdsContext).map(key => ({ 'text': key, 'value': thresholdsContext[key] }));

      // Sort the array of objects based on the value of the key value
      thresholds.sort((a, b) => {
        if (a.value < b.value) {
          return -1;
        }
        if (a.value > b.value) {
          return 1;
        }
        return 0;
      });

      // Draw threshold lines
      var thresholdLabelLeftPosition = innerHeight
      thresholds.forEach((threshold) => {
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
          .attr('x', thresholdLabelLeftPosition)
          .attr('y', y(threshold['value']))
          // .attr('dy',  '1em')
          .text(`Level: ${threshold['text'].toUpperCase()}`)
          .style('fill', 'red')
          .style('font-size', 'medium');;

        thresholdLabelLeftPosition = thresholdLabelLeftPosition - 120
      });
    }


  }, [data, width, height, xAxiasLable, yAxiasLable, thresholdsContext]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default LineChartWithThresholdsD3;