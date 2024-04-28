import HttpClient from "./HttpClient"
import React from "react";
import LineChartD3 from "../react-d3/LineChartD3.js";

class LineChart extends React.Component {
    state = {
        // this is the default set to while initilizing the component
        requestBody: {
            'end_date': null,
        'start_date': null
        },
        responseBody: null,
        httpErrorMessage: null,
        isLoading: false,
        xAxiasLable: null,
        yAxiasLable: null,
        endpoint: null
    };
    
    componentDidMount() {
      this.setState({responseBody: this.props.data})
      this.setState({xAxiasLable: this.props.xAxiasLable})
      this.setState({yAxiasLable: this.props.yAxiasLable})
      this.setState({endpoint: this.props.endpoint})
    }

    formSubmitHandler = e => {
        e.preventDefault()
        const { requestBody, endpoint } = this.state
        console.log('Form Submit Record')
        console.log(requestBody)
      
        const url = endpoint;
        //calling api for data
        const postRecord = async () => {
            try {
                this.setState({ responseBody: null});
                this.setState({ isLoading: true })
                const responseBody = await HttpClient.post(url, requestBody);
                this.setState({ responseBody: responseBody, httpErrorMessage: null });
            } catch (error) {
                console.error('Error fetching data:', error);
                this.setState({ responseBody: null, httpErrorMessage: JSON.stringify(error.toString()) });
            } finally {
                this.setState({ isLoading: false })
            }
        };
        postRecord()
      }

    render() {
        const { httpErrorMessage, isLoading, requestBody, responseBody, xAxiasLable, yAxiasLable } = this.state

    const handleChange = (event, staticValue) => {
      // You can now use both the selected value and the static value
      console.log("Selected Value:", event.target.value);
      console.log("Static Value:", staticValue);

      const { requestBody } = this.state
      requestBody[staticValue] = event.target.value
      this.setState({ requestBody: requestBody })
  };

        return (
            <div>
<form className="mx-auto" onSubmit={this.formSubmitHandler} method="POST">
                    <div className="grid mt-2 w-full xl:grid-cols-4 xl:gap-4 lg:grid-cols-3 lg:gap-3 md:grid-cols-2 md:gap-2 sm:grid-cols-1 sm:gap-1">
                        
                    <div>
                            <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Select start date</label>
                            <input type="date" required id="start_date" name="start_date" value={requestBody.start_date} onChange={(event) => handleChange(event, "start_date")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                        </div>
                        <div>
                            <label htmlFor="end_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Select end date </label>
                            <input type="date" id="end_date" required name="end_date" value={requestBody.end_date} onChange={(event) => handleChange(event, "end_date")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                        </div>
                       
                        <div className="xl:mt-4 md:mt-4">
                            <button type="submit" className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Evaluate</button>
                        </div>
                        </div>
                    </form>
                    {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
        <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}
                    {responseBody &&   
                <LineChartD3 data={responseBody} width={1200} height={500} xAxiasLable={xAxiasLable} yAxiasLable={yAxiasLable} />
                    }
            </div>
        );
    }
}


export default LineChart;