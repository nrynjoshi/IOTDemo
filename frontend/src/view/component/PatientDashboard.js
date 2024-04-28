import React from "react";
import HttpClient from "./HttpClient"

import CurrentDashboardDisplay from "./CurrentDashboardDisplay";

class PatientDashboard extends React.Component {
    state = { data: null, httpErrorMessage: null, isLoading: false, url: null, fetchingData: false, user: null, greeting: 'Hello ' };

    componentDidMount() {
        const url = '/current/health-record';
        this.setState({ url: url })
        console.log('printing from componentDidMount', url)
        this.fetchUser()
        this.fetchData(false, url); // Fetch data initially
        this.interval = setInterval(() => this.fetchData(true, url), 60 * 1000);  // every 1 min this code will call the api to get latest information athough we have hourly data
    }

    componentWillUnmount() {
        clearInterval(this.interval); // Clear interval on component unmount
    }

    getGreeting = () => {
        const hour = new Date().getHours();
        let greeting;
        if (hour < 12) {
            greeting = 'Good morning, ';
        } else if (hour < 18) {
            greeting = 'Good afternoon, ';
        } else {
            greeting = 'Good evening, ';
        }
        this.setState({ greeting: greeting })
    };

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
        this.getGreeting();
    };

    fetchUser = async () => {
        try {
            const url = '/user'
            const user = await HttpClient.get(url);
            this.setState({ user: user });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
        }
    };

    render() {
        const { httpErrorMessage, isLoading, data, user, greeting } = this.state
        console.log('Data from state')
        console.log(data)
        return (<div>
            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}
            <>
                <div className="grid grid-rows-3 grid-flow-col gap-4 ">
                    {data &&
                        <div className="row-span-3">
                            <div className="card">
                                {user && <div >
                                    <b> {greeting} {user.Name} </b>
                                </div>}
                                <hr />
                                <div className="text-zinc-700 ">Information has been record on hourly basis and displayed hourly here. Last Updated information: <b>{data.ActivityHour}</b></div>
                            </div>
                            <div className="grid xl:grid-cols-4 xl:gap-4 lg:grid-cols-3 lg:gap-3 md:grid-cols-2 md:gap-2 sm:grid-cols-1 sm:gap-1">
                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Heart Rate'} displayValue={data.HeartRate} minNormalValue={60} maxNormalValue={100} customSegmentStops={[0, 60, 100, 160]} />
                                </div>
                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Body Temperature'} displayValue={data.BodyTemperate} minNormalValue={97.8} maxNormalValue={99.1} customSegmentStops={[90, 97.8, 99.1, 107]} />
                                </div>
                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Blood Sugar Fasting'} displayValue={data.BloodSugarFasting} minNormalValue={70} maxNormalValue={100} customSegmentStops={[0, 70, 100, 150]} />
                                </div>
                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Respiratory Rate'} displayValue={data.RespiratoryRate} minNormalValue={12} maxNormalValue={20} customSegmentStops={[0, 12, 20, 30]} />
                                </div>
                                <div className="card">
                                    <CurrentDashboardDisplay displayText={'Blood Oxygen Saturation'} displayValue={data.BloodOxygenSaturation} minNormalValue={95} maxNormalValue={100} customSegmentStops={[80, 95, 100]} customSegmentLabels={[
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
                                    ]} />
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