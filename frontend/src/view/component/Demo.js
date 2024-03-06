import React from "react";
import PageTitle from "./PageTitle";
import SankeyDiagram from "./SankeyDiagram";
import {BACKEND_API_CALL} from "../util/Constant";
import ForceDirectedGraph from "./ForceDirectedGraph";
import MobilePatentSuits from "./MobilePatentSuits";
import ParallelCoordinates from "./ParallelCoordinates";

class Demo extends React.Component {

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
            <PageTitle title="Analysis"></PageTitle>

            <div>D3.js with Reactjs Sample Demo App</div>
            <div>
                <SankeyDiagram dataEndpoint={BACKEND_API_CALL + '/energy'}></SankeyDiagram>
                <hr></hr>
                <ForceDirectedGraph dataEndpoint={BACKEND_API_CALL + '/force-directed-graph'}></ForceDirectedGraph>
                <hr></hr>
                <MobilePatentSuits dataEndpoint={BACKEND_API_CALL + '/mobile-patent-suits'}></MobilePatentSuits>
                <hr></hr>
                <ParallelCoordinates dataEndpoint={BACKEND_API_CALL + '/parallel-coordinate-cars'}
                                     keysEndpoint={BACKEND_API_CALL + '/parallel-coordinate-keys'}></ParallelCoordinates>
            </div>
        </div>);
    }
}


export default Demo;