import './App.css';
import React from "react";
import SankeyDiagram from './view/SankeyDiagram';

class App extends React.Component {

  state = {data:null, linkColor:"source", nodeAlignment:"sankeyJustify", httpErrorMessage:null};

  componentDidMount(){
    const fetchData = async () => {
      this.setState({httpErrorMessage: null});
      try {
        const response = await fetch('http://127.0.0.1:5000/energy');
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.setState({data: data});
      } catch (error) {
        console.log(error);
        this.setState({httpErrorMessage: JSON.stringify(error.toString()) });
      } finally {
        //change the loading display part variable if needed
      }
    };

    // Call the fetch data function when the component mounts
    fetchData();
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
    const {data, linkColor, nodeAlignment, httpErrorMessage} = this.state
    console.log('linkColor', linkColor);
    console.log('nodeAlignment', nodeAlignment);
    console.log('httpErrorMessage', httpErrorMessage);
    return (
      <div className="App">
        <div>D3.js with Reactjs Sample Demo App</div>

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

                { httpErrorMessage && <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2> }

       { data && 
       
           <SankeyDiagram data={data} linkColor={linkColor} nodeAlignment={nodeAlignment}></SankeyDiagram> 
       }
      </div>
    );
  }

}

export default App;
