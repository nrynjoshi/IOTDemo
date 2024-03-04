import React from "react";
import HttpClient from "../util/HttpClient"
import GaugeChart from 'react-gauge-chart'
import {BACKEND_API_CALL} from "../util/Constant";
import SankeyDiagram from "./SankeyDiagram";
import TodoList from "./TodoList";
import PageTitle from "./PageTitle";

class PatientDashboard extends React.Component {

    state = {dataCar: null, dataKeys:null, colorEncoding: "weight (lb)", httpErrorMessage: null, isLoading: false};

    componentDidMount() {


    }

    componentDidUpdate() {



    }

    handleColorEncodingChange = (e) => {
        console.log('handleColorEncodingChange called');
        this.setState({colorEncoding: e.target.value});
    }


    render() {
        const {httpErrorMessage, colorEncoding,isLoading, dataCar} = this.state
        return (<div>

            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2> : <span></span>)}
<PageTitle title="Dashboard"></PageTitle>

            <div className="">
                <div className="grid grid-rows-3 grid-flow-col gap-4">
                    <div className="row-span-2">
                        <div className="bg-amber-500 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                            <h2>Today Todo List</h2>
                            <TodoList dataEndpoint={BACKEND_API_CALL + '/todo-list'}></TodoList>
                        </div>

                    </div>
                    <div className="row-span-3">
                        <div className="grid grid-cols-6 gap-6 mt-3">

                            <div className="shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Heart Rate</h2>
                                <GaugeChart id="gauge-chart5"
                                            nrOfLevels={420}
                                            arcsLength={[0.2, 0.6, 0.2]}
                                            colors={['#F5CD19','#5BE12C', '#EA4228']}
                                            percent={1.20}
                                            textColor = {'#5BE12C'}
                                            formatTextValue={value => value}
                                            arcPadding={0.02}
                                />

                            </div>

                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Blood Oxygen Saturation (SPO2)</h2>

                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Respiratory Rate</h2>
                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Body Temperature</h2>
                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Blood Pressure</h2>
                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Blood Sugar</h2>
                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Metal Status</h2>
                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Dietary Habits</h2>
                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Hydration</h2>
                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Sleep Pattern</h2>
                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Medication Adherence</h2>
                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Emergency Contact </h2>
                            </div>
                            <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                                <h2>Urine Status</h2>
                                volume and color
                            </div>


                        </div>
                    </div>
                </div>

            </div>
            <div className="ml-2">
                <div className="bg-red-100 shadow-lg shadow-cyan-500/50 min-w-6 min-h-6">
                    <h2>Urine Status</h2>
                    <SankeyDiagram dataEndpoint={BACKEND_API_CALL + '/energy'}></SankeyDiagram>
                </div>
            </div>


        </div>);
    }
}


export default PatientDashboard;