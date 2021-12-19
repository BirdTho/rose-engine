import {atom} from "recoil";
import {RosePatternConfig} from "../types";

export const activeRosePatternsAtom = atom<RosePatternConfig[]>({
  key: 'active rose patterns',
  default: [
    {
      zWheel: "sine12",
      startZMag: 0.4,
      endZMag: 0.4,
      endingRadius: 24,
      endingPhase: 0,
      rpm: 10000,
      rWheel: "sine12",
      startRMag: 0.5,
      endRMag: 0.5,
      speed: 500,
      stepover: 0.05,
      startingDepth: 0.2,
      endingDepth: 0.2,
      startingPhase: 0,
      startingRadius: 20,
      toolDiameter: 3.175,
      tipAngle: 120
    },
    // {
    //   "zWheel": "sine12",
    //   "zMag": 0.4,
    //   "endingRadius": 15,
    //   "endingPhase": 0,
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

export const patternNameAtom = atom<string>({
  key: 'pattern name',
  default: 'untitled',
});