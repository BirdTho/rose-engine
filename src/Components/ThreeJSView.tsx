import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ColumnContainer, RowContainer} from "./elements";
import { CSG } from 'three-csg-ts';
import randomcolor from 'randomcolor';

import {Canvas, useFrame} from "@react-three/fiber";
import { OrbitControls, Extrude } from "@react-three/drei";
import {useRecoilValue} from "recoil";
import {activeRosePatternsAtom} from "../state/activeRosePatterns";
import {RosePatternConfig} from "../types";
import PatternSegment from "../rose/rose-engine";
import {
  BufferGeometry,
  CatmullRomCurve3,
  Curve,
  Material,
  Mesh,
  Shape,
  Vector3,
  ExtrudeGeometry,
  BoxGeometry, MeshPhongMaterial
} from "three";

const defaultRosePathSettings = {
  steps: 120,
  depth: 0,
  bevelEnabled: false,
  bevelThickness: 0,
  bevelSize: 0,
  bevelOffset: 0,
  bevelSegments: 0,
}

interface RoseToolPathProps {
  pattern: RosePatternConfig,
  boxRef: React.MutableRefObject<Mesh<BufferGeometry, Material | Material[]>>,
}

export default function ThreeJSView() {
  const boxRef = useRef<Mesh<BufferGeometry, Material | Material[]>>(null);

  const [width, setWidth] = useState(window.innerWidth >> 1);
  const [height, setHeight] = useState(Math.floor(window.innerHeight - 220));

  const activeRosePatterns = useRecoilValue(activeRosePatternsAtom);
  const patterns = useMemo<PatternSegment[]>(() => activeRosePatterns.map(pattern => new PatternSegment(pattern)), [activeRosePatterns]);
  const toolProfiles = useMemo<Shape[]>(() => patterns.map(pattern => pattern.generateToolProfile()), [patterns]);
  const curves = useMemo<Curve<Vector3>[][]>(() => patterns.map(pattern => pattern.generatePathsXYZ()), [patterns]);

  const extrudes = useMemo(() => {
    let geometry;
    let mesh;
    let output: Mesh[] = []
    let k = 0;
    for (let i = 0; i < patterns.length; ++i) {
      const patternCurves = curves[i];
      for (let j = 0; j < patternCurves.length; ++j) {
        ++k;
        console.log('Making ' + k + 'th ring');
        geometry = new ExtrudeGeometry(toolProfiles[i], {...defaultRosePathSettings, extrudePath: patternCurves[j]})
        mesh = new Mesh(geometry, new MeshPhongMaterial({ color: randomcolor()}));
        mesh.updateMatrix();
        output.push(mesh);
      }
    }
    return output;
  }, [patterns])

  const combined = useMemo(() => {
    const box = new BoxGeometry(100, 100, 20);
    const mesh = new Mesh(box);
    mesh.translateZ(-10);
    mesh.updateMatrix();
    let output: Mesh = mesh;
    let extrud = extrudes[0];
    console.log('beginning unions, ', extrudes.length - 1);
    for (let i = 1; i < extrudes.length; ++i) {
      extrud = CSG.union(extrud, extrudes[i]);
      console.log('completed union ', i);
      extrud.updateMatrix();
    }
    output = CSG.subtract(output, extrud);
    console.log('Completed main subtraction');
    output.updateMatrix();
    return output;
  }, [extrudes])

  const updateSize = () => {
    setWidth(window.innerWidth >> 1);
    setHeight(Math.floor(window.innerHeight - 220));
  }

  useEffect(() => {
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <ColumnContainer style={{width: '50%', height: '60%'}}>
      <RowContainer style={{height: '200px', width: '100%'}}>

      </RowContainer>
      <Canvas style={{height: (height + 'px'), width: (width + 'px')}}>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, 10]} />
        <pointLight position={[10, -10, -10]} />
        <pointLight position={[-10, 10, -10]} />
        {/*{activeRosePatterns.map(rosePattern => <RoseToolPath boxRef={boxRef as any} pattern={rosePattern}/>)}*/}
        {/*<Box position={[-1.2, 0, 0]} />*/}
        {/*<Box position={[1.2, 0, 0]} />*/}
        {/*<mesh position={[0,0,-10]}>*/}
        {/*  <boxGeometry args={[100, 100, 20]}>*/}
        {/*  </boxGeometry>*/}
        {/*  <meshPhongMaterial color={'pink'}/>*/}
        {/*</mesh>*/}

        <mesh geometry={combined.geometry}>
          <meshPhongMaterial color={'#444444'}/>
        </mesh>
        {extrudes.map((extr, i) => (<mesh key={i} geometry={extr.geometry} position={[Math.random() * 4,Math.random() * 4, Math.random() * 4]}>
          <meshPhongMaterial color={randomcolor()}/>
        </mesh>))}
      </Canvas>
    </ColumnContainer>
  )
}