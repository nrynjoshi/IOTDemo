import * as d3 from "d3";
import { COLOR_SCALE } from "../util/Constant";

export const createForceDirectedGraphSVG = (data) => {
  // Specify the dimensions of the chart.
  const width = 1200
  const height = 800

  // Specify the color scale.
  const color = COLOR_SCALE;

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map(d => ({ ...d }));
  const nodes = data.nodes.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.name).distance(250))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(30));

  // Create the SVG container.
  const svg = d3.create("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add a line for each link, and a circle for each node.
  const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
    .attr("stroke-width", 1.5);


     // Create nodes
    const nodeGroup = svg
    .attr("stroke-width", 2)
    .selectAll(".nodeGroup")
    .data(nodes)
    .enter().append("g")
    .attr("class", "nodeGroup");

  // Append circles to node group
  const node = nodeGroup.append("circle")
    .attr("r", 6)
    .attr("fill", d => color(d.category));

  // Append labels to node group
  nodeGroup.append("text")
    .text(d => d.name)
    .attr("font-size", "12px")
    .attr("x", 20) // Adjust the x position of the label
    .attr("y", 3); // Adjust the y position of the label


  // Update node and link positions on each tick
  simulation.on("tick", () => {
    link.attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
  });



  // Add a drag behavior.
  node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  // Set the position attributes of links and nodes each time the simulation ticks.
  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return svg.node();
}