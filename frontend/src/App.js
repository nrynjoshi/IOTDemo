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
          
            <hr></hr>
            <SankeyDiagram></SankeyDiagram> 
            <hr></hr>
            <ForceDirectedGraph></ForceDirectedGraph>
            <hr></hr>
            <MobilePatentSuits></MobilePatentSuits>
          </div>
           <div>
           </div>

           
       
      </div>
    );
  }

}

export default App;
