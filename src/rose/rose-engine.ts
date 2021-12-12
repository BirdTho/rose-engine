import wheels from './wheels'
import {RosePatternConfig} from "../types";
import * as THREE from 'three';
import {Vector3, CurvePath, LineCurve3} from "three";
import moddedComputeFrenetFrames from '../geometry/moddedComputeFrenetFrames';

class PatternSegment {
  rWheel: string = ''
  zWheel: string = ''
  stepover: number = 0.2 // mm/step
  startingPhase: number = 0.0 // radians
  phaseStepover: number = 0.0 // radians/step
  speed: number = 500 // mm/min
  rpm: number = 10000
  startingRadius: number = 0 // mm
  startingDepth: number = 0.3 // mm

  steps: number = 0 // raw number of stepovers
  endingRadius: number = 0 // mm

  toolDiameter: number = 3.175 // mm diameter
  tipAngle: number = 120.0 // angle

  zMag: number = 0.4 // Max variation between highest and lowest values
  rMag: number = 1.5 // Max radial variation for the wheel

  drillProfile: THREE.Shape = new THREE.Shape()

  constructor(params: RosePatternConfig) {
    this.rWheel = params.rWheel;
    this.zWheel = params.zWheel;
    this.stepover = params.stepover;
    this.startingPhase = params.startingPhase;
    this.phaseStepover = params.phaseStepover;
    this.speed = params.speed;
    this.rpm = params.rpm;
    this.startingRadius = params.startingRadius;
    this.startingDepth = params.startingDepth;

    this.steps = params.steps; // give number of stepovers
    this.endingRadius = params.endingRadius; // or derive from stepover and starting radius

    this.zMag = params.zMag; // Max variation between highest and lowest values
    this.rMag = params.rMag; // Max radial variation for the wheel

    this.toolDiameter = params.toolDiameter; // mm diameter
    this.tipAngle = params.tipAngle; // angle
  }

  generatePathRTheta() {
    let baseR = this.startingRadius;
    let phase = this.startingPhase;
    const zMag = this.zMag;
    const rMag = this.rMag;
    const TWO_PI_BY_360 = Math.PI / 180;
    const rWheelCb = wheels[this.rWheel];
    const zWheelCb = wheels[this.zWheel];
    const startingDepth = this.startingDepth;
    let z;
    let r;
    let theta;

    let thetaPoints = [];
    let rPoints = [];

    for (let i = 0; i < this.steps; ++i) {
      for (let j = 0; j <= 360; j += 0.5) {
        theta = TWO_PI_BY_360 * j;

        z = -startingDepth - zMag + zMag * zWheelCb(theta + phase);
        r = baseR + rMag * rWheelCb(theta + phase);

        rPoints.push(r);
        thetaPoints.push(theta);

        // x = r * Math.cos(theta);
        // y = r * Math.sin(theta);
      }
      baseR += this.stepover;
      phase += this.phaseStepover;
    }

    return {
      theta: thetaPoints,
      r: rPoints,
    }
  }

  generateToolProfile() {
    const tipAngle = this.tipAngle;
    const toolDiameter = this.toolDiameter;
    const startingDepth = this.startingDepth;
    const zMag = this.zMag;
    const threshold = zMag + startingDepth;

    let toolRadius = toolDiameter * 0.5;
    const calculatedAngle = Math.sin((90 - (tipAngle / 2)) * (Math.PI / 180));
    let toolEdgeHeight = toolRadius * calculatedAngle;

    let slimmedTool = false;

    if (toolEdgeHeight > threshold + 0.1) {
      slimmedTool = true;
      toolRadius = threshold + 0.1 / calculatedAngle;
      toolEdgeHeight = threshold + 0.1;
    }

    const drillProfile = new THREE.Shape();
    drillProfile.moveTo(0,0);
    drillProfile.lineTo(-toolEdgeHeight, toolRadius);
    if (threshold > toolEdgeHeight && !slimmedTool) {
      drillProfile.lineTo(-threshold - 0.1, toolRadius);
      drillProfile.lineTo(-threshold - 0.1, -toolRadius);
    }
    drillProfile.lineTo(-toolEdgeHeight, -toolRadius);
    drillProfile.lineTo(0, 0);

    this.drillProfile = drillProfile;
    return drillProfile;
  }

  generatePathsXYZ() {
    let baseR = this.startingRadius;
    let phase = this.startingPhase;
    const zMag = this.zMag;
    const rMag = this.rMag;
    const TWO_PI_BY_360 = Math.PI / 180;
    const rWheelCb = wheels[this.rWheel];
    const zWheelCb = wheels[this.zWheel];
    const startingDepth = this.startingDepth;
    let r;
    let theta;
    let x, y, z;

    let thetaPoints = [];
    let rPoints = [];

    const curves: CurvePath<Vector3>[] = [];
    for (let i = 0; i < this.steps; ++i) {
      const vectors: Vector3[] = [];
      const curvePath = new CurvePath<Vector3>();
      curvePath.autoClose = true;
      for (let j = 0; j <= 360; j += 0.5) {
        theta = TWO_PI_BY_360 * j;

        z = -startingDepth - zMag + zMag * zWheelCb(theta + phase);
        r = baseR + rMag * rWheelCb(theta + phase);
        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r;
        vectors.push(new Vector3(x, y, z));

        if (j === 0) {
          console.log('r = ', r);
        }

        // x = r * Math.cos(theta);
        // y = r * Math.sin(theta);
      }
      let lastVector = vectors[0];
      for (let i = 1; i < vectors.length; ++i) {
        const vector = vectors[i];
        curvePath.add(new LineCurve3(lastVector, vector));
        lastVector = vector;
      }
      curvePath.add(new LineCurve3(lastVector, vectors[0]));
      curvePath.closePath();
      curvePath.computeFrenetFrames = moddedComputeFrenetFrames;
      curves.push(curvePath);
      baseR += this.stepover;
      phase += this.phaseStepover;
    }
    console.log('Curvecount = ' + curves.length)
    return curves;
  }
}

export default PatternSegment