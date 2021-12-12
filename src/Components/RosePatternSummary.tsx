import React, {useMemo} from "react";
import {RosePatternConfig} from "../types";
import {Button, ColumnContainer, PatternCard, RoseParam, RowContainer, RowContainerWrapping} from "./elements";
import {selectedRosePatternAtom} from "../state/activeRosePatterns";
import {useRecoilState} from "recoil";

interface RosePatternSummaryProps {
  pattern: RosePatternConfig
  index: number
}

export default function RosePatternSummary(props: RosePatternSummaryProps) {
  const [selectedRosePattern, setSelectedRosePatternAtom] = useRecoilState(selectedRosePatternAtom);
  const {
    zMag,
    zWheel,
    endingRadius,
    phaseStepover,
    rpm,
    rMag,
    rWheel,
    startingRadius,
    startingPhase,
    startingDepth,
    stepover,
    steps,
    speed,
    toolDiameter,
    tipAngle,
  } = props.pattern;
  return (
    <PatternCard>
      <RowContainer>
        <Button disabled={selectedRosePattern !== null} style={{width: '80px'}} onClick={() => {setSelectedRosePatternAtom(props.index)}}>Edit</Button>
      </RowContainer>
      <RowContainerWrapping style={{alignItems: 'baseline'}}>
        <RoseParam label={'Z Wheel'} value={zWheel}/>•
        <RoseParam label={'z Mag'} value={zMag}/>•
        <RoseParam label={'starting depth'} value={startingDepth}/>•
        <RoseParam label={'R Wheel'} value={rWheel}/>•
        <RoseParam label={'R Mag'} value={rMag}/>•
        <RoseParam label={'starting radius'} value={startingRadius}/>•
        <RoseParam label={'R stepover'} value={stepover}/>•
        <RoseParam label={'R steps'} value={steps}/>•
        <RoseParam label={'ending radius'} value={endingRadius}/>•
        <RoseParam label={'starting phase'} value={startingPhase}/>•
        <RoseParam label={'phase stepover'} value={phaseStepover}/>•
        <RoseParam label={'speed (mm/min)'} value={speed}/>•
        <RoseParam label={'rpm'} value={rpm}/>•
        <RoseParam label={'speed (mm/min)'} value={toolDiameter}/>•
        <RoseParam label={'Tip angle Θ degrees'} value={tipAngle}/>
      </RowContainerWrapping>
    </PatternCard>
  )
}