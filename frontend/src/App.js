import './App.css';
import React from "react";
import SankeyDiagram from './view/component/SankeyDiagram';
import MobilePatentSuits from './view/component/MobilePatentSuits';
import ForceDirectedGraph from './view/component/ForceDirectedGraph';
import ParallelCoordinates from "./view/component/ParallelCoordinates";
import {BACKEND_API_CALL} from "./view/util/Constant";



class App extends React.Component {


  render(){
    return (
      <div className="App">
        <div>D3.js with Reactjs Sample Demo App</div>
          <div>
            <SankeyDiagram dataEndpoint={BACKEND_API_CALL + '/energy'}></SankeyDiagram>
            <hr></hr>
            <ForceDirectedGraph  dataEndpoint={BACKEND_API_CALL + '/force-directed-graph'}></ForceDirectedGraph>
            <hr></hr>
            <MobilePatentSuits  dataEndpoint={BACKEND_API_CALL + '/mobile-patent-suits'}></MobilePatentSuits>
            <hr></hr>
            <ParallelCoordinates dataEndpoint={BACKEND_API_CALL + '/parallel-coordinate-cars'} keysEndpoint={BACKEND_API_CALL + '/parallel-coordinate-keys'}></ParallelCoordinates>
          </div>
           <div>
           </div>

           
       
      </div>
    );
  }

}

export default App;
