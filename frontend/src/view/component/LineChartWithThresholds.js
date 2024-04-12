
import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import LineChartD3 from "../react-d3/LineChartD3.js";
import LineChartWithThresholdsD3 from "../react-d3/LineChartWithThresholdsD3.js";

// const data = [
//     { timestamp: new Date('2024-03-25T08:00:00'), spo2: 98 },
//     { timestamp: new Date('2024-03-25T08:15:00'), spo2: 97 },
//     { timestamp: new Date('2024-03-25T08:30:00'), spo2: 96 },
//     { timestamp: new Date('2024-03-25T08:45:00'), spo2: 95 },
//     { timestamp: new Date('2024-03-25T09:00:00'), spo2: 94 },
//     { timestamp: new Date('2024-03-25T09:15:00'), spo2: 92 },
//     { timestamp: new Date('2024-03-25T09:30:00'), spo2: 90 },
//     { timestamp: new Date('2024-03-25T09:45:00'), spo2: 89 },
//     { timestamp: new Date('2024-03-25T10:00:00'), spo2: 90 },
//     { timestamp: new Date('2024-03-25T10:15:00'), spo2: 91 },
//     { timestamp: new Date('2024-03-25T10:30:00'), spo2: 93 },
//     { timestamp: new Date('2024-03-25T10:45:00'), spo2: 94 },
//     // Add more data points as needed
//   ];

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