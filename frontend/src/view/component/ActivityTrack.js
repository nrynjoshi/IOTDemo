import React from "react";
import SankeyDiagram from "./SankeyDiagram/SankeyDiagram";
import ForceDirectedGraph from "./ForceDirectDiagram/ForceDirectedGraph";
import PageTitle from "./PageTitle";

class ActivityTrack extends React.Component {
    state = { httpErrorMessage: null, isLoading: false };

    render() {
        const { httpErrorMessage, isLoading } = this.state
        return (<div>
            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}
            <div className="card">
                <PageTitle title="Daily Disease Evaluation Based on Symptoms"></PageTitle>
                <SankeyDiagram dataEndpoint={'/activity-tracks'}></SankeyDiagram>
            </div>
            <div className="card">
                <PageTitle title="Daily Disease Evaluation Based on Symptoms"></PageTitle>
                <ForceDirectedGraph dataEndpoint={'/activity-tracks'}></ForceDirectedGraph>
            </div>
        </div>);
    }
}

export default ActivityTrack;