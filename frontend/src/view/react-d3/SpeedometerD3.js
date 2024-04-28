import ReactSpeedometer from "react-d3-speedometer"

import React from 'react';

const SpeedometerD3 = ({ value, customSegmentStops, customSegmentLabels }) => {
  
// non things passed from root node than this below segment label will be set by default
  if(!customSegmentLabels ){ 
    customSegmentLabels = [
      {
          text: 'Low',
          position: 'INSIDE',
          color: '#555',
          fontSize: '18px',
      },
      {
          text: 'Normal',
          position: 'INSIDE',
          color: '#551',
          fontSize: '18px',
      },
      {
          text: 'High',
          position: 'INSIDE',
          color: '#558',
          fontSize: '18px',
      }
      ]
  }

  const minValue = customSegmentStops[0]
  const maxValue = customSegmentStops[customSegmentStops.length - 1]
  return (
    <div>
    <div>
      <ReactSpeedometer
        width={350}
        height={200}
        needleHeightRatio={0.7}
        value={value}
        currentValueText={value}
        minValue={minValue}
        maxValue={maxValue}
        valueTextFontSize="50px"
        segmentColors={["	#efef8d", "#9fcbee", "#ee2400", "#ff0f0f"]}
        customSegmentStops={customSegmentStops}
        customSegmentLabels={customSegmentLabels}
        ringWidth={47}
        needleTransitionDuration={3333}
        needleTransition="easeElastic"
        needleColor={'#90f2ff'}
      />
    </div>
    </div>
  );
};

export default SpeedometerD3;