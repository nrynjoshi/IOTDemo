import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import {createMobilePatentSuitSVG} from "../react-d3/MobilePatentSuitsD3"



class MobilePatentSuitsGraph extends React.Component {
    
    state = {data: null, httpErrorMessage:null, isLoading: false};
    
    componentDidMount() {
        const url = this.props.dataEndpoint;
        //calling api for data
        const fetchData = async () => {
            try {
                this.setState({isLoading: true})
              const data =  await HttpClient.get(url);
              this.setState({data:data, httpErrorMessage:null});
            } catch (error) {
              console.error('Error fetching data:', error);
              this.setState({data:null, httpErrorMessage: JSON.stringify(error.toString()) });
            } finally {
                this.setState({isLoading: false})
            }
          };
      
          fetchData();
        
    }
    componentDidUpdate() {

          const { data, httpErrorMessage} = this.state

        if(data != null && httpErrorMessage == null){
           // Specify the dimensions of the chart.

            const svgNode = createMobilePatentSuitSVG(data);

            // Append the SVG to the container in your app.js
            const svgContainer = document.getElementById("SvgContainerIdForMobilePatentSuits"); // Replace with your actual container ID
            svgContainer.innerHTML = "";
            svgContainer.appendChild(svgNode);
        }

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
                <h2>Mobile Patent Suit</h2>


                {data && <div id="SvgContainerIdForMobilePatentSuits"></div>}

            </ErrorBoundary></div>
            );
     }
 }


 export default MobilePatentSuitsGraph;