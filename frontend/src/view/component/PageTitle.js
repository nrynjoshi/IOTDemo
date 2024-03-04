import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";

class PageTitle extends React.Component {

     render(){
        const title = this.props.title;
            return (
                <span className="underline text-2xl font-bold mb-1">{title}</span>
            );
     }
}

export default PageTitle;