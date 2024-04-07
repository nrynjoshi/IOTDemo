import React from "react";
import PageTitle from "./PageTitle";
import { BACKEND_API_CALL } from "../util/Constant";
import LineChart from "./LineChart";
import HeatMap from "./HeatMap";
import HypnogramD3 from "../react-d3/HypnogramD3";
import Hypnogram from "./Hypnogram";
import LineChartWithThresholds from "./LineChartWithThresholds";

class Analysis extends React.Component {

    state = {dataCar: null, dataKeys:null, colorEncoding: "weight (lb)", httpErrorMessage: null, isLoading: false};

    handleColorEncodingChange = (e) => {
        console.log('handleColorEncodingChange called');
        this.setState({colorEncoding: e.target.value});
    }


    render() {
        const {httpErrorMessage, colorEncoding,isLoading, dataCar} = this.state
        return (<div>

            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2> : <span></span>)}

<div>
                        <div >

                            {/* <div className="card">
                            <PageTitle title="Hourly Heart Rate Analysis"></PageTitle>
                            <HeatMap dataEndpoint={BACKEND_API_CALL + '/report/heart-rate-analysis'}></HeatMap>

                            </div>

                            <div className="card">
                            <PageTitle title="Room Temperature"></PageTitle>
                            <HeatMap dataEndpoint={BACKEND_API_CALL + '/report/room-temperature-analysis'}></HeatMap>

                            </div> */}

                            

                            <div className="card">
                            <PageTitle title="Sleep Pattern Analysis"></PageTitle>
                            <Hypnogram dataEndpoint={BACKEND_API_CALL + '/report/sleep-pattern-analysis'}></Hypnogram>
                            </div>

                            <div className="card">
                            <PageTitle title="Body Temperature Analysis"></PageTitle>
                            <LineChartWithThresholds dataEndpoint={BACKEND_API_CALL + '/report/body-temperature-analysis'} mild={96} normal={97} severe={99} ></LineChartWithThresholds>
                          
                            </div>

                            <div className="card">
                            <PageTitle title="Blood Sugar Analysis"></PageTitle>
                            <LineChart dataEndpoint={BACKEND_API_CALL + '/report/blood-sugar-analysis'} xAxiasLable={'This Month'} yAxiasLable={'Blood Sugar in mg/dL'}></LineChart>

                            </div>

                            <div className="card">
                            <PageTitle title="SPO2 Analysis"></PageTitle>
                            <LineChartWithThresholds dataEndpoint={BACKEND_API_CALL + '/report/spo2-analysis'} mild={90} normal={98} severe={100} ></LineChartWithThresholds>
                            
                            </div>

                            <div className="card">
                            <PageTitle title="Respiratory Rate Analysis"></PageTitle>
                            <LineChartWithThresholds dataEndpoint={BACKEND_API_CALL + '/report/respiratory-rate-analysis'} mild={12} normal={16} severe={20} ></LineChartWithThresholds>
                            </div>

                            <div className="card">
                            <PageTitle title="Steps Analysis"></PageTitle>
                            <LineChart dataEndpoint={BACKEND_API_CALL + '/report/total-steps-analysis'}  xAxiasLable={'This Month'} yAxiasLable={'Total Steps Cound'}></LineChart>

                            </div>

                            

                        </div>
                    </div>

        </div>);
    }
}


export default Analysis;