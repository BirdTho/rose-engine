import React from 'react';
import {useRecoilValue} from "recoil";
import {activeRosePatternsAtom, patternNameAtom} from "../state/activeRosePatterns";
import saveAs from '../utility/FileSaver';

export default function SaveJSON() {
  const activePatterns = useRecoilValue(activeRosePatternsAtom);
  const patternName = useRecoilValue(patternNameAtom);

  const onClick = () => {
    var json = JSON.stringify(activePatterns, null, 2);
    var blob = new Blob([json], {type:"application/json;charset=utf-8"});
    saveAs(blob, `saved-${patternName}.json`);
  }

  return (
    <button onClick={onClick}>Save as saved-{patternName}.json</button>
  )
}