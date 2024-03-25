import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HttpClient from "../util/HttpClient"


class EmergencyContact extends React.Component {

    state = {data: null, httpErrorMessage:null, isLoading: false};

    componentDidMount() {
        const url = this.props.dataEndpoint;
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



     render(){
        const { httpErrorMessage, isLoading, data} = this.state

            return (
            <div><ErrorBoundary>

                {isLoading ? (
                    <p>Loading ...</p>
                ) : (httpErrorMessage ? <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2>:
                <span></span>
                )}
                <div className="grid grid-cols-2 gap-2">
                {data && data.map((emergencyContact) => (
                        
                            <div className="card">
                                <div>Name: <span className="font-bold">{emergencyContact.name}</span></div>
                                <div>Contact Number: {emergencyContact.contact_number}</div>
                                <div>Address: {emergencyContact.address}</div>
                                <div>Relationship: {emergencyContact.relationship}</div>
                                <div>Action: <a href="tel:55">Call (work left)</a></div>
                            </div>

                       
                   
                )
                    )}
            </div>
            </ErrorBoundary></div>
            );
     }
}


export default EmergencyContact;