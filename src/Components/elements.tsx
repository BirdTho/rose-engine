import React from 'react';
import styled from 'styled-components';

export const Page = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const RowContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

export const RowContainerWrapping = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

export const Button = styled.button`
  margin-top: 1em;
  display: inline;
  height: 28px;
  margin-right: 1em;
`;

export const PatternCard = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  &:not(:first-child) {
    margin-top: 1em;
  }
  & > :nth-child(2) {
    padding: 5px;
    border: 1px solid darkgrey;
  }
`

export const PatternInputRowContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`

export const PatternInputColumnContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
`

export const Input = styled.input`
  height: 22px;
  width: 150px;
`;

export const InputRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: end;
  width: 100%;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-top: 0.5em;
  align-items: baseline;
  
  & label {
    display: inline;
    white-space: nowrap;
    margin-right: 0.5em;
  }
`;


export const ParamContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  margin-right: 0.5em;
  line-height: 1.6;
  
  &:not(:first-child) {
    margin-left: 0.5em;
  }
  
  & label {
    display: inline;
    white-space: nowrap;
    margin-right: 0.3em;
  }
`;

interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void,
  round?: number
}

export function NumberInput(props: NumberInputProps) {
  return (
    <InputContainer>
      <label>{props.label}</label>
      <Input type={'number'} value={props.value} onChange={(event) => {
          let intermediate = parseFloat(event.target.value);
          if (props.round != null && props.round >= 0) {
            const MUL = 10 ** props.round;
            intermediate = Math.floor(intermediate * MUL) / MUL;
          }
          props.onChange(intermediate);
        }
      }/>
    </InputContainer>
  )
}

const WheelSelect = styled.select`
  display: inline-block;
  height: 28px;
  width: 158px;
`;

interface SelectWheelProps {
  label: string
  value: string
  options: string[]
  setValue: (value: string) => void
}

export function SelectWheel(props: SelectWheelProps) {
  return (
    <InputContainer>
      <label>{props.label}</label>
      <WheelSelect onChange={(event) => props.setValue(event.target.value)} value={props.value}>
        {props.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
      </WheelSelect>
    </InputContainer>
  )
}


interface RoseParamProps {
  label: string
  value: string | number
}

export function RoseParam(props: RoseParamProps) {
  return (
    <ParamContainer>
      <label>{props.label} =</label>
      <span>{props.value}</span>
    </ParamContainer>
  );
}