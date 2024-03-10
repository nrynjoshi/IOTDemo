import React from "react";
import {BACKEND_API_CALL} from "../util/Constant";
import TodoList from "./TodoList";
import PageTitle from "./PageTitle";

import useSound from "use-sound";
import beepSound from "./../audio/beep-02.mp3";
import SoundUtil from "../util/SoundUtil";
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
                    <div className="row-span-2 bg-white">
                        <div className="shadow-lg" >
                            <h2 className="font-bold">Today Todo List</h2>
                            <TodoList dataEndpoint={BACKEND_API_CALL + '/todo-list'}></TodoList>
                           {/*<SoundUtil triggerValue={97}></SoundUtil>*/}
                        </div>

<hr></hr>

                    </div>
                    <div className="row-span-3">
                        <div className="grid grid-cols-4 gap-4">

                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6 blink">
                                <h2>Heart Rate</h2>
                                <div className="flex items-center">
                                <span className="text-red-500 text-6xl font-bold text-center p-3">98</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="50" height="50"
                                    class="text-red-500">
                                    <path fill-rule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clip-rule="evenodd"></path>
                                </svg>
                                </div>
                                <span className="text-base font-bold text-center p-3">Min:&nbsp;80</span>
                                <span className="text-base font-bold text-center p-3">Max:&nbsp;100</span>
                                

                            </div>

                            <div className="bg-white shadow-2xl shadow-grey-500/50 min-w-6 min-h-6">
                                <h2>SPO2</h2>
                                <div className="flex items-center">
                                <span className="text-red-500 text-6xl font-bold text-center p-3">95%</span>
      
                                </div>
                                <span className="text-base font-bold text-center p-3">Min:&nbsp;95%</span>
                                <span className="text-base font-bold text-center p-3">Max:&nbsp;100%</span>
                            </div>
                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                                <h2>Respiratory Rate</h2>
                                <div className="flex items-center">
                                <span className="text-red-500 text-6xl font-bold text-center p-3">12</span>
                                
                                </div>
                                <span className="text-base font-bold text-center p-3">Min:&nbsp;10</span>
                                <span className="text-base font-bold text-center p-3">Max:&nbsp;15</span>
                                
                            </div>
                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                                <h2>Body Temperature</h2>

                                <div className="flex items-center">
                                <span className="text-red-500 text-6xl font-bold text-center p-3">99.1&#8457;</span>
                                
                                </div>
                                <span className="text-base font-bold text-center p-3">Min:&nbsp;98.1&#8457;</span>
                                <span className="text-base font-bold text-center p-3">Max:&nbsp;99.2&#8457;</span>
                            </div>
                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                                <h2>Blood Pressure</h2>

                                <div className="flex items-center">
                                <span className="text-red-500 text-6xl font-bold text-center p-3">90/60</span>
                                
                                </div>
                                <span className="text-base font-bold text-center p-3">Min:</span>
                                <span className="text-base font-bold text-center p-3">Max:</span>

                            </div>
                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                                <h2>Blood Sugar</h2>
                                <div className="flex items-center">
                                <span className="text-red-500 text-6xl font-bold text-center p-3">95 mg/dl</span>
                                
                                </div>

                            </div>
                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                                <h2>Metal Status</h2>
                                <span className="text-red-500 text-6xl font-bold text-center p-3">Happy</span>
                            </div>
                            
                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                                <h2>Hydration</h2>
                                <span className="text-red-500 text-6xl font-bold text-center p-3">Looks Ok</span>
                            </div>
                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                                <h2>Sleep Pattern</h2>
                                <div className="flex items-center">
                                    <span className="text-red-500 text-6xl font-bold text-center p-3">6 hrs 8min</span>
                                </div>
                                <span className="text-base font-bold text-center p-3">Night Awakening: 0</span>
                            </div>

                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                                <h2>Steps</h2>
                                <div className="flex items-center">
                                <span className="text-red-500 text-6xl font-bold text-center p-3">98</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="50" height="50"
                                    class="text-red-500">
                                    <path fill-rule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clip-rule="evenodd"></path>
                                </svg>
                                </div>
                                <span className="text-base font-bold text-center p-3">Min:</span>
                                <span className="text-base font-bold text-center p-3">Max:</span>
                            </div>


                        </div>
                    </div>
                </div>

            </div>
           


        </div>);
    }
}


export default PatientDashboard;