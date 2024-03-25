
import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import LineChartD3 from "../react-d3/LineChartD3.js";
import LineChartWithThresholdsD3 from "../react-d3/LineChartWithThresholdsD3.js";

const data = [
    { timestamp: new Date('2024-03-25T08:00:00'), spo2: 98 },
    { timestamp: new Date('2024-03-25T08:15:00'), spo2: 97 },
    { timestamp: new Date('2024-03-25T08:30:00'), spo2: 96 },
    { timestamp: new Date('2024-03-25T08:45:00'), spo2: 95 },
    { timestamp: new Date('2024-03-25T09:00:00'), spo2: 94 },
    { timestamp: new Date('2024-03-25T09:15:00'), spo2: 92 },
    { timestamp: new Date('2024-03-25T09:30:00'), spo2: 90 },
    { timestamp: new Date('2024-03-25T09:45:00'), spo2: 89 },
    { timestamp: new Date('2024-03-25T10:00:00'), spo2: 90 },
    { timestamp: new Date('2024-03-25T10:15:00'), spo2: 91 },
    { timestamp: new Date('2024-03-25T10:30:00'), spo2: 93 },
    { timestamp: new Date('2024-03-25T10:45:00'), spo2: 94 },
    // Add more data points as needed
  ];

class LineChartWithThresholds extends React.Component {
    
    state = {data: null, httpErrorMessage:null, isLoading: false};
    
    componentDidMount() {
        const url = this.props.dataEndpoint;
        //calling api for data
        const fetchData = async () => {
            try {
                this.setState({isLoading: true})
            //   const data =  await HttpClient.get(url);
            //   this.setState({data:data, httpErrorMessage:null});
            this.setState({data: data});
            } catch (error) {
              console.error('Error fetching data:', error);
              this.setState({data:null, httpErrorMessage: JSON.stringify(error.toString()) });
            } finally {
                this.setState({isLoading: false})
            }
          };
      
          fetchData();
        
    }

     render(){
        const { httpErrorMessage, isLoading, data} = this.state
            return (
            <div><ErrorBoundary>

                {isLoading ? (
                    <p>Loading ...</p>
                ) : (httpErrorMessage ? <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2> :
                        <span></span>
                )}

                {data && <LineChartWithThresholdsD3 data={data} width={500} height={300} />}

            </ErrorBoundary></div>
            );
     }
 }


 export default LineChartWithThresholds;