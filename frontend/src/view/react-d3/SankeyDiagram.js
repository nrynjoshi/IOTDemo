import React from "react";
import HttpClient from "../util/HttpClient"
import {BACKEND_API_CALL} from "../util/Constant"
import { addLabelsOnTheNodes, addTitleOnTheNodes, appendSVGToTheContainer, constructAndConfiguresSankeyGenerator, createGradientForSourceTargetColor, createRectsThatRepresentTheNodes, createSVGContainer, createThePathsThatRepresentTheLinks } from "../SankeyD3.js";
export * from "../SankeyD3.js";


class SankeyDiagram extends React.Component {
    
    state = {data: null, linkColor:"source", nodeAlignment:"sankeyJustify", httpErrorMessage:null, isLoading: false};    
    
    componentDidMount() {
        const url = BACKEND_API_CALL + '/energy';
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
           const width = this.props.width;
            const height = this.props.height;

            // Create a SVG container.
            
            const svg = createSVGContainer(width, height);

            // Constructs and configures a Sankey generator.
            const sankey = constructAndConfiguresSankeyGenerator(width, height, nodeAlignment)
            
            // Applies it to the data. We make a copy of the nodes and links objects
            // so as to avoid mutating the original.
            const {nodes, links} = sankey({
            nodes: data.nodes.map(d => Object.assign({}, d)),
            links: data.links.map(d => Object.assign({}, d))
            });

        
            
            // Creates the rects that represent the nodes.
            const rect = createRectsThatRepresentTheNodes(svg, nodes)

            // Adds a title on the nodes.
            addTitleOnTheNodes(rect)
            
            // Creates the paths that represent the links.
            const link = createThePathsThatRepresentTheLinks(svg, links);
                

            // Creates a gradient, if necessary, for the source-target color option.
            createGradientForSourceTargetColor(link, linkColor)

            // Adds labels on the nodes.
            addLabelsOnTheNodes(svg, nodes, width);

            // Append the SVG to the container in your app.js
            appendSVGToTheContainer(svg, "SvgContainerId")       
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
            <div>

                {isLoading ? (
                    <p>Loading ...</p>
                ) : (httpErrorMessage ? <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2>:
                <span></span>
                )}
               
                 <div>
                Link color &nbsp;
                <select value={linkColor} onChange={this.handleLinkColorChange}>
                    <option value="#aaa">static</option>
                    {/* <option value="source-target">source-target</option> */}
                    <option value="source">source</option>
                    <option value="target">target</option>
                </select>
                </div>
                <div>
                Node alignment &nbsp;

                <select value={nodeAlignment} onChange={this.handleNodeAlignmentChange}>
                    <option value="sankeyLeft">left</option>
                    <option value="sankeyRight">right</option>
                    <option value="sankeyCenter">center</option>
                    <option value="sankeyJustify">justify</option>
                </select>
                </div>
                
                { data && <div id="SvgContainerId"></div>}
                
            </div>
            );
     }
 }


 export default SankeyDiagram;