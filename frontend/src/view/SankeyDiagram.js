import React from "react";
import * as d3 from "d3";
 import {sankey as d3Sankey, sankeyLinkHorizontal} from "d3-sankey";
 import * as d3SankeyJS from "d3-sankey";



class SankeyDiagram extends React.Component {
    
    componentDidUpdate() {
        //this one hard coded for now
        

         const dataFromProps = this.props;
         console.log('dataFromProps ', dataFromProps);
         const data= dataFromProps.data

         const linkColor = dataFromProps.linkColor;
        const nodeAlignVal=dataFromProps.nodeAlignment;
        console.log("linkColor", linkColor);
        console.log("nodeAlignVal", nodeAlignVal);

         console.log(data);
        // Specify the dimensions of the chart.
        const width = 928;
        const height = 600;
        const format = d3.format(",.0f");

        // Create a SVG container.
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

        // Constructs and configures a Sankey generator.
        const sankey = d3Sankey()
            .nodeId(d => d.name)
             .nodeAlign(d3SankeyJS[nodeAlignVal]) // d3.sankeyLeft, etc.
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 5], [width - 1, height - 5]]);

        // Applies it to the data. We make a copy of the nodes and links objects
        // so as to avoid mutating the original.
        const {nodes, links} = sankey({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
        });

        // Defines a color scale.
         const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Creates the rects that represent the nodes.
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

        // Adds a title on the nodes.
        rect.append("title")
            .text(d => `${d.name}\n${format(d.value)} TWh`);

            console.log("links", links);
        // Creates the paths that represent the links.
        const link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.5)
        .selectAll()
        .data(links)
        .join("g")
             .style("mix-blend-mode", "multiply");

        // Creates a gradient, if necessary, for the source-target color option.
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

        // Adds labels on the nodes.
        svg.append("g")
        .selectAll()
        .data(nodes)
        .join("text")
            .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
            .text(d => d.name);

            // Append the SVG to the container in your app.js
            const svgContainer = document.getElementById("SvgContainerId"); // Replace with your actual container ID
            svgContainer.innerHTML = "";
            svgContainer.appendChild(svg.node());
       
      }

      

     render(){
            return (
            <div>
                
                <div id="SvgContainerId"></div>
            </div>
            );
     }
 }


 export default SankeyDiagram;