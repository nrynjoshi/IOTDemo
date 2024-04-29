import * as d3 from "d3";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import * as d3SankeyJS from "d3-sankey";


const COLOR_SCALE = d3.scaleOrdinal()
    .range(["#C0C0C0", "#808080", "#FF0000", "#800000", "#FFFF00", "#808000", "#00FF00", "#008000", "#00FFFF",
        "#008080", "#0000FF", "#000080", "#FF00FF", "#800080", "#CD5C5C", "#F08080", "#E9967A", "#FFA07A",
        "#DFFF00", "#6495ED", "#CCCCFF", "#40E0D0", "#9FE2BF", "#800980", "#CD525C", "#F08580", "#E9867A", "#FF507A", "#DF3F00", "#6415ED", "#CCC1FF", "#4010D0", "#9FE2AF"]);

export const createSankeyDiagramSVG = (data, linkColor, nodeAlignment) => {

    // Specify the dimensions of the chart.
    const width = 1200;
    const height = 600;
    const format = d3.format(",.0f");
    const color = COLOR_SCALE;

    // Create a SVG container.
    const svg = d3.create("svg")
        .attr("width", "100%")
        .attr("height", null)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Constructs and configures a Sankey generator.
    const sankey = d3Sankey()
        .nodeId(d => d.name)
        .nodeAlign(d3SankeyJS[nodeAlignment]) // d3.sankeyLeft, etc.
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [width - 1, height - 5]]);

    // Applies it to the data. We make a copy of the nodes and links objects
    // so as to avoid mutating the original.
    const { nodes, links } = sankey({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
    });

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
        .text(d => d.name)
        .style("font-size", "18px");

    return svg.node();
}

