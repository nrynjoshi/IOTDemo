import React from "react";

class DiseaseFinderML extends React.Component {

    state = {
        // this is the default set while initilizing the component
        requestBody: {
            'has_fever': 'yes',
            'has_cough': 'yes',
            'has_fatigue': 'yes',
            'has_difficulty_breathing': 'yes',
            'age': 28,
            'is_male': 'yes',
            'blood_pressure_level': 'normal',
            'cholesterol_level': 'normal',
        },
        responseBody: null,
        httpErrorMessage: null,
        isLoading: false
    };

  componentDidUpdate() {
    const diseaseFinder = this.props.data;
    // Check if the data prop has changed
    if ((this.state.responseBody !== diseaseFinder.data) ||
    (this.state.httpErrorMessage !== diseaseFinder.httpErrorMessage) ||
    (this.state.isLoading !== diseaseFinder.isLoading)
) {
        const diseaseFinder = this.props.data;
        this.setState({httpErrorMessage: diseaseFinder.httpErrorMessage})
        this.setState({isLoading: diseaseFinder.isLoading})
        this.setState({responseBody: diseaseFinder.data})
    }
  }

    formSubmitHandler = e => {
        e.preventDefault()
        const { requestBody } = this.state
        this.props.onFormSubmit(requestBody)
        
    }

    render() {
        const { httpErrorMessage, isLoading, requestBody, responseBody } = this.state

        const handleChange = (event, staticValue) => {
            // You can now use both the selected value and the static value
            const { requestBody } = this.state
            requestBody[staticValue] = event.target.value
            this.setState({ requestBody: requestBody })
        };

        return (
            <div>
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
                            <select name="has_difficulty_breathing" id="has_difficulty_breathing" onChange={(event) => handleChange(event, "has_difficulty_breathing")} value={requestBody.has_difficulty_breathing} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option disabled>Select any</option>
                                <option value="yes">Yes</option>
                                <option value="no">no</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="is_male" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Select you gender</label>
                            <select name="is_male" id="is_male" onChange={(event) => handleChange(event, "is_male")} value={requestBody.is_male} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option disabled>Select any</option>
                                <option value="yes">Male</option>
                                <option value="no">Female</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Enter your age</label>
                            <input type="number" id="age" name="age" value={requestBody.age} onChange={(event) => handleChange(event, "age")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
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
                            <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}
                        {responseBody &&
                            <div>
                                Based on the health parameters provided, it has been determined that the symptoms align with below mention disease with result outcome.
                                <div className="relative overflow-x-auto">
                                    <table className="w-6/12 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-black">
                                            <tr>
                                                <th scope="col" className="px-4 py-3">
                                                    Disease
                                                </th>
                                                <th scope="col" className="px-4 py-3">
                                                    Outcome
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {responseBody['output'].map((item, index) => (
                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <th scope="row" className="px-6 py-4 font-medium text-xl text-gray-900 whitespace-nowrap dark:text-white">{item.disease}</th>
                                                    {item.outcome === 'Positive' &&
                                                        <th scope="row" className="px-6 py-4 font-medium text-xl text-gray-900 whitespace-nowrap dark:text-red-400">{item.outcome}</th>
                                                    }
                                                    {item.outcome === 'Negative' &&
                                                        <th scope="row" className="px-6 py-4 font-medium text-xl text-gray-900 whitespace-nowrap dark:text-green-400">{item.outcome}</th>
                                                    }
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default DiseaseFinderML;