import ErrorBoundary from "../util/ErrorBoundary.js"
import React from "react";
import SoundUtil from "../util/SoundUtil";
import SpeedometerD3 from "../react-d3/SpeedometerD3.js";





class CurrentDashboardDisplay extends React.Component {



     render() {
          const displayText = this.props.displayText;
          const displayValue = this.props.displayValue;
          const minNormalValue = this.props.minNormalValue;
          const maxNormalValue = this.props.maxNormalValue;
          const customSegmentStops =  this.props.customSegmentStops;
          const customSegmentLabels =  this.props.customSegmentLabels;
          return (
               <div><ErrorBoundary>

                    <div>
                         <h2>{displayText}</h2>
                         <div className="flex items-center">
                         {customSegmentStops ? (
                              <SpeedometerD3 value ={displayValue} customSegmentStops ={customSegmentStops} customSegmentLabels= {customSegmentLabels}/>
                              ) : (
                                   <span className="text-red-500 text-6xl font-bold text-center p-3">{displayValue}</span>
                              )}
                              
                              
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