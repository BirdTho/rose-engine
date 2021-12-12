import React, {useState} from "react";
import Plot from 'react-plotly.js';
import {Button, ColumnContainer} from "./elements";

import {activeRosePatternsAtom} from "../state/activeRosePatterns";
import {useRecoilValue} from "recoil";
import PatternSegment from "../rose/rose-engine";
import {Data} from "plotly.js";

export default function PreviewGraph() {
  const activeRosePatterns = useRecoilValue(activeRosePatternsAtom);
  const [graphData, setGraphData] = useState<any[]>([])

  const makeGraphData = function () {
    const newGraphData: any[] = [];
    activeRosePatterns.forEach(patternConfig => {
      const patternSegment = new PatternSegment(patternConfig)
      newGraphData.push({
        ...patternSegment.generatePathRTheta(),
        thetaunit: "radians",
        type: 'scatterpolar',
        mode: 'lines',
        marker: {color: 'red'},
      })
    });

    setGraphData(newGraphData);
  };

  return (
    <ColumnContainer style={{width: '50%'}}>
    <Plot
      data={graphData as any}
      layout={ {width: 860, height: 860, title: 'A Fancy Plot'} }
    />
    <Button onClick={makeGraphData} style={{width: '60px'}}>Render</Button>
    </ColumnContainer>
  );
}