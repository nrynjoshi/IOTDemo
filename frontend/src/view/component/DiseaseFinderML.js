import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"
import QRCode from 'react-qr-code';
import { BACKEND_API_CALL } from "../util/Constant.js";

class EmergencyContact extends React.Component {

    state = {
        requestBody: {
            'has_fever':'yes',
            'has_cough':'yes',
            'has_fatigue':'yes',
            'has_difficulty_breathing':'yes',
            'age':28,
            'is_male':'yes',
            'blood_pressure_level':'normal',
            'cholesterol_level': 'normal',
        },
        responseBody:null,
        httpErrorMessage:null, 
        isLoading: false};


    formSubmitHandler = e=> {
        e.preventDefault()
        const {requestBody} = this.state
        console.log('Form Submit Record')
        console.log(requestBody)

        const url = BACKEND_API_CALL + '/decision_tree';
        //calling api for data
        const postRecord = async () => {
            try {
                this.setState({isLoading: true})
              const responseBody =  await HttpClient.post(url, requestBody);
              this.setState({responseBody:responseBody, httpErrorMessage:null});
            } catch (error) {
              console.error('Error fetching data:', error);
              this.setState({data:null, httpErrorMessage: JSON.stringify(error.toString()) });
            } finally {
                this.setState({isLoading: false})
            }
          };
          postRecord()
    }

    

     render(){
        const { httpErrorMessage, isLoading, requestBody, responseBody} = this.state

        const handleChange = (event, staticValue) => {
            // You can now use both the selected value and the static value
            console.log("Selected Value:", event.target.value);
            console.log("Static Value:", staticValue);

            const {requestBody} = this.state
            requestBody[staticValue] = event.target.value
            this.setState({requestBody:requestBody})
          };

            return (
            <div><ErrorBoundary>
                    <div className="card">
                    <form className="max-w-md mx-auto" onSubmit={this.formSubmitHandler} method="POST">
                                <div>
                                <label htmlFor="has_fever" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Do you have fever?</label>
                                <select name="has_fever" id="has_fever" value={requestBody.has_fever} onChange={(event) => handleChange(event, "has_fever")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option disabled>Select any</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">no</option>
                                </select>
                                </div>
                                <div>
                                <label htmlFor="has_cough" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Do you have cough?</label>
                                <select name="has_cough" id="has_cough" value={requestBody.has_cough} onChange={(event) => handleChange(event, "has_cough")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option disabled>Select any</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">no</option>
                                </select>
                                </div>
                                <div>
                                <label htmlFor="has_fatigue" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Do you feel Fatigue?</label>
                                <select name="has_fatigue" id="has_fatigue" value={requestBody.has_fatigue} onChange={(event) => handleChange(event, "has_fatigue")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option disabled>Select any</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">no</option>
                                </select>
                                </div>
                                <div>
                                <label htmlFor="has_difficulty_breathing" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Do you have difficulty breathing?</label>
                                <select name="has_difficulty_breathing" id="has_difficulty_breathing"  onChange={(event) => handleChange(event, "has_difficulty_breathing")} value={requestBody.has_difficulty_breathing} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option disabled>Select any</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">no</option>
                                </select>
                                </div>
                                <div>
                                <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Enter your age</label>
                                    <input type="number" id="age" name="age" value={requestBody.age} onChange={(event) => handleChange(event, "age")}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                </div>
                                <div>
                                <label htmlFor="blood_pressure_level" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">How is your blood pressure level?</label>
                                <select name="blood_pressure_level" id="blood_pressure_level" value={requestBody.blood_pressure_level} onChange={(event) => handleChange(event, "blood_pressure_level")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option disabled>Select any</option>
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                </select>
                                </div>
                                <div>
                                <label htmlFor="cholesterol_level" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">How is your cholesterol level?</label>
                                <select name="cholesterol_level" id="cholesterol_level" value={requestBody.cholesterol_level} onChange={(event) => handleChange(event, "cholesterol_level")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option disabled>Select any</option>
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                </select>
                                </div>
                                <div>
                                    <button type="submit" className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Evaluate</button>
                                </div>
                               </form>
                            </div>
                            {(responseBody || httpErrorMessage) && 
                                <div className="card">
                                    {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                                        <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2> : <span></span>)}
                                        {responseBody && 
                                        <div>                                            
                                            Based on the health parameters provided, it has been determined that the symptoms align with <b>{responseBody.disease}</b> and
                                            The test results indicate a <b>{responseBody.outcome}</b> outcome.
                                            
                                        </div>
                                        }
                                </div>
                            }
            </ErrorBoundary></div>
            );
     }
}


export default EmergencyContact;