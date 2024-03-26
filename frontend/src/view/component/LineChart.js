import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import LineChartD3 from "../react-d3/LineChartD3.js";

const data = [
    { x: 6, y: 1000 },
    { x: 7, y: 1000 },
    { x: 8, y: 3000 },
    { x: 9, y: 25 },
    { x: 10, y: 18 },
    { x: 11, y: 4000 },
    { x: 12, y: 20 },
    { x: 13, y: 15 },
    { x: 14, y: 25 },
    { x: 15, y: 18 },
    { x: 16, y: 8000 },
    { x: 17, y: 20 },
    { x: 18, y: 15 },
    { x: 19, y: 500 },
    { x: 20, y: 18 },
    { x: 21, y: 18 },
    { x: 22, y: 18 },
  ];

class LineChart extends React.Component {
    
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

                {data && <LineChartD3 data={data} width={500} height={300} />}

            </ErrorBoundary></div>
            );
     }
 }


 export default LineChart;