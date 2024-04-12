import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import LineChartD3 from "../react-d3/LineChartD3.js";
import HypnogramD3 from "../react-d3/HypnogramD3.js";

// const data = [
//     { timestamp: new Date('2024-03-25T22:00:00'), stage: 'Awake' },
//     { timestamp: new Date('2024-03-25T22:30:00'), stage: 'Light sleep' },
//     { timestamp: new Date('2024-03-25T23:30:00'), stage: 'Deep sleep' },
//     { timestamp: new Date('2024-03-26T00:30:00'), stage: 'REM sleep' },
//     { timestamp: new Date('2024-03-26T01:30:00'), stage: 'Light sleep' },
//     { timestamp: new Date('2024-03-26T02:30:00'), stage: 'Deep sleep' },
//     { timestamp: new Date('2024-03-26T03:30:00'), stage: 'REM sleep' },
//     { timestamp: new Date('2024-03-26T04:30:00'), stage: 'Awake' },
//     // Add more data points as needed
//   ];

class Hypnogram extends React.Component {
    
    state = {data: null, httpErrorMessage:null, isLoading: false};
    
    

     render(){
        const data = this.props.data;
            return (
            <div><ErrorBoundary>
                    <HypnogramD3 data={data}  width={1200} height={500}  />
            </ErrorBoundary></div>
            );
     }
 }


 export default Hypnogram;