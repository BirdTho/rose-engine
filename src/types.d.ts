
export type Wheel = (theta: number) => number;

export interface RosePatternConfig {
  rWheel: string
  zWheel: string
  stepover: number // mm/step
  startingPhase: number // radians
  endingPhase: number // radians/step
  startingRadius: number // mm
  endingRadius: number // mm

  speed: number // mm/min
  rpm: number

  startingDepth: number // mm
  endingDepth: number
  toolDiameter: number // mm diameter
  tipAngle: number // angle

  startZMag: number // Max variation between highest and lowest values
  endZMag: number
  startRMag: number // Max radial variation for the wheel
  endRMag: number
}