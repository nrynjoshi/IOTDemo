import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import HypnogramD3 from "../react-d3/HypnogramD3.js";


class Hypnogram extends React.Component {

    state = { data: null, httpErrorMessage: null, isLoading: false };



    render() {
        const data = this.props.data;
        return (
            <div><ErrorBoundary>
                <HypnogramD3 data={data} width={1200} height={500} />
            </ErrorBoundary></div>
        );
    }
}


export default Hypnogram;