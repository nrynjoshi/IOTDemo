import './App.css';
import React from "react";
import SankeyDiagram from './view/react-d3/SankeyDiagram';
import ForceDirectedGraph from './view/react-d3/ForceDirectedGraph';
import MobilePatentSuits from './view/react-d3/MobilePatentSuits';

class App extends React.Component {


  render(){
    return (
      <div className="App">
        <div>D3.js with Reactjs Sample Demo App</div>
          <div>
          
            <div>
            <SankeyDiagram width={928} height={600}></SankeyDiagram>
            </div>
            
            <hr></hr>
            <ForceDirectedGraph  width={928} height={600}></ForceDirectedGraph>
            <hr></hr>
            <MobilePatentSuits  width={928} height={600}></MobilePatentSuits>
          </div>
           <div>
           </div>

           
       
      </div>
    );
  }

}

export default App;
