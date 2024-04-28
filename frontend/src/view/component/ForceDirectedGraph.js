
import React from "react";
import HttpClient from "./HttpClient"
import { createForceDirectedGraphSVG } from "../react-d3/ForceDirectedGraphD3"



class ForceDirectedGraph extends React.Component {

  state = { data: null, httpErrorMessage: null, isLoading: false };

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