import {atom} from "recoil";
import {RosePatternConfig} from "../types";

export const activeRosePatternsAtom = atom<RosePatternConfig[]>({
  key: 'active rose patterns',
  default: [
    {
      "zWheel": "sine12",
      "zMag": 0.4,
      "endingRadius": 24,
      "phaseStepover": 0.1,
      "rpm": 10000,
      "rWheel": "sine12",
      "rMag": 0.5,
      "speed": 500,
      "steps": 10,
      "stepover": 0.2,
      "startingDepth": 0.2,
      "startingPhase": 0,
      "startingRadius": 20,
      "toolDiameter": 3.175,
      "tipAngle": 120
    },
    // {
    //   "zWheel": "sine12",
    //   "zMag": 0.4,
    //   "endingRadius": 15,
    //   "phaseStepover": 0,
    //   "rpm": 10000,
    //   "rWheel": "sine12",
    //   "rMag": 0.5,
    //   "speed": 500,
    //   "steps": 9,
    //   "stepover": 0.2,
    //   "startingDepth": 0.3,
    //   "startingPhase": 0,
    //   "startingRadius": 10,
    //   "toolDiameter": 3.175,
    //   "tipAngle": 120
    // }
  ]
});

export const selectedRosePatternAtom = atom<number | null>({
  key: 'selected rose pattern',
  default: null,
});