
export type Wheel = (theta: number) => number;

export interface RosePatternConfig {
  rWheel: string
  zWheel: string
  stepover: number // mm/step
  startingPhase: number // radians
  phaseStepover: number // radians/step
  startingRadius: number // mm

  speed: number // mm/min
  rpm: number

  startingDepth: number // mm
  toolDiameter: number // mm diameter
  tipAngle: number // angle

  steps: number // raw number of stepovers
  endingRadius: number // mm

  zMag: number // Max variation between highest and lowest values
  rMag: number // Max radial variation for the wheel
}