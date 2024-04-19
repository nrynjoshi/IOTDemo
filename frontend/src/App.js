import './App.css';
import React from "react";

import PatientDashboard from "./view/component/PatientDashboard";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import ActivityTrack from "./view/component/ActivityTrack";
import Analysis from "./view/component/Analysis";
import EmergencyContact from "./view/component/EmergencyContact";
import DiseaseFinderML from "./view/component/DiseaseFinderML";
import PageNotFound from "./view/component/PageNotFound";
import { BACKEND_API_CALL } from "./view/util/Constant";
import DateTime from './view/util/DateTime';
import HttpRequestUtil from './view/util/HttpRequestUtil';

class App extends React.Component {

  render() {
    // Call MyComponent to get jsonParams
    const httpRequestUtil = new HttpRequestUtil();

    // Access jsonParams
    const jsonParams = httpRequestUtil.render();
    console.log('-------------------------------------------------------')
    console.log(jsonParams)
    console.log('-------------------------------------------------------')
    if (jsonParams['redirect']) {
      // window.location.href = jsonParams['redirect']; // Redirect to the specified URL
    }


    console.log(jsonParams);
    return (
      <BrowserRouter>
        <div className="w-full text-2xl App">
          <div className="header">
            <ul>
              <li><NavLink to="/" className={({ isActive }) => { return isActive ? "bg-black font-bold" : "text-white"; }}>Dashboard</NavLink></li>
              <li><NavLink to="/activities-track" className={({ isActive }) => { return isActive ? "bg-black font-bold" : "text-white"; }}>Activities Track</NavLink></li>
              <li><NavLink to="/analysis" className={({ isActive }) => { return isActive ? "bg-black font-bold" : "text-white"; }}>Analysis</NavLink></li>
              <li><NavLink to="/emergency-contacts" className={({ isActive }) => { return isActive ? "bg-black font-bold" : "text-white"; }}>Emergency Contacts</NavLink></li>
              <li><NavLink to="/disease-identification" className={({ isActive }) => { return isActive ? "bg-black font-bold" : "text-white"; }}>Disease Finder</NavLink></li>
              <li className='datetime'><DateTime></DateTime></li>
            </ul>

          </div>
          <div >

            <div className="m-4">
              {jsonParams.userId && (<span>Welcome, {jsonParams.userId}</span>)}
              <Routes>
                <Route path="/" element={<PatientDashboard />} />
                <Route path="/activities-track" element={<ActivityTrack />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/emergency-contacts" element={<EmergencyContact dataEndpoint={BACKEND_API_CALL + '/emergency-contacts'} />} />
                <Route path="/disease-identification" element={<DiseaseFinderML />} />
                <Route element={<PageNotFound />} />
              </Routes>
            </div>
          </div>


        </div>
      </BrowserRouter>
    );
  }

}

export default App;
