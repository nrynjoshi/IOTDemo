import * as d3 from "d3";
import {sankey as d3Sankey, sankeyLinkHorizontal} from "d3-sankey";
import * as d3SankeyJS from "d3-sankey";
import invalidation from "react"


const format = d3.format(",.0f");

//----------------- supporting methods ---------------

// Create a SVG container.
export const createSVGContainer = (width, height)=> {
    const svg = createSVGWithViewBoxCustomContainer(0, 0, width, height);
            return svg;
}

export const createSVGWithViewBoxCustomContainer = (viewBoxFirstParam, viewBoxSecondParam, width, height)=> {
    const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [viewBoxFirstParam, viewBoxSecondParam, width, height])
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


 //--------------- diagram generation full code block ---------

 export const SankeyDiagramDisplay = (width, height, data, nodeAlignment, linkColor, svgAppendId) => {
     // Create a SVG container.
            
     const svg = createSVGContainer(width, height);

     // Constructs and configures a Sankey generator.
     const sankey = constructAndConfiguresSankeyGenerator(width, height, nodeAlignment)
     
     // Applies it to the data. We make a copy of the nodes and links objects
     // so as to avoid mutating the original.
     const {nodes, links} = sankey({
     nodes: data.nodes.map(d => Object.assign({}, d)),
     links: data.links.map(d => Object.assign({}, d))
     });

 
     
     // Creates the rects that represent the nodes.
     const rect = createRectsThatRepresentTheNodes(svg, nodes)

     // Adds a title on the nodes.
     addTitleOnTheNodes(rect)
     
     // Creates the paths that represent the links.
     const link = createThePathsThatRepresentTheLinks(svg, links);
         

     // Creates a gradient, if necessary, for the source-target color option.
     createGradientForSourceTargetColor(link, linkColor)

     // Adds labels on the nodes.
     addLabelsOnTheNodes(svg, nodes, width);

     // Append the SVG to the container in your app.js
     appendSVGToTheContainer(svg, svgAppendId)    
 }

 //---------------------
 function linkArc(d) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
  }

 const drag = (simulation) => {
  
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

 export const MobilePatentSuitsDisplay = (width, height, data, svgAppendId) => {

    const types = Array.from(new Set(data.map(d => d.type)));
    const nodes = Array.from(new Set(data.flatMap(l => [l.source, l.target])), id => ({id}));
    const links = data.map(d => Object.create(d))

    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

    // Create a SVG container.
    const svg = createSVGWithViewBoxCustomContainer (-width / 2, -height / 2, width, height);

    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
    .data(types)
    .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -0.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
    .append("path")
        .attr("fill", color)
        .attr("d", "M0,-5L10,0L0,5");

        const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(links)
      .join("path")
        .attr("stroke", d => color(d.type))
        .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, window.location)})`);
  
    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g")
        .call(drag(simulation));
  
    node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("r", 4);
  
    node.append("text")
        .attr("x", 8)
        .attr("y", "0.31em")
        .text(d => d.id)
      .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 3);
  
    simulation.on("tick", () => {
      link.attr("d", linkArc);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
  
    //  invalidation.then(() => simulation.stop());

    // Append the SVG to the container in your app.js
    appendSVGToTheContainer(svg, svgAppendId) 
 }