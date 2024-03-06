import './App.css';
import React from "react";

import PatientDashboard from "./view/component/PatientDashboard";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import ActivityTrack from "./view/component/ActivityTrack";
import Analysis from "./view/component/Analysis";
import EmergencyContact from "./view/component/EmergencyContact";
import Inbox from "./view/component/Inbox";
import Demo from "./view/component/Demo";
import PageNotFound from "./view/component/PageNotFound";

class App extends React.Component {


  render(){

    return (
         <BrowserRouter>
             <div>
                 <div className="bg-neutral-500 shadow-lg shadow-cyan-500/50 w-full h-12 header">
                     <ul>
                         <li><NavLink to="/" className={({ isActive }) => { return isActive ? "bg-black" : "text-white";}}>Dashboard</NavLink></li>
                         <li><NavLink to="/activities-track" className={({ isActive }) => { return isActive ? "bg-black" : "text-white";}}>Activities Track</NavLink></li>
                         <li><NavLink to="/analysis" className={({ isActive }) => { return isActive ? "bg-black" : "text-white";}}>Analysis</NavLink></li>
                         <li><NavLink to="/emergency-contacts" className={({ isActive }) => { return isActive ? "bg-black" : "text-white";}}>Emergency Contacts</NavLink></li>
                         <li><NavLink to="/inbox" className={({ isActive }) => { return isActive ? "bg-black" : "text-white";}}>Inbox</NavLink></li>
                         <li><NavLink to="/demo" className={({ isActive }) => { return isActive ? "bg-black" : "text-white";}}>Demo</NavLink></li>
                     </ul>

                 </div>
                 <div className="m-4">
                     <Routes>
                         <Route path="/" element={<PatientDashboard/>}/>
                         <Route path="/activities-track" element={<ActivityTrack/>}/>
                         <Route path="/analysis" element={<Analysis/>}/>
                         <Route path="/emergency-contacts" element={<EmergencyContact/>}/>
                         <Route path="/inbox" element={<Inbox/>}/>
                         <Route path="/demo" element={<Demo/>}/>
                        <Route element={<PageNotFound/>}/>
                      </Routes>
                 </div>


             </div>
         </BrowserRouter>
    );
  }

}

export default App;
