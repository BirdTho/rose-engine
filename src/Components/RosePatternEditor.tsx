import React, {useMemo, useState} from "react";
import {RosePatternConfig} from "../types";
import {
  Button, ColumnContainer,
  InputContainer,
  InputRow,
  NumberInput,
  PatternCard,
  PatternInputColumnContainer, RowContainer,
  SelectWheel
} from "./elements";
import wheels from '../rose/wheels';
import {useRecoilState, useSetRecoilState} from "recoil";
import {activeRosePatternsAtom, selectedRosePatternAtom} from "../state/activeRosePatterns";

interface RosePatternEditorProps {
  pattern: RosePatternConfig,
  index: number
}

export default function RosePatternEditor(props: RosePatternEditorProps) {
  const [activeRosePatterns, setActiveRosePatterns] = useRecoilState(activeRosePatternsAtom);
  const setSelectedRosePattern = useSetRecoilState(selectedRosePatternAtom);

  const keys = useMemo(() => Object.keys(wheels), [wheels]);
  const [zWheel, setZWheel] = useState(props.pattern.zWheel);
  const [startingDepth, setStartingDepth] = useState(props.pattern.startingDepth);
  const [endingDepth, setEndingDepth] = useState(props.pattern.endingDepth);
  const [startZMag, setStartZMag] = useState(props.pattern.startZMag);
  const [endZMag, setEndZMag] = useState(props.pattern.endZMag);

  const [rWheel, setRWheel] = useState(props.pattern.rWheel);
  const [startRMag, setStartRMag] = useState(props.pattern.startRMag);
  const [endRMag, setEndRMag] = useState(props.pattern.endRMag);
  const [startingRadius, setStartingRadius] = useState(props.pattern.startingRadius);
  const [stepover, setStepover] = useState(props.pattern.stepover);
  const [endingRadius, setEndingRadius] = useState(props.pattern.endingRadius);

  const [startingPhase, setStartingPhase] = useState(props.pattern.startingPhase);
  const [endingPhase, setEndingPhase] = useState(props.pattern.endingPhase);

  const [rpm, setRpm] = useState(props.pattern.rpm);
  const [speed, setSpeed] = useState(props.pattern.speed);

  const [tipAngle, setTipAngle] = useState(props.pattern.tipAngle);
  const [toolDiameter, setToolDiameter] = useState(props.pattern.toolDiameter);

  const save = () => {
    const newRosePattern: RosePatternConfig = {
      zWheel,
      startRMag,
      startZMag,
      endRMag,
      endZMag,
      endingRadius,
      endingPhase,
      endingDepth,
      rpm,
      rWheel,
      speed,
      stepover,
      startingDepth,
      startingPhase,
      startingRadius,
      toolDiameter,
      tipAngle,
    };

    const newArr = [...activeRosePatterns];
    newArr[props.index] = newRosePattern;

    setActiveRosePatterns(newArr);
    setSelectedRosePattern(null);
  }

  const cancel = () => {
    setSelectedRosePattern(null);
  }

  return (
    <PatternCard>
      <ColumnContainer>
      <RowContainer>
        <PatternInputColumnContainer style={{justifyContent: 'start', width: 'auto'}}>
          <InputRow>
            <SelectWheel label={'Z Pattern'} value={zWheel} options={keys} setValue={setZWheel}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'starting Z Mag (scalar mm)'} value={startZMag} onChange={setStartZMag} round={3}/>
            <NumberInput label={'ending Z Mag (scalar mm)'} value={endZMag} onChange={setEndZMag} round={3}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Starting Z depth (mm)'} value={startingDepth} onChange={setStartingDepth} round={3}/>
            <NumberInput label={'Ending Z depth (mm)'} value={endingDepth} onChange={setEndingDepth} round={3}/>
          </InputRow>
          <InputRow>
            <SelectWheel label={'R Pattern'} value={rWheel} options={keys} setValue={setRWheel}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Starting Radius Mag (scalar mm)'} value={startRMag} onChange={setStartRMag} round={3}/>
            <NumberInput label={'Ending Radius Mag (scalar mm)'} value={endRMag} onChange={setEndRMag} round={3}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Starting Radius (mm)'} value={startingRadius} onChange={setStartingRadius} round={3}/>
            <NumberInput label={'Ending Radius (mm)'} value={endingRadius} onChange={setEndingRadius} round={3}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Radius Stepover (mm/step)'} value={stepover} onChange={setStepover} round={3}/>
          </InputRow>
        </PatternInputColumnContainer>
        <PatternInputColumnContainer style={{marginLeft: '1em', justifyContent: 'start', width: 'auto'}}>
          <InputRow>
            <NumberInput label={'Starting Phase (Θ radians)'} value={startingPhase} onChange={setStartingPhase}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Ending Phase (Θ radians)'} value={endingPhase} onChange={setEndingPhase}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'RPM'} value={rpm} onChange={setRpm} round={3}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Speed (mm/min)'} value={speed} onChange={setSpeed} round={3}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Tool Diameter'} value={toolDiameter} onChange={setToolDiameter} round={3}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Tip Angle Θ degrees'} value={tipAngle} onChange={setTipAngle} round={3}/>
          </InputRow>
        </PatternInputColumnContainer>
      </RowContainer>
        <InputRow>
          <InputContainer style={{justifyContent: 'left', alignItems: 'start', width: '100%'}}>
            <Button onClick={save}>Save</Button><Button onClick={cancel}>Cancel</Button>
          </InputContainer>
        </InputRow>
      </ColumnContainer>
    </PatternCard>
  )
}