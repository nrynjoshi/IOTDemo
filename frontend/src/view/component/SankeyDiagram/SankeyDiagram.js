import React from "react";
import { createSankeyDiagramSVG } from "./SankeyDiagramD3"

class SankeyDiagram extends React.Component {

    state = { data: null, linkColor: "source", nodeAlignment: "sankeyJustify", httpErrorMessage: null, isLoading: false };

    componentDidMount() {
        const activitiesTrack = this.props.data;
        this.setState({httpErrorMessage: activitiesTrack.httpErrorMessage})
        this.setState({isLoading: activitiesTrack.isLoading})
        this.setState({data: activitiesTrack.data})
    }

    componentDidUpdate() {
        const { linkColor, nodeAlignment, data, httpErrorMessage } = this.state

        if (data != null && httpErrorMessage == null) {
            const svgNode = createSankeyDiagramSVG(data, linkColor, nodeAlignment);

            // Append the SVG to the container in your app.js
            const svgContainer = document.getElementById("SvgContainerId"); // Replace with your actual container ID
            svgContainer.innerHTML = "";
            svgContainer.appendChild(svgNode);
        }
    }

    render() {
        const { httpErrorMessage, isLoading, data } = this.state
        return (<div className="p-1 pl-3">
            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}
            {data && <div id="SvgContainerId"></div>}
        </div>);
    }
}

export default SankeyDiagram;