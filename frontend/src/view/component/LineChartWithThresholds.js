
import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import LineChartD3 from "../react-d3/LineChartD3.js";
import LineChartWithThresholdsD3 from "../react-d3/LineChartWithThresholdsD3.js";

class LineChartWithThresholds extends React.Component {
    
    state = {data: null, httpErrorMessage:null, isLoading: false};
    
    

     render(){
        const data = this.props.data;
        const mild = this.props.mild;
        const normal = this.props.normal;
        const severe = this.props.severe;
            return (
            <div><ErrorBoundary>
                <LineChartWithThresholdsD3 data={data}  width={1200} height={500}   mild={mild} normal={normal} severe={severe} />
            </ErrorBoundary></div>
            );
     }
 }


 export default LineChartWithThresholds;