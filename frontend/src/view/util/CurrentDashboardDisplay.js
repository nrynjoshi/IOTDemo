import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";





class CurrentDashboardDisplay extends React.Component {



     render() {
          const displayText = this.props.displayText;
          const displayValue = this.props.displayValue;

          return (
               <div><ErrorBoundary>

                    <div>
                         <h2>{displayText}</h2>
                         <div className="flex items-center">
                              <span className="text-red-500 text-6xl font-bold text-center p-3">{displayValue}</span>
                         </div>

                    </div>

               </ErrorBoundary></div>
          );
     }
}


export default React.memo(CurrentDashboardDisplay);