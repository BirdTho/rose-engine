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
  const [zMag, setZMag] = useState(props.pattern.zMag);

  const [rWheel, setRWheel] = useState(props.pattern.rWheel);
  const [rMag, setRMag] = useState(props.pattern.rMag);
  const [startingRadius, setStartingRadius] = useState(props.pattern.startingRadius);
  const [stepover, setStepover] = useState(props.pattern.stepover);
  const [steps, setSteps] = useState(props.pattern.steps);
  const [endingRadius, setEndingRadius] = useState(props.pattern.endingRadius);

  const [startingPhase, setStartingPhase] = useState(props.pattern.startingPhase);
  const [phaseStepover, setPhaseStepover] = useState(props.pattern.phaseStepover);

  const [rpm, setRpm] = useState(props.pattern.rpm);
  const [speed, setSpeed] = useState(props.pattern.speed);

  const [tipAngle, setTipAngle] = useState(props.pattern.tipAngle);
  const [toolDiameter, setToolDiameter] = useState(props.pattern.toolDiameter);

  const updateSteps = (steps: number) => {
    setSteps(steps);
    setEndingRadius(startingRadius + steps * stepover);
  };

  const updateStepover = (stepover: number) => {
    setStepover(stepover);
    setEndingRadius(startingRadius + steps * stepover);
  }

  const updateStartingRadius = (startingRadius: number) => {
    setStartingRadius(startingRadius);
    setEndingRadius(startingRadius + steps * stepover);
  }

  const updateEndingRadius = (endingRadius: number) => {
    setEndingRadius(endingRadius);

    if (stepover !== 0) {
      const newSteps = (endingRadius - startingRadius) / stepover;
      setSteps(newSteps);
    }
  }

  const save = () => {
    const newRosePattern: RosePatternConfig = {
      zWheel,
      zMag,
      endingRadius,
      phaseStepover,
      rpm,
      rWheel,
      rMag,
      speed,
      steps,
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
            <NumberInput label={'Z Mag (scalar mm)'} value={zMag} onChange={setZMag} round={3}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Starting Z depth (mm)'} value={startingDepth} onChange={setStartingDepth} round={3}/>
          </InputRow>
          <InputRow>
            <SelectWheel label={'R Pattern'} value={rWheel} options={keys} setValue={setRWheel}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Radius Mag (scalar mm)'} value={rMag} onChange={setRMag} round={3}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Starting Radius (mm)'} value={startingRadius} onChange={updateStartingRadius} round={3}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Radius Stepover (mm/step)'} value={stepover} onChange={updateStepover} round={3}/>
          </InputRow>
        </PatternInputColumnContainer>
        <PatternInputColumnContainer style={{marginLeft: '1em', justifyContent: 'start', width: 'auto'}}>
          <InputRow>
            <NumberInput label={'Total Radius Stepovers (steps)'} value={steps} onChange={updateSteps} round={0}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Ending Radius (mm)'} value={endingRadius} onChange={updateEndingRadius} round={3}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Starting Phase (Θ radians)'} value={startingPhase} onChange={setStartingPhase}/>
          </InputRow>
          <InputRow>
            <NumberInput label={'Phase Stepover (dΘ each step)'} value={phaseStepover} onChange={setPhaseStepover} round={3}/>
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