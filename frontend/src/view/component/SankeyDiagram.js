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

    handleLinkColorChange = (e) => {
        console.log('handleLineColorChange called');
        this.setState({ linkColor: e.target.value });
    }

    handleNodeAlignmentChange = (e) => {
        console.log('handleNodeAlignmentChange called');
        this.setState({ nodeAlignment: e.target.value });
    }


    render() {
        const { httpErrorMessage, linkColor, nodeAlignment, isLoading, data } = this.state
        return (<div className="p-1 pl-3">

            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}
            {/*<h2>Sankey Diagram</h2>*/}
            {/*<div>*/}
            {/*    Link color &nbsp;*/}
            {/*    <select value={linkColor} onChange={this.handleLinkColorChange}>*/}
            {/*        <option value="#aaa">static</option>*/}
            {/*        /!* <option value="source-target">source-target</option> *!/*/}
            {/*        <option value="source">source</option>*/}
            {/*        <option value="target">target</option>*/}
            {/*    </select>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    Node alignment &nbsp;*/}

            {/*    <select value={nodeAlignment} onChange={this.handleNodeAlignmentChange}>*/}
            {/*        <option value="sankeyLeft">left</option>*/}
            {/*        <option value="sankeyRight">right</option>*/}
            {/*        <option value="sankeyCenter">center</option>*/}
            {/*        <option value="sankeyJustify">justify</option>*/}
            {/*    </select>*/}
            {/*</div>*/}

            {data && <div id="SvgContainerId"></div>}

        </div>);
    }
}


export default SankeyDiagram;