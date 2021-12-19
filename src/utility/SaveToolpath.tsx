import PatternSegment, { STARTING_OPS, ENDING_OPS } from "../rose/rose-engine";
import React from "react";
import {activeRosePatternsAtom, patternNameAtom} from "../state/activeRosePatterns";
import {useRecoilValue} from "recoil";
import saveAs from "./FileSaver";

export default function SaveToolpath() {
  const activeRosePatterns = useRecoilValue(activeRosePatternsAtom);
  const patternName = useRecoilValue(patternNameAtom);

  const makeToolpath = (): string[] => {
    let toolPath: string[] = [...STARTING_OPS];
    for (let i = 0; i < activeRosePatterns.length; ++i) {
      const pattern = new PatternSegment(activeRosePatterns[i]);
      toolPath = toolPath.concat(pattern.generateToolpath());
    }
    return toolPath.concat(ENDING_OPS);
  };
  const saveOnClick = () => {
    const tp = makeToolpath();
    var blob = new Blob([tp.join('\n')], {type:"text/plain;charset=ascii"});
    saveAs.saveAs(blob, `${patternName}.gcode`)
  }

  return (
    <button onClick={saveOnClick}>Save Toolpath to {patternName}.gcode</button>
  )
}