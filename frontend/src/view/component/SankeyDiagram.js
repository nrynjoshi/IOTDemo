import React from "react";
import HttpClient from "../util/HttpClient"
import { createSankeyDiagramSVG } from "../react-d3/SankeyDiagramD3"

class SankeyDiagram extends React.Component {

    state = { data: null, linkColor: "source", nodeAlignment: "sankeyJustify", httpErrorMessage: null, isLoading: false };

    componentDidMount() {
        const url = this.props.dataEndpoint;
        //calling api for data
        const fetchData = async () => {
            try {
                this.setState({ isLoading: true })
                const data = await HttpClient.get(url);
                this.setState({ data: data, httpErrorMessage: null });
            } catch (error) {
                console.error('Error fetching data:', error);
                this.setState({ data: null, httpErrorMessage: JSON.stringify(error.toString()) });
            } finally {
                this.setState({ isLoading: false })
            }
        };

        fetchData();

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