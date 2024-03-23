import React from "react";
import PageTitle from "./PageTitle";

class Analysis extends React.Component {

    state = {dataCar: null, dataKeys:null, colorEncoding: "weight (lb)", httpErrorMessage: null, isLoading: false};

    handleColorEncodingChange = (e) => {
        console.log('handleColorEncodingChange called');
        this.setState({colorEncoding: e.target.value});
    }


    render() {
        const {httpErrorMessage, colorEncoding,isLoading, dataCar} = this.state
        return (<div>

            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{backgroundColor: 'red'}}>{httpErrorMessage}</h2> : <span></span>)}
                    <PageTitle title="Montly Health Record Analysis"></PageTitle>

<div>
                        <div className="grid grid-cols-2 gap-2">

                            <div className="card">
                            <PageTitle title="Heart Rate Analysis"></PageTitle>
                            here we can show the max, min value of heart rate as well as average heart rate for that day

                            </div>

                            <div className="card">
                            <PageTitle title="SPO2 Analysis"></PageTitle>
                            charts goes here

                            </div>

                            <div className="card">
                            <PageTitle title="Blood Sugar Analysis"></PageTitle>
                            charts goes here

                            </div>

                            <div className="card">
                            <PageTitle title="Blood Temperature Analysis"></PageTitle>
                            charts goes here

                            </div>

                            <div className="card">
                            <PageTitle title="Sleep Pattern Analysis"></PageTitle>
                            charts goes here

                            </div>

                            <div className="card">
                            <PageTitle title="Steps Analysis"></PageTitle>
                            charts goes here

                            </div>

                        </div>
                    </div>

        </div>);
    }
}


export default Analysis;