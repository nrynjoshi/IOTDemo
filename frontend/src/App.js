import './App.css';
import React from "react";
import SankeyDiagram from './view/component/SankeyDiagram';
import MobilePatentSuits from './view/component/MobilePatentSuits';
import ForceDirectedGraph from './view/component/ForceDirectedGraph';
import ParallelCoordinates from "./view/component/ParallelCoordinates";
import {BACKEND_API_CALL} from "./view/util/Constant";
import PatientDashboard from "./view/component/PatientDashboard";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import ActivityTrack from "./view/component/ActivityTrack";
import Analysis from "./view/component/Analysis";
import EmergencyContact from "./view/component/EmergencyContact";
import Inbox from "./view/component/Inbox";


class App extends React.Component {


  render(){


    return (

        <Router>
            <div>

                <div className="bg-neutral-500 shadow-lg shadow-cyan-500/50 w-full h-12 header">
                    <ul>
                        <li><Link to="/" className="bg-black">Dashboard</Link></li>
                        <li><Link to="/activities-track" >Activities Track</Link></li>
                        <li><Link to="/analysis">Analysis</Link></li>
                        <li><Link to="/emergency-contacts">Emergency Contacts</Link></li>
                        <li><Link to="/inbox">Inbox</Link></li>
                    </ul>
                </div>
                <div className="m-4">
                    <Routes>
                        <Route path="/" element={<PatientDashboard />} />
                        <Route path="/activities-track" element={<ActivityTrack />} />
                        <Route path="/analysis" element={<Analysis />} />
                        <Route path="/emergency-contacts" element={<EmergencyContact />} />
                        <Route path="/inbox" element={<Inbox />} />
                    </Routes>


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
            </Router>
    );
  }

}

export default App;
