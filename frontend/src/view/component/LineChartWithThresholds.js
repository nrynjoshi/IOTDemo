
import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import LineChartD3 from "../react-d3/LineChartD3.js";
import LineChartWithThresholdsD3 from "../react-d3/LineChartWithThresholdsD3.js";

class LineChartWithThresholds extends React.Component {

    state = { data: null, httpErrorMessage: null, isLoading: false };



    render() {
        const data = this.props.data;
        const xAxiasLable = this.props.xAxiasLable;
        const yAxiasLable = this.props.yAxiasLable;

        const thresholds = this.props.thresholds
        return (
            <div><ErrorBoundary>
                <LineChartWithThresholdsD3 data={data} width={1200} height={500} thresholdsContext={thresholds} xAxiasLable={xAxiasLable} yAxiasLable={yAxiasLable}  />
            </ErrorBoundary></div>
        );
    }
}


export default LineChartWithThresholds;