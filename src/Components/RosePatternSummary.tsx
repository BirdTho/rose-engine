import React, {useMemo} from "react";
import {RosePatternConfig} from "../types";
import {Button, ColumnContainer, PatternCard, RoseParam, RowContainer, RowContainerWrapping} from "./elements";
import {activeRosePatternsAtom, selectedRosePatternAtom} from "../state/activeRosePatterns";
import {useRecoilState} from "recoil";

interface RosePatternSummaryProps {
  pattern: RosePatternConfig
  index: number
}

export default function RosePatternSummary(props: RosePatternSummaryProps) {
  const [selectedRosePattern, setSelectedRosePatternAtom] = useRecoilState(selectedRosePatternAtom);
  const [activeRosePatterns, setActiveRosePatterns] = useRecoilState(activeRosePatternsAtom);
  const {
    startZMag,
    startRMag,
    endZMag,
    endRMag,
    endingDepth,
    zWheel,
    endingRadius,
    endingPhase,
    rpm,
    rWheel,
    startingRadius,
    startingPhase,
    startingDepth,
    stepover,
    speed,
    toolDiameter,
    tipAngle,
  } = props.pattern;
  return (
    <PatternCard>
      <ColumnContainer>
        <Button disabled={selectedRosePattern !== null} style={{width: '80px'}} onClick={() => {setSelectedRosePatternAtom(props.index)}}>Edit</Button>
        <Button disabled={selectedRosePattern !== null} style={{width: '80px'}} onClick={() => {
          window.confirm('Are you sure?') && setActiveRosePatterns(activeRosePatterns.filter((item, idx) => idx !== props.index))
        }}>Delete</Button>
      </ColumnContainer>
      <RowContainerWrapping style={{alignItems: 'baseline'}}>
        <RoseParam label={'Z Wheel'} value={zWheel}/>•
        <RoseParam label={'starting Z Mag'} value={startZMag}/>•
        <RoseParam label={'ending Z Mag'} value={endZMag}/>•
        <RoseParam label={'starting depth'} value={startingDepth}/>•
        <RoseParam label={'ending depth'} value={endingDepth}/>•
        <RoseParam label={'R Wheel'} value={rWheel}/>•
        <RoseParam label={'starting R Mag'} value={startRMag}/>•
        <RoseParam label={'ending R Mag'} value={endRMag}/>•
        <RoseParam label={'starting radius'} value={startingRadius}/>•
        <RoseParam label={'ending radius'} value={endingRadius}/>•
        <RoseParam label={'R stepover'} value={stepover}/>•
        <RoseParam label={'starting phase'} value={startingPhase}/>•
        <RoseParam label={'ending phase'} value={endingPhase}/>•
        <RoseParam label={'speed (mm/min)'} value={speed}/>•
        <RoseParam label={'rpm'} value={rpm}/>•
        <RoseParam label={'Tool diameter (mm)'} value={toolDiameter}/>•
        <RoseParam label={'Tip angle Θ degrees'} value={tipAngle}/>
      </RowContainerWrapping>
    </PatternCard>
  )
}