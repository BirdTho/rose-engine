import React from 'react';
import wheels from './wheels'
import {RosePatternConfig} from "../types";
import * as THREE from 'three';
import {Vector3, CurvePath, LineCurve3, Curve, Line, BufferGeometry} from "three";
import moddedComputeFrenetFrames from '../geometry/moddedComputeFrenetFrames';
//import {ParametricGeometry} from "three/examples/jsm/geometries/ParametricGeometry";
import ModdedParametricGeometry from "../geometry/ModdedParametricGeometry";

function lerp(start: number, end: number, i: number): number {
  return start + (end - start) * i;
}

const SAFE_Z = 3; // mm
const PLUNGE_RATE = 200;

const SET_SPINDLE_SPEED = (speed: number) => `S${speed >> 0}M3`;

let oldX = 0;
let oldY = 0;
let oldZ = 0;
let oldF = 0;
const JOGMOVE = (x: number, y: number, z: number, f: number | null = null) => {
  const out = `G0${x !== oldX ? `X${x.toFixed(4)}` : ''}${y !== oldY ? `Y${y.toFixed(4)}` : ''}${z !== oldZ ? `Z${z.toFixed(4)}` : ''}${f && f !== oldF ? `F${f.toFixed(1)}` : ''}`;
  oldX = x;
  oldY = y;
  oldZ = z;
  if (f) {
    oldF = f;
  }
  return out;
};

const CUTMOVE = (x: number, y: number, z: number, f: number | null = null) => {
  const out = `G1${x !== oldX ? `X${x.toFixed(4)}` : ''}${y !== oldY ? `Y${y.toFixed(4)}` : ''}${z !== oldZ ? `Z${z.toFixed(4)}` : ''}${f && f !== oldF ? `F${f.toFixed(1)}` : ''}`;
  oldX = x;
  oldY = y;
  oldZ = z;
  if (f) {
    oldF = f;
  }
  return out;
};

export const STARTING_OPS = [
  'T1',
  'G17',
  'G21',
  'G90',
  `G0Z${SAFE_Z}`,
  'G0X0Y0',
];

export const ENDING_OPS = [
  JOGMOVE(oldX, oldY, SAFE_Z),
  'M5',
  JOGMOVE(oldX, oldY, SAFE_Z),
  JOGMOVE(0, 0, SAFE_Z),
  'M2',
];

const TWO_PI_BY_360 = Math.PI / 180;

class PatternSegment {
  params: RosePatternConfig

  drillProfile: THREE.Shape = new THREE.Shape()

  constructor(params: RosePatternConfig) {
    this.params = params;
  }

  generateInnerCurve(): Curve<Vector3> {
    let baseR = this.params.startingRadius;
    let phase = this.params.startingPhase;
    const zMag = this.params.startZMag;
    const rMag = this.params.startRMag;
    const rWheelCb = wheels[this.params.rWheel];
    const zWheelCb = wheels[this.params.zWheel];
    const startingDepth = this.params.startingDepth;
    let theta;
    let x, y, z;
    let r;

    const vectors: Vector3[] = [];
    const curvePath = new CurvePath<Vector3>();
    for (let j = 0; j <= 360; j += 1) {
      theta = TWO_PI_BY_360 * j;

      z = -startingDepth - zMag + zMag * zWheelCb(theta + phase);
      r = baseR + rMag * rWheelCb(theta + phase);
      x = Math.cos(theta) * r;
      y = Math.sin(theta) * r;
      vectors.push(new Vector3(x, y, z));

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
    return curvePath;
  }

  generateOuterCurve(): Curve<Vector3> {
    let phase = this.params.endingPhase;
    let baseR = this.params.endingRadius;
    const zMag = this.params.endZMag;
    const rMag = this.params.endRMag;
    const rWheelCb = wheels[this.params.rWheel];
    const zWheelCb = wheels[this.params.zWheel];
    const startingDepth = this.params.endingDepth;
    let theta;
    let r;
    let x, y, z;

    const vectors: Vector3[] = [];
    const curvePath = new CurvePath<Vector3>();
    for (let j = 0; j <= 360; j += 1) {
      theta = TWO_PI_BY_360 * j;

      z = -startingDepth - zMag + zMag * zWheelCb(theta + phase);
      r = baseR + rMag * rWheelCb(theta + phase);
      x = Math.cos(theta) * r;
      y = Math.sin(theta) * r;
      vectors.push(new Vector3(x, y, z));

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
    return curvePath;
  }

  generatePathsXYZ() {
    const {
      startingRadius,
      endingRadius,
      startingPhase,
      endingPhase,
      startingDepth,
      endingDepth,
      startZMag,
      endZMag,
      startRMag,
      endRMag,
      stepover,
      rWheel,
      zWheel
    } = this.params;

    const jogMoves: Vector3[][] = [];
    const cutMoves: Vector3[][] = [];

    const rWheelCb = wheels[rWheel];
    const zWheelCb = wheels[zWheel];
    let r;
    let theta;
    let x, y, z;

    const steps = Math.ceil((endingRadius - startingRadius) / stepover);

    let currentCut: Vector3[] = []
    let currentJog: Vector3[] = [];
    currentJog.push(new Vector3(0, 0, SAFE_Z));

    for (let i = 0; i <= steps; ++i) {
      let baseR = startingRadius + i * stepover;
      if (baseR > endingRadius) {
        baseR = endingRadius;
      }
      const lerpVar = (baseR - startingRadius) / (endingRadius - startingRadius);
      const zMag = lerp(startZMag, endZMag, lerpVar);
      const rMag = lerp(startRMag, endRMag, lerpVar);
      const phase = lerp(startingPhase, endingPhase, lerpVar) * TWO_PI_BY_360;
      const depth = lerp(startingDepth, endingDepth, lerpVar);

      z = -depth - zMag + zMag * zWheelCb(phase);
      r = baseR + rMag * rWheelCb(phase);
      x = r;
      y = 0;

      currentJog.push(new Vector3(r, 0, SAFE_Z));
      currentCut.push(new Vector3(r, 0, SAFE_Z));
      jogMoves.push(currentJog);
      currentJog = [];


      for (let j = 0; j <= 360; j += 0.5) {
        theta = TWO_PI_BY_360 * j;

        z = -depth - zMag + zMag * zWheelCb(theta + phase);
        r = baseR + rMag * rWheelCb(theta + phase);
        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r;

        currentCut.push(new Vector3(x, y, z));
      }
      currentJog.push(new Vector3(x, y, z));
      currentJog.push(new Vector3(x, y, SAFE_Z));

      cutMoves.push(currentCut);
      currentCut = [];


    }
    currentJog.push(new Vector3(0, 0, SAFE_Z));
    jogMoves.push(currentJog);

    return {
      jogMoves,
      cutMoves
    };
  }

  generatePathsLatheGeometry() {
    const {
      startingDepth,
      startingPhase,
      startRMag,
      startZMag,
      startingRadius,
      endingDepth,
      endingPhase,
      endRMag,
      endZMag,
      endingRadius,
      rWheel,
      zWheel,
      toolDiameter,
      tipAngle,
    } = this.params;
    const rWheelCb = wheels[rWheel];
    const zWheelCb = wheels[zWheel];
    const toolRadius = toolDiameter * 0.5;

    // aim to fix 0.5mm steps
    const steps = (endingRadius - startingRadius) * 2 + 1;

    //const steps = this.steps;
    const stacks = steps + 4;
    const slices = 360;

    const calculatedAngle = Math.sin((90 - (tipAngle / 2)) * (Math.PI / 180));
    let toolEdgeHeight = toolRadius * calculatedAngle;
    //const maxDepth = startingDepth + zMag;


    const innerCurve = this.generateInnerCurve();
    const outerCurve = this.generateOuterCurve();

    function drawPath(u: number, v: number, target: Vector3) {
      let startPoint, tangent;
      const stepIndex = Math.round(v * stacks);
      if (stepIndex < 4) {
        if (stepIndex < 2) {
          startPoint = outerCurve.getPointAt(u);
          tangent = outerCurve.getTangentAt(u);
        } else {
          startPoint = innerCurve.getPointAt(u);
          tangent = innerCurve.getTangentAt(u);
        }
        tangent.z = 0;
        tangent.normalize();
        if (stepIndex < 2) {
          tangent.cross(new Vector3(0, 0, 1));
        } else {
          tangent.cross(new Vector3(0, 0, -1));
        }
        tangent.normalize();
        startPoint.add(tangent.multiplyScalar(toolRadius)).add(new Vector3(0, 0, toolEdgeHeight));
        if ((stepIndex === 1 || stepIndex === 2) && startPoint.z <= 0) {
          startPoint.z = 0.1;
        }
        target.set(startPoint.x, startPoint.y, startPoint.z);
      } else {
        let r, x, y, z;
        let theta;

        const stepInterp = (stepIndex - 4) / (steps - 1);
        const zMag = lerp(startZMag, endZMag, stepInterp);
        const rMag = lerp(startRMag, endRMag, stepInterp);
        const phase = lerp(startingPhase, endingPhase, stepInterp) * TWO_PI_BY_360;
        const depth = lerp(startingDepth, endingDepth, stepInterp);

        theta = 2 * Math.PI * u;
        z = -depth - zMag + zMag * zWheelCb(theta + phase);
        r = startRMag + rMag * rWheelCb(theta + phase);
        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r;
        target.set(x, y, z);
      }
    }

    return new ModdedParametricGeometry(drawPath, slices, stacks);
  }

  generateToolpath(): string[] {
    const moves: string[] = [];

    const {
      startingRadius,
      endingRadius,
      startingPhase,
      endingPhase,
      startingDepth,
      endingDepth,
      startZMag,
      endZMag,
      startRMag,
      endRMag,
      stepover,
      speed,
      rWheel,
      zWheel
    } = this.params;


    const rWheelCb = wheels[rWheel];
    const zWheelCb = wheels[zWheel];
    let r;
    let theta;
    let x, y, z;

    const steps = Math.ceil((endingRadius - startingRadius) / stepover);

    const curves: CurvePath<Vector3>[] = [];
    for (let i = 0; i <= steps; ++i) {
      let baseR = startingRadius + i * stepover;
      if (baseR > endingRadius) {
        baseR = endingRadius;
      }
      const lerpVar = (baseR - startingRadius) / (endingRadius - startingRadius);
      const zMag = lerp(startZMag, endZMag, lerpVar);
      const rMag = lerp(startRMag, endRMag, lerpVar);
      const phase = lerp(startingPhase, endingPhase, lerpVar) * TWO_PI_BY_360;
      const depth = lerp(startingDepth, endingDepth, lerpVar);

      z = -depth - zMag + zMag * zWheelCb(phase);
      r = baseR + rMag * rWheelCb(phase);

      moves.push(JOGMOVE(r, 0, oldZ));
      moves.push(CUTMOVE(r, 0, z, PLUNGE_RATE));
      for (let j = 0; j <= 360; j += 0.5) {
        theta = TWO_PI_BY_360 * j;

        z = -depth - zMag + zMag * zWheelCb(theta + phase);
        r = baseR + rMag * rWheelCb(theta + phase);
        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r;

        moves.push(CUTMOVE(x, y, z, speed));
      }
      moves.push(JOGMOVE(r, 0, SAFE_Z));
    }
    return moves;
  }
}

export default PatternSegment