import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import {BACKEND_API_CALL} from "../util/Constant"
import { MobilePatentSuitsDisplay } from "../SankeyD3.js";
export * from "../SankeyD3.js";



class ForceDirectedGraph extends React.Component {
    
    state = {data: null, linkColor:"source", nodeAlignment:"sankeyJustify", httpErrorMessage:null, isLoading: false};    
    
    componentDidMount() {
        const url = BACKEND_API_CALL + '/mobile-patent-suits';
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

          const {linkColor, nodeAlignment, data, httpErrorMessage} = this.state

          
        if(data != null && httpErrorMessage == null){
           // Specify the dimensions of the chart.
            const width = 928;
            const height = 600;

            MobilePatentSuitsDisplay(width, height, data, "SvgContainerIdForMobilePatentSuits") 
        }

        
    

        
      }

      handleLinkColorChange = (e)=>{
        console.log('handleLineColorChange called');
        this.setState({linkColor:e.target.value});
      }
    
      handleNodeAlignmentChange= (e)=>{
        console.log('handleNodeAlignmentChange called');
        this.setState({nodeAlignment:e.target.value});
      }
      

     render(){
        const { httpErrorMessage, linkColor, nodeAlignment, isLoading, data} = this.state
            return (
            <div><ErrorBoundary>
                
                {isLoading ? (
                    <p>Loading ...</p>
                ) : (httpErrorMessage ? <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2>:
                <span></span>
                )}
               
                
                
                { data && <div id="SvgContainerIdForMobilePatentSuits"></div>}
                
            </ErrorBoundary></div>
            );
     }
 }


 export default ForceDirectedGraph;