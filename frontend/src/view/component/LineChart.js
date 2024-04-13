import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import LineChartD3 from "../react-d3/LineChartD3.js";

class LineChart extends React.Component {


    render() {
        const data = this.props.data;
        const xAxiasLable = this.props.xAxiasLable;
        const yAxiasLable = this.props.yAxiasLable;
        return (
            <div><ErrorBoundary>

                <LineChartD3 data={data} width={1200} height={500} xAxiasLable={xAxiasLable} yAxiasLable={yAxiasLable} />

            </ErrorBoundary></div>
        );
    }
}


export default LineChart;