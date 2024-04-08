import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"




class CurrentDashboardDisplay extends React.Component {

    state = {data: null, httpErrorMessage:null, isLoading: false, url:null, fetchingData: false};

    async componentDidMount() {
        const url = this.props.dataEndpoint;
        this.setState({url: url})

        console.log('printing from componentDidMount',url)
          
        this.fetchData(false, url); // Fetch data initially
        //this.interval = setInterval(() => this.fetchData(true, url), 20 * 1000); // Fetch data every 20 seconds
    }

    componentWillUnmount() {
       // clearInterval(this.interval); // Clear interval on component unmount
      }

    fetchData = async (isIntervalCall, url ) => {
      const { fetchingData} = this.state
      console.log('printing from fetchData',url)
      if(!fetchingData){
          try {
            this.setState({fetchingData: true})
            if(!isIntervalCall){
              this.setState({isLoading: true})
            }

            const data =  await HttpClient.get(url);
            this.setState({data:data, httpErrorMessage:null});

        
          } catch (error) {
            console.error('Error fetching data:', error);
            this.setState({data:null, httpErrorMessage: JSON.stringify(error.toString()) });
          } finally {
              this.setState({isLoading: false})
              this.setState({fetchingData: false})
          }
      }
       
      };



     render(){
        const { httpErrorMessage, isLoading, data} = this.state

         const handleChange = () => {
            console.log("clicked checkbox")
          };

            return (
            <div><ErrorBoundary>

                {isLoading ? (
                    <p>Loading ...</p>
                ) : (httpErrorMessage ? <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2>:
                <span></span>
                )}
                {data ? (

                        <div>
                           <h2>{data.text}</h2>
                                <div className="flex items-center">
                                <span className="text-red-500 text-6xl font-bold text-center p-3">{data.value}</span>
                            
                                </div>
                                <span className="text-base font-bold text-center p-3">Min:&nbsp;{data.min_value}</span>
                                <span className="text-base font-bold text-center p-3">Max:&nbsp;{data.max_value}</span>
                        </div>
                  
                    ):
                    <span></span>}

            </ErrorBoundary></div>
            );
     }
}


export default React.memo(CurrentDashboardDisplay);