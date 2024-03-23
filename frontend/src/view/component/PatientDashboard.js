import React from "react";
import {BACKEND_API_CALL} from "../util/Constant";
import TodoList from "./TodoList";
import PageTitle from "./PageTitle";

import useSound from "use-sound";
import beepSound from "./../audio/beep-02.mp3";
import SoundUtil from "../util/SoundUtil";
import CurrentDashboardDisplay from "../util/CurrentDashboardDisplay";
class PatientDashboard extends React.Component {

    state = { dataKeys:null, httpErrorMessage: null, isLoading: false};

    componentDidMount() {


    }

    componentDidUpdate() {



    }




    render() {
        const {httpErrorMessage,isLoading, dataCar} = this.state

        return (<div>

            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2> : <span></span>)}

            <div className="">
                <div className="grid grid-rows-3 grid-flow-col gap-4">
{/*<SoundUtil triggerValue={97}></SoundUtil>*/}
                    <div className="row-span-3">
                        <div className="grid grid-cols-4 gap-4">

                            <div className="card">
                                <CurrentDashboardDisplay dataEndpoint= {BACKEND_API_CALL + '/current/heart-rate'} />
                        
                                

                            </div>

                            <div className="card">
                                <CurrentDashboardDisplay dataEndpoint= {BACKEND_API_CALL + '/current/SPO2'} />
                            </div>
                            <div className="card">
                                <CurrentDashboardDisplay dataEndpoint= {BACKEND_API_CALL + '/current/respiratory-rate'} />
                                
                            </div>
                            <div className="card">
                                <CurrentDashboardDisplay dataEndpoint= {BACKEND_API_CALL + '/current/body-temperature'} />
                            </div>
                            <div className="card">
                                <CurrentDashboardDisplay dataEndpoint= {BACKEND_API_CALL + '/current/blood-pressure'} />

                            </div>
                            <div className="card">
                                <CurrentDashboardDisplay dataEndpoint= {BACKEND_API_CALL + '/current/blood-sugar'} />

                            </div>
                            <div className="card">
                                <CurrentDashboardDisplay dataEndpoint= {BACKEND_API_CALL + '/current/mental-status'} />
                            </div>

                            <div className="card">
                                <CurrentDashboardDisplay dataEndpoint= {BACKEND_API_CALL + '/current/sleep-pattern'} />
                            </div>

                            <div className="card">
                                <CurrentDashboardDisplay dataEndpoint= {BACKEND_API_CALL + '/current/steps'} />
                            </div>


                        </div>
                    </div>
                </div>

            </div>
           


        </div>);
    }
}


export default PatientDashboard;