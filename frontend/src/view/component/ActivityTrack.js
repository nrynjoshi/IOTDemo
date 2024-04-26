import React from "react";
import PageTitle from "../util/PageTitle";
import { BACKEND_API_CALL } from "../util/Constant";
import SankeyDiagram from "./SankeyDiagram";
import ForceDirectedGraph from "./ForceDirectedGraph";

class ActivityTrack extends React.Component {

    state = {httpErrorMessage: null, isLoading: false };


    render() {
        const { httpErrorMessage, isLoading } = this.state
        return (<div>

            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}
            <div className="card">
                <PageTitle title="Daily Disease Evaluation Based on Symptoms"></PageTitle>
                <SankeyDiagram dataEndpoint={BACKEND_API_CALL + '/activity-tracks'}></SankeyDiagram>

            </div>

            <div className="card">
                <PageTitle title="Daily Disease Evaluation Based on Symptoms"></PageTitle>
                <ForceDirectedGraph dataEndpoint={BACKEND_API_CALL + '/activity-tracks'}></ForceDirectedGraph>

            </div>

        </div>);
    }
}


export default ActivityTrack;