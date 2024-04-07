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
    
    componentDidMount() {
        const url = this.props.dataEndpoint;
        //calling api for data
        const fetchData = async () => {
            try {
                this.setState({isLoading: true})
               const data =  await HttpClient.get(url);
              this.setState({data:data, httpErrorMessage:null});
            // this.setState({data: data});
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

                {data && <HypnogramD3 data={data} width={500} height={300} />}

            </ErrorBoundary></div>
            );
     }
 }


 export default Hypnogram;