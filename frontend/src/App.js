import './App.css';
import React from "react";
import SankeyDiagram from './view/component/SankeyDiagram';
import MobilePatentSuits from './view/component/MobilePatentSuits';
import ForceDirectedGraph from './view/component/ForceDirectedGraph';
import ParallelCoordinates from "./view/component/ParallelCoordinates";
import {BACKEND_API_CALL} from "./view/util/Constant";
import PatientDashboard from "./view/component/PatientDashboard";



class App extends React.Component {


  render(){


    return (
        //className="App"
        <div>

            <div className="bg-neutral-500 shadow-lg shadow-cyan-500/50 w-full h-12 header">
                <ul>
                    <li><a href="/">Dashboard</a></li>
                    <li><a href="/">Activities Track</a></li>
                    <li><a href="/">Analysis</a></li>
                    <li><a href="/">Emergency Contacts</a></li>
                    <li><a href="/">Inbox</a></li>
                </ul>
            </div>
            <div className="m-4">
                <PatientDashboard></PatientDashboard>

            </div>
            <hr></hr>
            <div>D3.js with Reactjs Sample Demo App</div>
            <div>
                <SankeyDiagram dataEndpoint={BACKEND_API_CALL + '/energy'}></SankeyDiagram>
                <hr></hr>
                <ForceDirectedGraph dataEndpoint={BACKEND_API_CALL + '/force-directed-graph'}></ForceDirectedGraph>
                <hr></hr>
                <MobilePatentSuits dataEndpoint={BACKEND_API_CALL + '/mobile-patent-suits'}></MobilePatentSuits>
                <hr></hr>
                <ParallelCoordinates dataEndpoint={BACKEND_API_CALL + '/parallel-coordinate-cars'}
                                     keysEndpoint={BACKEND_API_CALL + '/parallel-coordinate-keys'}></ParallelCoordinates>
            </div>
            <div>
            </div>


        </div>
    );
  }

}

export default App;
