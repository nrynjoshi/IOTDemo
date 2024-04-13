import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import SoundUtil from "../util/SoundUtil";





class CurrentDashboardDisplay extends React.Component {



     render() {
          const displayText = this.props.displayText;
          const displayValue = this.props.displayValue;
          const minNormalValue = this.props.minNormalValue;
          const maxNormalValue = this.props.maxNormalValue;
          return (
               <div><ErrorBoundary>

                    <div>
                         <h2>{displayText}</h2>
                         <div className="flex items-center">
                              <span className="text-red-500 text-6xl font-bold text-center p-3">{displayValue}</span>
                              <div>
                                   <SoundUtil value={displayValue} minNormalValue={minNormalValue} maxNormalValue={maxNormalValue}></SoundUtil>
                              </div>
                         </div>

                    </div>

               </ErrorBoundary></div>
          );
     }
}


export default React.memo(CurrentDashboardDisplay);