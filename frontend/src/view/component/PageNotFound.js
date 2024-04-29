import React from "react";
import PageTitle from "./PageTitle";

class PageNotFound extends React.Component {

    state = { dataCar: null, dataKeys: null, colorEncoding: "weight (lb)", httpErrorMessage: null, isLoading: false };

    handleColorEncodingChange = (e) => {
        console.log('handleColorEncodingChange called');
        this.setState({ colorEncoding: e.target.value });
    }

    render() {
        const { httpErrorMessage, isLoading } = this.state
        return (<div>
            {isLoading ? (<p>Loading ...</p>) : (httpErrorMessage ?
                <h2 style={{ backgroundColor: 'red' }}>{httpErrorMessage}</h2> : <span></span>)}
            <PageTitle title="Unknow Page"></PageTitle>
            <div className="card"> Page does not exist. click here to go to home page</div>
        </div>);
    }
}

export default PageNotFound;