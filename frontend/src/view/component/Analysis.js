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


<div>
                        <div className="grid grid-cols-2 gap-2">

                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                            <PageTitle title="Heart Rate Analysis"></PageTitle>
                            charts goes here

                            </div>

                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                            <PageTitle title="SPO2 Analysis"></PageTitle>
                            charts goes here

                            </div>

                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                            <PageTitle title="Blood Sugar Analysis"></PageTitle>
                            charts goes here

                            </div>

                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                            <PageTitle title="Blood Temperature Analysis"></PageTitle>
                            charts goes here

                            </div>

                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                            <PageTitle title="Sleep Pattern Analysis"></PageTitle>
                            charts goes here

                            </div>

                            <div className="bg-white shadow-lg shadow-grey-500/50 min-w-6 min-h-6">
                            <PageTitle title="Steps Analysis"></PageTitle>
                            charts goes here

                            </div>

                        </div>
                    </div>

        </div>);
    }
}


export default Analysis;