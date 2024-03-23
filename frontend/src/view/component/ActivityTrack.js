import React from "react";
import PageTitle from "./PageTitle";
import {BACKEND_API_CALL} from "../util/Constant";
import SankeyDiagram from "./SankeyDiagram";

class ActivityTrack extends React.Component {

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
            <div className="card">
                <PageTitle title="Montly Based Habitual Diagram"></PageTitle>
                <SankeyDiagram dataEndpoint={BACKEND_API_CALL + '/activity-tracks'}></SankeyDiagram>

            </div>


        </div>);
    }
}


export default ActivityTrack;