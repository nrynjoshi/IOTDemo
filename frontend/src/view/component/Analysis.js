import React from "react";
import PageTitle from "./PageTitle";
import { BACKEND_API_CALL } from "../util/Constant";
import HttpClient from "../util/HttpClient"
import LineChart from "./LineChart";
import HeatMap from "./HeatMap";
import Hypnogram from "./Hypnogram";
import LineChartWithThresholds from "./LineChartWithThresholds";

class Analysis extends React.Component {

    state = { data: null, httpErrorMessage: null, isLoading: false };

    componentDidMount() {
        const url = BACKEND_API_CALL + '/report/health-record';
        //calling api for data
        const fetchData = async () => {
            try {
                this.setState({ isLoading: true })
                const data = await HttpClient.get(url);
                this.setState({ data: data, httpErrorMessage: null });
            } catch (error) {
                console.error('Error fetching data:', error);
                this.setState({ data: null, httpErrorMessage: JSON.stringify(error.toString()) });
            } finally {
                this.setState({ isLoading: false })
            }
        };

        fetchData();

    }

    render() {
        const { httpErrorMessage, isLoading, data } = this.state
        return (<div>

            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}

            {data && <div>
                <div >

                    <div className="card overflow-y-scroll">
                        <PageTitle title="Hourly Heart Rate Analysis"></PageTitle>
                        <HeatMap data={data.heart_rate} xAxiasLable={'Day of the Month'} yAxiasLable={'Hourly Record'}></HeatMap>

                    </div>


                    <div className="card overflow-y-scroll">
                        <PageTitle title="Sleep Pattern Analysis"></PageTitle>
                        <Hypnogram data={data.sleep_pattern}></Hypnogram>
                    </div>

                    <div className="card overflow-y-scroll">
                        <PageTitle title="Body Temperature Analysis"></PageTitle>
                        <LineChartWithThresholds data={data.body_temperature} thresholds= {{'mild' : 90,'normal' : 95, 'severe' : 99 }} xAxiasLable={'Today Hourly Record'} yAxiasLable={'Body Temperature in Fahrenheit '}></LineChartWithThresholds>

                    </div>

                    <div className="card overflow-y-scroll">
                        <PageTitle title="Blood Sugar Analysis"></PageTitle>
                        <LineChart data={data.blood_sugar} xAxiasLable={'Day of the Month'} yAxiasLable={'Blood Sugar level in mg/dL'}></LineChart>

                    </div>

                    <div className="card overflow-y-scroll">
                        <PageTitle title="SPO2 Analysis"></PageTitle>
                        <LineChartWithThresholds data={data.spo2} thresholds= {{'mild' : 90,'normal' : 95, 'severe' : 85 }}  xAxiasLable={'Today Hourly Record'} yAxiasLable={'Oxygen Saturation Percentage'}></LineChartWithThresholds>

                    </div>

                    <div className="card overflow-y-scroll">
                        <PageTitle title="Respiratory Rate Analysis"></PageTitle>
                        <LineChartWithThresholds data={data.respiratory_rate} thresholds= {{'mild' : 12,'normal' : 16, 'severe' : 20 }} xAxiasLable={'Today Hourly Record'} yAxiasLable={'Respiratory Rate'}></LineChartWithThresholds>
                    </div>

                    <div className="card overflow-y-scroll">
                        <PageTitle title="Steps Analysis"></PageTitle>
                        <LineChart data={data.total_steps} xAxiasLable={'Day of the Month'} yAxiasLable={'Total Steps Count'}></LineChart>

                    </div>


                </div>
            </div>
            }

        </div>);
    }
}


export default Analysis;