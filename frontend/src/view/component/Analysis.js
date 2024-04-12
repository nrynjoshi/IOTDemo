import React from "react";
import PageTitle from "./PageTitle";
import { BACKEND_API_CALL } from "../util/Constant";
import HttpClient from "../util/HttpClient"
import LineChart from "./LineChart";
import HeatMap from "./HeatMap";
import HypnogramD3 from "../react-d3/HypnogramD3";
import Hypnogram from "./Hypnogram";
import LineChartWithThresholds from "./LineChartWithThresholds";

class Analysis extends React.Component {

    state = {data: null, httpErrorMessage: null, isLoading: false};

    componentDidMount() {
        const url = BACKEND_API_CALL + '/report/health-record';
        //calling api for data
        const fetchData = async () => {
            try {
                this.setState({isLoading: true})
               const data =  await HttpClient.get(url);
               this.setState({data:data, httpErrorMessage:null});
            } catch (error) {
              console.error('Error fetching data:', error);
              this.setState({data:null, httpErrorMessage: JSON.stringify(error.toString()) });
            } finally {
                this.setState({isLoading: false})
            }
          };
      
          fetchData();
        
    }

    handleColorEncodingChange = (e) => {
        console.log('handleColorEncodingChange called');
        this.setState({colorEncoding: e.target.value});
    }


    render() {
        const {httpErrorMessage, colorEncoding,isLoading, data} = this.state
        return (<div>

            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2> : <span></span>)}

                    {data && <div>
                        <div >

                            <div className="card">
                            <PageTitle title="Hourly Heart Rate Analysis"></PageTitle>
                            <HeatMap data={data.heart_rate}></HeatMap>

                            </div>
                            

                            <div className="card">
                            <PageTitle title="Sleep Pattern Analysis"></PageTitle>
                            <Hypnogram data={data.sleep_pattern}></Hypnogram>
                            </div>

                           <div className="card">
                            <PageTitle title="Body Temperature Analysis"></PageTitle>
                            <LineChartWithThresholds data={data.body_temperature} ></LineChartWithThresholds>
                          
                            </div>

                           <div className="card">
                            <PageTitle title="Blood Sugar Analysis"></PageTitle>
                            <LineChart data={data.blood_sugar} xAxiasLable={'This Month'} yAxiasLable={'Blood Sugar in mg/dL'}></LineChart>

                            </div> 

                            <div className="card">
                            <PageTitle title="SPO2 Analysis"></PageTitle>
                            <LineChartWithThresholds data={data.spo2} mild={90} normal={98} severe={100} ></LineChartWithThresholds>
                            
                            </div>
 
                            <div className="card">
                            <PageTitle title="Respiratory Rate Analysis"></PageTitle>
                            <LineChartWithThresholds data={data.respiratory_rate} mild={12} normal={16} severe={20} ></LineChartWithThresholds>
                            </div>

                            <div className="card">
                            <PageTitle title="Steps Analysis"></PageTitle>
                            <LineChart data={data.total_steps}  xAxiasLable={'This Month'} yAxiasLable={'Total Steps Cound'}></LineChart>

                            </div>  


                        </div>
                    </div>
                    }

        </div>);
    }
}


export default Analysis;