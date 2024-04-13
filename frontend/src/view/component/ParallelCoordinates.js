import React from "react";
import HttpClient from "../util/HttpClient"
import { createParallelCoordinatesSVG } from "../react-d3/ParallelCoordinatesD3"

class ParallelCoordinates extends React.Component {

    state = { dataCar: null, dataKeys: null, colorEncoding: "weight (lb)", httpErrorMessage: null, isLoading: false };

    componentDidMount() {
        const car_url = this.props.dataEndpoint;
        const key_url = this.props.keysEndpoint;
        //calling api for data
        const fetchData = async () => {
            try {
                this.setState({ isLoading: true })
                const dataCar = await HttpClient.get(car_url);
                this.setState({ dataCar: dataCar, httpErrorMessage: null });

                const dataKeys = await HttpClient.get(key_url);
                this.setState({ dataKeys: dataKeys, httpErrorMessage: null });
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

        const { dataCar, dataKeys, colorEncoding, httpErrorMessage } = this.state

        if (dataCar != null && dataKeys != null && httpErrorMessage == null) {

            const svgNode = createParallelCoordinatesSVG(dataCar, dataKeys, colorEncoding);

            // Append the SVG to the container in your app.js
            const svgContainer = document.getElementById("SvgContainerForParallelCoordinatesId"); // Replace with your actual container ID
            svgContainer.innerHTML = "";
            svgContainer.appendChild(svgNode);
        }


    }

    handleColorEncodingChange = (e) => {
        console.log('handleColorEncodingChange called');
        this.setState({ colorEncoding: e.target.value });
    }


    render() {
        const { httpErrorMessage, colorEncoding, isLoading, dataCar } = this.state
        return (<div>

            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}
            <h2>Parallel Coordinates</h2>
            <div>
                Color Encoding &nbsp;
                <select value={colorEncoding} onChange={this.handleColorEncodingChange}>
                    <option value="economy (mpg)">economy (mpg)</option>
                    <option value="cylinders">cylinders</option>
                    <option value="displacement (cc)">displacement (cc)</option>
                    <option value="power (hp)">power (hp)</option>
                    <option value="weight (lb)">weight (lb)</option>
                    <option value="0-60 mph (s)">0-60 mph (s)</option>
                    <option value="year">year</option>


                </select>
            </div>


            {dataCar && <div id="SvgContainerForParallelCoordinatesId"></div>}

        </div>);
    }
}


export default ParallelCoordinates;