import React from "react";
import { BACKEND_API_CALL } from "../util/Constant";
import PageTitle from "./PageTitle";
import HttpClient from "../util/HttpClient"

import useSound from "use-sound";
import beepSound from "./../audio/beep-02.mp3";
import CurrentDashboardDisplay from "../util/CurrentDashboardDisplay";

class PatientDashboard extends React.Component {

    state = { dataKeys: null, httpErrorMessage: null, isLoading: false };

    state = { data: null, httpErrorMessage: null, isLoading: false, url: null, fetchingData: false };

    componentDidMount() {
        const url = BACKEND_API_CALL + '/current/health-record';
        const invervalPeriod = this.props.invervalPeriod;
        this.setState({ url: url })

        console.log('printing from componentDidMount', url)



        this.fetchData(false, url); // Fetch data initially
        this.interval = setInterval(() => this.fetchData(true, url), 60 * 1000);  // every 1 min this code will call the api to get latest information athough we have hourly data
    }

    componentWillUnmount() {
        clearInterval(this.interval); // Clear interval on component unmount
    }

    fetchData = async (isIntervalCall, url) => {
        const { fetchingData } = this.state
        console.log('printing from fetchData', url)
        if (!fetchingData) {
            try {
                if (!isIntervalCall) {
                    this.setState({ isLoading: true })
                }

                const data = await HttpClient.get(url);
                console.log('Data from API call')
                console.log(data)
                this.setState({ data: data, httpErrorMessage: null });
            } catch (error) {
                console.error('Error fetching data:', error);
                this.setState({ data: null, httpErrorMessage: JSON.stringify(error.toString()) });
            } finally {
                this.setState({ isLoading: false })
            }
        }

    };

    render() {
        const { httpErrorMessage, isLoading, data } = this.state
        console.log('Data from state')
        console.log(data)
        return (<div>

            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}

            <>
                <div className="grid grid-rows-3 grid-flow-col gap-4">

                    {data &&
                        <div className="row-span-3">
                            <div>
                                <div>Information has been record on hourly basis and displayed hourly here. Last Updated information: <b>{data.ActivityHour}</b></div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">

                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Heart Rate'} displayValue={data.HeartRate} minNormalValue={60} maxNormalValue={100} customSegmentStops={[0, 60, 100, 160]}  />
                                </div>

                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Body Temperature'} displayValue={data.BodyTemperate} minNormalValue={97.8} maxNormalValue={99.1}  customSegmentStops={[90, 97.8, 99.1, 107]}/>
                                </div>
                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Blood Sugar Fasting'} displayValue={data.BloodSugarFasting} minNormalValue={70} maxNormalValue={100}  customSegmentStops={[0, 70, 100, 150]} />

                                </div>

                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Respiratory Rate'} displayValue={data.RespiratoryRate} minNormalValue={12} maxNormalValue={20}  customSegmentStops={[0, 12, 20, 30]} />

                                </div>
                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Blood Oxygen Saturation'} displayValue={data.BloodOxygenSaturation} minNormalValue={95} maxNormalValue={100}  customSegmentStops={[80, 95, 100]} customSegmentLabels={[
                                        {
                                            text: 'Low',
                                            position: 'INSIDE',
                                            color: '#555',
                                            fontSize: '18px',
                                        },
                                        {
                                            text: 'Normal',
                                            position: 'INSIDE',
                                            color: '#551',
                                            fontSize: '18px',
                                        }
                                        ]}/>

                                </div>

                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Blood Pressure in mmHg'} displayValue={data.BloodPressure_mmHg} />
                                </div>

                            </div>
                        </div>
                    }
                </div>

            </>



        </div>);
    }
}


export default React.memo(PatientDashboard);