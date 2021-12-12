import React from "react";
import {Button, ColumnContainer, RowContainer} from "./elements";
import {activeRosePatternsAtom, selectedRosePatternAtom} from "../state/activeRosePatterns";
import {useRecoilState} from "recoil";
import RosePatternEditor from "./RosePatternEditor";
import RosePatternSummary from "./RosePatternSummary";

export default function PatternList() {
  const [activeRosePatterns, setActiveRosePatterns] = useRecoilState(activeRosePatternsAtom);
  const [selectedRosePattern, setSelectedRosePattern] = useRecoilState(selectedRosePatternAtom);
  console.log(activeRosePatterns)
  return (
    <ColumnContainer style={{height: '100vh', overflowY: 'scroll', width: '50%'}}>
      {activeRosePatterns.map((rosePattern, i) => {
        if (selectedRosePattern === i) {
          return <RosePatternEditor key={'PatternEditor' + i} pattern={rosePattern} index={i}/>
        } else {
          return <RosePatternSummary key={'PatternSummary' + i} pattern={rosePattern} index={i}/>
        }
      })}
      {selectedRosePattern === null && (
      <Button style={{ width: '86px' }} onClick={() => {
        setActiveRosePatterns([...activeRosePatterns, {
          rWheel: 'sine24',
          zWheel: 'sine24',
          stepover: 0.2,
          startingPhase: 0.0,
          phaseStepover: 0.0,
          speed: 500,
          rpm: 10000,
          startingRadius: 0,
          startingDepth: 0.3,
          steps: 0,
          endingRadius: 0,
          zMag: 0.4,
          rMag: 1.5,
          tipAngle: 120,
          toolDiameter: 3.175
        }]);
        setSelectedRosePattern(activeRosePatterns.length);
      }}>Add pattern</Button>)}
    </ColumnContainer>
  )
}