
import React from "react";
import { createForceDirectedGraphSVG } from "./ForceDirectedGraphD3"



class ForceDirectedGraph extends React.Component {

  state = { data: null, httpErrorMessage: null, isLoading: false };

  componentDidMount() {
        const activitiesTrack = this.props.data;
        this.setState({httpErrorMessage: activitiesTrack.httpErrorMessage})
        this.setState({isLoading: activitiesTrack.isLoading})
        this.setState({data: activitiesTrack.data})
  }

  componentDidUpdate() {

    const { data, httpErrorMessage } = this.state

    if (data != null && httpErrorMessage == null) {
      const svgNode = createForceDirectedGraphSVG(data);
      // Append the SVG to the container in your app.js
      const svgContainer = document.getElementById("SvgContainerIdForForceDirectedGraph"); // Replace with your actual container ID
      svgContainer.innerHTML = "";
      svgContainer.appendChild(svgNode);
    }
  }


  render() {
    const { httpErrorMessage, isLoading, data } = this.state
    return (
      <div>
        {isLoading ? (
          <p>Loading ...</p>
        ) : (httpErrorMessage ? <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> :
          <span></span>
        )}
        {data && <div id="SvgContainerIdForForceDirectedGraph"></div>}
      </div>
    );
  }
}

export default ForceDirectedGraph;