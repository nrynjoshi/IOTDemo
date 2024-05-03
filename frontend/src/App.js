import './App.css';
import React from "react";
import moment from 'moment';

import HttpClient from "./view/component/HttpClient"

import CurrentDashboardDisplay from "./view/component/Dashboard/CurrentDashboardDisplay";
import EmergencyContact from './view/component/EmergencyContacts/EmergencyContact';
import DiseaseFinderML from "./view/component/DiseaseFinder/DiseaseFinderML";

import LineChart from "./view/component/LineChartDiagram/LineChart";
import HeatMap from "./view/component/HeatMapDiagram/HeatMap";
import Hypnogram from "./view/component/HypnogramDiagram/Hypnogram";
import LineChartWithThresholds from "./view/component/LineChartWithThresholdDiagram/LineChartWithThresholds";
import PageTitle from "./view/component/PageTitle";

import SankeyDiagram from "./view/component/SankeyDiagram/SankeyDiagram";
import ForceDirectedGraph from "./view/component/ForceDirectDiagram/ForceDirectedGraph";


class App extends React.Component {
  state = {
    activeTab: 'dashboard',
    date: new Date(),
    user: null,
    url: '/user',
    greeting: 'Hello ',
    currentHealthRecord: {
      data: null,
      httpErrorMessage: null,
      isLoading: false,
      url: '/current/health-record',
    },
    emergencyContacts: {
      data: null,
      httpErrorMessage: null,
      isLoading: false,
      url: '/emergency-contacts',
    },
    healthRecordInformation: {
      data: null,
      httpErrorMessage: null,
      isLoading: false,
      url: '/report/health-record',
    },
    activityTrack: {
      data: null,
      httpErrorMessage: null,
      isLoading: false,
      url: '/activity-tracks',
    },
    diseaseFinder: {
      data: null,
      httpErrorMessage: null,
      isLoading: false,
      url: '/decision_tree',
    }
  };

  componentDidMount() {
    //fetch user informaiton
    this.fetchUser();

    //fetch current health record for dashboard
    this.fetchCurrentHealthRecordForDashboard(false); // Fetch data initially

    //fetch health record information
    this.fetchHealthRecordInformation()

    //fetch emergency contact list
    this.fetchEmergencyContacts();

    //fetch activity track information
    this.fetchActivityTrackInformation();

    //call all apis to get latest information 
    this.setUpIntervalToCallLatestData();
  }

  //setup all interval
  setUpIntervalToCallLatestData() {
    this.fetchCurrentHealthRecordForDashboardInterval = setInterval(() => this.fetchCurrentHealthRecordForDashboard(true), 60 * 1000);  // every 1 min this code will call the api to get latest information athough we have hourly data  
    this.dateTimeInterval = setInterval(() => this.setState({ date: new Date() }), 1000);  // every 1 mili-second this code will call the api to get latest information athough we have hourly data
    this.fetchAllApisEvery30minsInterval = setInterval(() => this.callAllApisEvery30mins(), 30 * 60 * 1000);  // every 30 min this code will call the api to get latest information athough we have hourly data  

  }

  // call all the methods on every 30 sec
  fetchAllApisEvery30mins() {
    //fetch health record information
    this.fetchHealthRecordInformation()

    //fetch emergency contact list
    this.fetchEmergencyContacts();

    //fetch activity track information
    this.fetchActivityTrackInformation();
  }

  //handle the tab section
  setActiveTab(tabName) {
    this.setState({ activeTab: tabName })
    if (tabName === 'dashboard') {
      this.dateTimeInterval = setInterval(() => this.setState({ date: new Date() }), 1000);  // every 1 min this code will call the api to get latest information athough we have hourly data
      this.fetchCurrentHealthRecordForDashboardInterval = setInterval(() => this.fetchCurrentHealthRecordForDashboard(true), 60 * 1000);  // every 1 min this code will call the api to get latest information athough we have hourly data  
    } else {
      clearInterval(this.dateTimeInterval); // Clear interval on component unmount
      clearInterval(this.fetchCurrentHealthRecordForDashboardInterval);
    }
  }

  //get the current loggin user information 
  fetchUser = async () => {
    try {
      const { url } = this.state
      const user = await HttpClient.get(url);
      this.setState({ user: user });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  //get the current health information for dashboard tab
  fetchCurrentHealthRecordForDashboard = async (isIntervalCall) => {
    const { currentHealthRecord } = this.state
    try {
      if (!isIntervalCall) {
        currentHealthRecord.isLoading = false
        this.setState(currentHealthRecord)
      }
      const data = await HttpClient.get(currentHealthRecord.url);

      currentHealthRecord.data = data
      currentHealthRecord.httpErrorMessage = null
      this.setState(currentHealthRecord)
    } catch (error) {
      console.error('Error fetching data:', error);
      currentHealthRecord.data = null
      currentHealthRecord.httpErrorMessage = JSON.stringify(error.toString())
      this.setState(currentHealthRecord)
    } finally {
      currentHealthRecord.isLoading = false
      this.setState(currentHealthRecord)
    }

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

  //get the emergency contact list
  fetchEmergencyContacts = async () => {
    const { emergencyContacts } = this.state
    try {
      emergencyContacts.isLoading = true
      this.setState({ emergencyContacts: emergencyContacts })
      const data = await HttpClient.get(emergencyContacts.url);

      emergencyContacts.data = data
      emergencyContacts.httpErrorMessage = null
      this.setState({ emergencyContacts: emergencyContacts });
    } catch (error) {
      console.error('Error fetching data:', error);
      emergencyContacts.data = null
      emergencyContacts.httpErrorMessage = JSON.stringify(error.toString())
      this.setState({ emergencyContacts: emergencyContacts });
    } finally {
      emergencyContacts.isLoading = false
      this.setState({ emergencyContacts: emergencyContacts })
    }
  }

  //get all health record informaiton for analysis tab
  fetchHealthRecordInformation = async () => {
    const { healthRecordInformation } = this.state
    try {
      healthRecordInformation.isLoading = true
      this.setState({ healthRecordInformation: healthRecordInformation })
      const data = await HttpClient.get(healthRecordInformation.url);

      healthRecordInformation.data = data
      healthRecordInformation.httpErrorMessage = null
      this.setState({ healthRecordInformation: healthRecordInformation });
    } catch (error) {
      console.error('Error fetching data:', error);
      healthRecordInformation.data = null
      healthRecordInformation.httpErrorMessage = JSON.stringify(error.toString())
      this.setState({ healthRecordInformation: healthRecordInformation });
    } finally {
      healthRecordInformation.isLoading = false
      this.setState({ healthRecordInformation: healthRecordInformation })
    }
  }

  //get all activities informaiton for activity tab tab
  fetchActivityTrackInformation = async () => {
    const { activityTrack } = this.state
    try {
      activityTrack.isLoading = true
      this.setState({ activityTrack: activityTrack })
      const data = await HttpClient.get(activityTrack.url);

      activityTrack.data = data
      activityTrack.httpErrorMessage = null
      this.setState({ activityTrack: activityTrack });
    } catch (error) {
      console.error('Error fetching data:', error);
      activityTrack.data = null
      activityTrack.httpErrorMessage = JSON.stringify(error.toString())
      this.setState({ activityTrack: activityTrack });
    } finally {
      activityTrack.isLoading = false
      this.setState({ activityTrack: activityTrack })
    }
  }

  //get the diease based on the basis of form submitted
  diseaseFinderFormSubmitHandler = (requestBody) => {
    const { diseaseFinder } = this.state

    //calling api for data
    const postRecord = async () => {
      try {
        diseaseFinder.isLoading = true
        diseaseFinder.data = null;
        this.setState({ diseaseFinder: diseaseFinder })
        const responseBody = await HttpClient.post(diseaseFinder.url, requestBody);
        diseaseFinder.data = responseBody;
        diseaseFinder.httpErrorMessage = null;
        this.setState({ diseaseFinder: diseaseFinder });
      } catch (error) {
        console.error('Error fetching data:', error);
        diseaseFinder.data = null
        diseaseFinder.httpErrorMessage = JSON.stringify(error.toString())
        this.setState({ diseaseFinder: diseaseFinder });
      } finally {
        diseaseFinder.isLoading = false
        this.setState({ diseaseFinder: diseaseFinder })
      }
    };
    postRecord()
  };

  //get the heart rate information  based on the given range from selection
  heartRateFormSubmitHandler = (requestBody) => {
    const { healthRecordInformation } = this.state

    const url = '/report/heart-rate';
    //calling api for data
    const postRecord = async () => {
      try {
        healthRecordInformation.data.heart_rate = null
        healthRecordInformation.data.isLoading = true
        this.setState({ healthRecordInformation: healthRecordInformation });

        const responseBody = await HttpClient.post(url, requestBody);

        healthRecordInformation.data.heart_rate = responseBody
        healthRecordInformation.httpErrorMessage = null;
        this.setState({ healthRecordInformation: healthRecordInformation });

      } catch (error) {
        console.error('Error fetching data:', error);
        healthRecordInformation.data = null
        healthRecordInformation.httpErrorMessage = JSON.stringify(error.toString())
        this.setState({ healthRecordInformation: healthRecordInformation });
      } finally {
        healthRecordInformation.isLoading = false
        this.setState({ healthRecordInformation: healthRecordInformation })
      }
    };
    postRecord()
  }

  //get the sleep pattern information  based on the given range from selection
  sleepPatternFormSubmitHandler = (requestBody) => {
    const { healthRecordInformation } = this.state

    const url = '/report/sleep-pattern';
    //calling api for data
    const postRecord = async () => {
      try {
        healthRecordInformation.data.sleep_pattern = null
        healthRecordInformation.data.isLoading = true
        this.setState({ healthRecordInformation: healthRecordInformation });

        const responseBody = await HttpClient.post(url, requestBody);

        healthRecordInformation.data.sleep_pattern = responseBody
        healthRecordInformation.httpErrorMessage = null;
        this.setState({ healthRecordInformation: healthRecordInformation });

      } catch (error) {
        console.error('Error fetching data:', error);
        healthRecordInformation.data.sleep_pattern = null
        healthRecordInformation.httpErrorMessage = JSON.stringify(error.toString())
        this.setState({ healthRecordInformation: healthRecordInformation });
      } finally {
        healthRecordInformation.isLoading = false
        this.setState({ healthRecordInformation: healthRecordInformation })
      }
    };
    postRecord()
  }

  //get the oxygen level information  based on the given range from selection
  sp02FormSubmitHandler = (requestBody) => {
    const { healthRecordInformation } = this.state

    const url = '/report/spo2';
    //calling api for data
    const postRecord = async () => {
      try {
        healthRecordInformation.data.spo2 = null
        healthRecordInformation.data.isLoading = true
        this.setState({ healthRecordInformation: healthRecordInformation });

        const responseBody = await HttpClient.post(url, requestBody);

        healthRecordInformation.data.spo2 = responseBody
        healthRecordInformation.httpErrorMessage = null;
        this.setState({ healthRecordInformation: healthRecordInformation });

      } catch (error) {
        console.error('Error fetching data:', error);
        healthRecordInformation.data.spo2 = null
        healthRecordInformation.httpErrorMessage = JSON.stringify(error.toString())
        this.setState({ healthRecordInformation: healthRecordInformation });
      } finally {
        healthRecordInformation.isLoading = false
        this.setState({ healthRecordInformation: healthRecordInformation })
      }
    };
    postRecord()
  }

  //get the respiratory rate information  based on the given range from selection
  respiratoryRateFormSubmitHandler = (requestBody) => {
    const { healthRecordInformation } = this.state

    const url = '/report/respiratory-rate';
    //calling api for data
    const postRecord = async () => {
      try {
        healthRecordInformation.data.respiratory_rate = null
        healthRecordInformation.data.isLoading = true
        this.setState({ healthRecordInformation: healthRecordInformation });

        const responseBody = await HttpClient.post(url, requestBody);

        healthRecordInformation.data.respiratory_rate = responseBody
        healthRecordInformation.httpErrorMessage = null;
        this.setState({ healthRecordInformation: healthRecordInformation });

      } catch (error) {
        console.error('Error fetching data:', error);
        healthRecordInformation.data.respiratory_rate = null
        healthRecordInformation.httpErrorMessage = JSON.stringify(error.toString())
        this.setState({ healthRecordInformation: healthRecordInformation });
      } finally {
        healthRecordInformation.isLoading = false
        this.setState({ healthRecordInformation: healthRecordInformation })
      }
    };
    postRecord()
  }

  //get the steps count information  based on the given range from selection
  stepsCountsFormSubmitHandler = (requestBody) => {
    const { healthRecordInformation } = this.state

    const url = '/report/total-steps';
    //calling api for data
    const postRecord = async () => {
      try {
        healthRecordInformation.data.total_steps = null
        healthRecordInformation.data.isLoading = true
        this.setState({ healthRecordInformation: healthRecordInformation });

        const responseBody = await HttpClient.post(url, requestBody);

        healthRecordInformation.data.total_steps = responseBody
        healthRecordInformation.httpErrorMessage = null;
        this.setState({ healthRecordInformation: healthRecordInformation });

      } catch (error) {
        console.error('Error fetching data:', error);
        healthRecordInformation.data.total_steps = null
        healthRecordInformation.httpErrorMessage = JSON.stringify(error.toString())
        this.setState({ healthRecordInformation: healthRecordInformation });
      } finally {
        healthRecordInformation.isLoading = false
        this.setState({ healthRecordInformation: healthRecordInformation })
      }
    };
    postRecord()
  }

  //get the blood sugar level information  based on the given range from selection
  bloodSugarFormSubmitHandler = (requestBody) => {
    const { healthRecordInformation } = this.state

    const url = '/report/blood-sugar';
    //calling api for data
    const postRecord = async () => {
      try {
        healthRecordInformation.data.blood_sugar = null
        healthRecordInformation.data.isLoading = true
        this.setState({ healthRecordInformation: healthRecordInformation });

        const responseBody = await HttpClient.post(url, requestBody);

        healthRecordInformation.data.blood_sugar = responseBody
        healthRecordInformation.httpErrorMessage = null;
        this.setState({ healthRecordInformation: healthRecordInformation });

      } catch (error) {
        console.error('Error fetching data:', error);
        healthRecordInformation.data.blood_sugar = null
        healthRecordInformation.httpErrorMessage = JSON.stringify(error.toString())
        this.setState({ healthRecordInformation: healthRecordInformation });
      } finally {
        healthRecordInformation.isLoading = false
        this.setState({ healthRecordInformation: healthRecordInformation })
      }
    };
    postRecord()
  }


  //get the body temperature information  based on the given range from selection
  bloodTemperatureFormSubmitHandler = (requestBody) => {
    const { healthRecordInformation } = this.state

    const url = '/report/body-temperate';
    //calling api for data
    const postRecord = async () => {
      try {
        healthRecordInformation.data.body_temperature = null
        healthRecordInformation.data.isLoading = true
        this.setState({ healthRecordInformation: healthRecordInformation });

        const responseBody = await HttpClient.post(url, requestBody);

        healthRecordInformation.data.body_temperature = responseBody
        healthRecordInformation.httpErrorMessage = null;
        this.setState({ healthRecordInformation: healthRecordInformation });

      } catch (error) {
        console.error('Error fetching data:', error);
        healthRecordInformation.data.body_temperature = null
        healthRecordInformation.httpErrorMessage = JSON.stringify(error.toString())
        this.setState({ healthRecordInformation: healthRecordInformation });
      } finally {
        healthRecordInformation.isLoading = false
        this.setState({ healthRecordInformation: healthRecordInformation })
      }
    };
    postRecord()
  }

  //removed all the interval before unmount
  componentWillUnmount() {
    clearInterval(this.dateTimeInterval); // Clear interval on component unmount
    clearInterval(this.fetchCurrentHealthRecordForDashboardInterval);
    clearInterval(this.fetchAllApisEvery30minsInterval);
  }



  render() {

    const { currentHealthRecord, user, greeting, activeTab, emergencyContacts, healthRecordInformation, activityTrack, diseaseFinder } = this.state
    return (
      <div className="w-full text-2xl App">

        {/* header section start here  */}
        <div className="header">
          <ul>
            <li>
              <button
                key='dashboard'
                className={`px-4 py-2 ${activeTab === 'dashboard'
                  ? 'bg-black font-bold text-white'
                  : 'text-white'
                  }`}
                onClick={() => this.setActiveTab('dashboard')}
              >
                Dashboard
              </button>


            </li>
            <li>
              <button
                key='activitiesTrack'
                className={`px-4 py-2 ${activeTab === 'activitiesTrack'
                  ? 'bg-black font-bold text-white'
                  : 'text-white'
                  }`}
                onClick={() => this.setActiveTab('activitiesTrack')}
              >
                Activities Track
              </button>
            </li>
            <li>
              <button
                key='analysis'
                className={`px-4 py-2 ${activeTab === 'analysis'
                  ? 'bg-black font-bold text-white'
                  : 'text-white'
                  }`}
                onClick={() => this.setActiveTab('analysis')}
              >
                Analysis
              </button>


            </li>

            <li>
              <button
                key='emergencyContacts'
                className={`px-4 py-2 ${activeTab === 'emergencyContacts'
                  ? 'bg-black font-bold text-white'
                  : 'text-white'
                  }`}
                onClick={() => this.setActiveTab('emergencyContacts')}
              >
                Emergency Contacts
              </button>


            </li>

            <li>
              <button
                key='diseaseFinder'
                className={`px-4 py-2 ${activeTab === 'diseaseFinder'
                  ? 'bg-black font-bold text-white'
                  : 'text-white'
                  }`}
                onClick={() => this.setActiveTab('diseaseFinder')}
              >
                Disease Finder
              </button>


            </li>

          </ul>
        </div>
        {/* header section end here  */}
        <div >
          <div className="m-4">
            {/* dashboard tab section start here */}
            {activeTab === 'dashboard' &&
              <div>
                {currentHealthRecord.isLoading ? (<p>Loading ...</p>) : (currentHealthRecord.httpErrorMessage ?
                  <h2 style={{ backgroundColor: 'red' }}>{currentHealthRecord.httpErrorMessage}</h2> : <span></span>)}
                <>
                  <div className="grid grid-rows-3 grid-flow-col gap-4 ">
                    {currentHealthRecord.data &&
                      <div className="row-span-3">
                        <div className="card">
                          {user && <div >
                            <b> {greeting} {user.Name} </b>
                          </div>}
                          <span className='datatime'> Current Time: {moment().format('dddd MMMM Do YYYY, h:mm a')}</span>
                          <hr />
                          <div className="text-zinc-700 ">Information has been record on hourly basis and displayed hourly here. Last Updated information: <b>{currentHealthRecord.data.ActivityHour}</b></div>

                        </div>
                        <div className="grid xl:grid-cols-4 xl:gap-4 lg:grid-cols-3 lg:gap-3 md:grid-cols-2 md:gap-2 sm:grid-cols-1 sm:gap-1">
                          <div className="card">
                            <CurrentDashboardDisplay displayText={'Heart Rate'} displayValue={currentHealthRecord.data.HeartRate} minNormalValue={60} maxNormalValue={100} customSegmentStops={[0, 60, 100, 160]} />
                          </div>
                          <div className="card">
                            <CurrentDashboardDisplay displayText={'Body Temperature'} displayValue={currentHealthRecord.data.BodyTemperate} minNormalValue={97.8} maxNormalValue={99.1} customSegmentStops={[90, 97.8, 99.1, 107]} />
                          </div>
                          <div className="card">
                            <CurrentDashboardDisplay displayText={'Blood Sugar Fasting'} displayValue={currentHealthRecord.data.BloodSugarFasting} minNormalValue={70} maxNormalValue={100} customSegmentStops={[0, 70, 100, 150]} />
                          </div>
                          <div className="card">
                            <CurrentDashboardDisplay displayText={'Respiratory Rate'} displayValue={currentHealthRecord.data.RespiratoryRate} minNormalValue={12} maxNormalValue={20} customSegmentStops={[0, 12, 20, 30]} />
                          </div>
                          <div className="card">
                            <CurrentDashboardDisplay displayText={'Blood Oxygen Saturation'} displayValue={currentHealthRecord.data.BloodOxygenSaturation} minNormalValue={95} maxNormalValue={100} customSegmentStops={[80, 95, 100]} customSegmentLabels={[
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
                            <CurrentDashboardDisplay displayText={'Blood Pressure in mmHg'} displayValue={currentHealthRecord.data.BloodPressure_mmHg} />
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </>
              </div>

            }
            {/* dashboard tab section end here */}

            {/* activities track tab section start here */}
            {activeTab === 'activitiesTrack' && <div>
              {activityTrack.isLoading ? (<p>Loading ...</p>) : (activityTrack.httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{activityTrack.httpErrorMessage}</h2> : <span></span>)}
              <div className="card">
                <PageTitle title="Daily Disease Evaluation Based on Symptoms"></PageTitle>
                <SankeyDiagram data={activityTrack}></SankeyDiagram>
              </div>
              <div className="card">
                <PageTitle title="Daily Disease Evaluation Based on Symptoms"></PageTitle>
                <ForceDirectedGraph data={activityTrack}></ForceDirectedGraph>
              </div>
            </div>}
            {/* activities track tab section end here */}

            {/* analysis tab section start here */}
            {activeTab === 'analysis' && <div>
              {healthRecordInformation.isLoading ? (<p>Loading ...</p>) : (healthRecordInformation.httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{healthRecordInformation.httpErrorMessage}</h2> : <span></span>)}
              {healthRecordInformation.data && <div>
                <div >
                  <div className="card overflow-y-scroll">
                    <PageTitle title="Hourly Heart Rate Analysis"></PageTitle>
                    <HeatMap onFormSubmit={this.heartRateFormSubmitHandler} data={healthRecordInformation.data.heart_rate} xAxiasLable={'Day of the Month'} yAxiasLable={'Hourly Record'}></HeatMap>
                  </div>
                  <div className="card overflow-y-scroll">
                    <PageTitle title="Sleep Pattern Analysis"></PageTitle>
                    <Hypnogram onFormSubmit={this.sleepPatternFormSubmitHandler} data={healthRecordInformation.data.sleep_pattern}></Hypnogram>
                  </div>
                  <div className="card overflow-y-scroll">
                    <PageTitle title="Body Temperature Analysis"></PageTitle>
                    <LineChartWithThresholds onFormSubmit={this.bloodTemperatureFormSubmitHandler} data={healthRecordInformation.data.body_temperature} thresholds={{ 'mild': 90, 'normal': 95, 'severe': 99 }} xAxiasLable={'Today/Selected Date Hourly Record'} yAxiasLable={'Body Temperature in Fahrenheit '}></LineChartWithThresholds>
                  </div>
                  <div className="card overflow-y-scroll">
                    <PageTitle title="Blood Sugar Analysis"></PageTitle>
                    <LineChart onFormSubmit={this.bloodSugarFormSubmitHandler} data={healthRecordInformation.data.blood_sugar} xAxiasLable={'Day of the Month'} yAxiasLable={'Blood Sugar level in mg/dL'}></LineChart>
                  </div>
                  <div className="card overflow-y-scroll">
                    <PageTitle title="SPO2 Analysis"></PageTitle>
                    <LineChartWithThresholds onFormSubmit={this.sp02FormSubmitHandler} data={healthRecordInformation.data.spo2} thresholds={{ 'mild': 90, 'normal': 95, 'severe': 85 }} xAxiasLable={'Today/Selected Date Hourly Record'} yAxiasLable={'Oxygen Saturation Percentage'}></LineChartWithThresholds>
                  </div>
                  <div className="card overflow-y-scroll">
                    <PageTitle title="Respiratory Rate Analysis"></PageTitle>
                    <LineChartWithThresholds onFormSubmit={this.respiratoryRateFormSubmitHandler} data={healthRecordInformation.data.respiratory_rate} thresholds={{ 'mild': 12, 'normal': 16, 'severe': 20 }} xAxiasLable={'Today/Selected Date Hourly Record'} yAxiasLable={'Respiratory Rate'}></LineChartWithThresholds>
                  </div>
                  <div className="card overflow-y-scroll">
                    <PageTitle title="Steps Analysis"></PageTitle>
                    <LineChart onFormSubmit={this.stepsCountsFormSubmitHandler} data={healthRecordInformation.data.total_steps} xAxiasLable={'Day of the Month'} yAxiasLable={'Total Steps Count'}></LineChart>
                  </div>
                </div>
              </div>
              }
            </div>}
            {/* analysis tab section end here */}

            {/* emergency contacts tab section start here */}
            {activeTab === 'emergencyContacts' && <EmergencyContact data={emergencyContacts}></EmergencyContact>}
            {/* emergency contacts tab section end here */}

            {/* disease tab section start here */}
            {activeTab === 'diseaseFinder' && <DiseaseFinderML data={diseaseFinder} onFormSubmit={this.diseaseFinderFormSubmitHandler}></DiseaseFinderML>}
            {/* disease tab section end here */}
          </div>
        </div>

      </div>


    );
  }
}

export default App;
