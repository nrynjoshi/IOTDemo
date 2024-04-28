import React from "react";
import HttpClient from "./HttpClient"
import QRCode from 'react-qr-code';

class EmergencyContact extends React.Component {
    state = { data: null, httpErrorMessage: null, isLoading: false };

    componentDidMount() {
        const url = this.props.dataEndpoint;
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

        return (
            <div>
                {isLoading ? (
                    <p>Loading ...</p>
                ) : (httpErrorMessage ? <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> :
                    <span></span>
                )}
                <div className="grid md:grid-cols-2 md:gap-2 sm:grid-cols-1 sm:gap-1">
                    {data && data.map((emergencyContact) => (
                        <div className="card">
                            <div className="grid md:grid-cols-2 md:gap-2 sm:grid-cols-1 sm:gap-1">
                                <div>
                                    <div>Name: <span className="font-bold">{emergencyContact.name}</span></div>
                                    <div>Contact Number: {emergencyContact.contact_number}</div>
                                    <div>Address: {emergencyContact.address}</div>
                                    <div>Relationship: {emergencyContact.relationship}</div>
                                </div>
                                <div className="md:content-end">
                                    <QRCode
                                        title={emergencyContact.name}
                                        value={emergencyContact.contact_number}
                                        size={'120'}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                    )}
                </div>
            </div>
        );
    }
}

export default EmergencyContact;