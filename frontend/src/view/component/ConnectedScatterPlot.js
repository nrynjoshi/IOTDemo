import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"

import ConnectedScatterPlotD3 from "../react-d3/ConnectedScatterPlotD3.js";

const data = [
    { x: 1, y: 10, category: 'A' },
    { x: 2, y: 20, category: 'A' },
    { x: 3, y: 15, category: 'A' },
    { x: 4, y: 25, category: 'A' },
    { x: 1, y: 5, category: 'B' },
    { x: 2, y: 15, category: 'B' },
    { x: 3, y: 10, category: 'B' },
    { x: 4, y: 20, category: 'B' }
  ];

class ConnectedScatterPlot extends React.Component {
    
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

                {data && <ConnectedScatterPlotD3 data={data} width={500} height={300} />}

            </ErrorBoundary></div>
            );
     }
 }


 export default ConnectedScatterPlot;