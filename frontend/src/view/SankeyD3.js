import * as d3 from "d3";
import {sankey as d3Sankey, sankeyLinkHorizontal} from "d3-sankey";
import * as d3SankeyJS from "d3-sankey";


const format = d3.format(",.0f");



// Create a SVG container.
export const createSVGContainer = (width, height)=> {
    const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
            return svg;
}

// Constructs and configures a Sankey generator.
export const constructAndConfiguresSankeyGenerator = (width, height, nodeAlignment) => {
    const sankey = d3Sankey()
            .nodeId(d => d.name)
             .nodeAlign(d3SankeyJS[nodeAlignment]) // d3.sankeyLeft, etc.
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 5], [width - 1, height - 5]]);
            return sankey;
}

// Defines a color scale.
export const defineColorScale = () => {
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    return color;
}

 // Defines a color scale.
 const color = defineColorScale();

 // Creates the rects that represent the nodes.
 export const createRectsThatRepresentTheNodes = (svg, nodes) => {
    const rect = svg.append("g")
            .attr("stroke", "#000")
        .selectAll()
        .data(nodes)
        .join("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => color(d.category));
            return rect;
 }

 // Adds a title on the nodes.
 export const addTitleOnTheNodes = (rect) => {
    rect.append("title")
    .text(d => `${d.name}\n${format(d.value)} TWh`);
 }

 // Creates the paths that represent the links.
 export const createThePathsThatRepresentTheLinks = (svg, links) => {
    const link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.5)
        .selectAll()
        .data(links)
        .join("g")
             .style("mix-blend-mode", "multiply");
             return link;
 }

 // Creates a gradient, if necessary, for the source-target color option.
 export const createGradientForSourceTargetColor = (link, linkColor) => {
    if (linkColor === "source-target") {
        console.log("inside source-target");
    const gradient = link.append("linearGradient")
         .attr("id", d => d.uid)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0);
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => color(d.source.category));
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d => color(d.target.category));
    }

    link.append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", linkColor === "source-target" ? (d) => d.uid
            : linkColor === "source" ? (d) => color(d.source.category)
            : linkColor === "target" ? (d) => color(d.target.category) 
            : linkColor)
        .attr("stroke-width", d => Math.max(1, d.width));

    link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)} TWh`);
 }

 // Adds labels on the nodes.
 export const addLabelsOnTheNodes = (svg, nodes, width) => {
    svg.append("g")
        .selectAll()
        .data(nodes)
        .join("text")
            .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
            .text(d => d.name);
 }

 // Append the SVG to the container in your app.js
 export const appendSVGToTheContainer = (svg, svgContainerIdToAppend) =>{
    const svgContainer = document.getElementById(svgContainerIdToAppend); // Replace with your actual container ID
            svgContainer.innerHTML = "";
            svgContainer.appendChild(svg.node());
 }