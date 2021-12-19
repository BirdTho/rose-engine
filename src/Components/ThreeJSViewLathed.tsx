import React, {useEffect, useMemo, useState} from 'react';
import {ColumnContainer} from "./elements";
// @ts-ignore
import CSG from '@alancnet/three-csg';

//import randomcolor from 'randomcolor';

import {Canvas} from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {useRecoilState, useRecoilValue} from "recoil";
import {activeRosePatternsAtom, patternNameAtom} from "../state/activeRosePatterns";
import {RosePatternConfig} from "../types";
import PatternSegment from "../rose/rose-engine";
import {
  BufferGeometry,
  Material,
  Mesh,
  Vector3,
  BoxGeometry,
  MeshNormalMaterial,
} from "three";
import SaveJSON from "./SaveJSON";
import LoadPattern from "./LoadPattern";

export default function ThreeJSView() {
  const [width, setWidth] = useState(window.innerWidth >> 1);
  const [height, setHeight] = useState(Math.floor(window.innerHeight - 220));
  const [updating, setUpdating] = useState(false);
  const [patternName, setPatternName] = useRecoilState(patternNameAtom);

  const activeRosePatterns = useRecoilValue(activeRosePatternsAtom);
  const patterns = useMemo<PatternSegment[]>(() => activeRosePatterns.map(pattern => new PatternSegment(pattern)), [activeRosePatterns]);
  const extrudes = useMemo(() => {
    let geometry;
    let mesh;
    let output: Mesh[] = []
    let k = 0;
    for (let i = 0; i < patterns.length; ++i) {
      console.log('Making ' + k + 'th ring');
      geometry = patterns[i].generatePathsLatheGeometry();
      geometry.computeVertexNormals();
      mesh = new Mesh(geometry, new MeshNormalMaterial());
      mesh.updateMatrix();
      output.push(mesh);
    }
    return output;
  }, [patterns]);
  const [outputMesh, setOutputMesh] = useState<Mesh>(new Mesh(new BoxGeometry(100, 100, 20, 40, 40, 1)))

  useEffect(() => {
    setUpdating(true);
    setTimeout(() => {
      const box = new BoxGeometry(100, 100, 20, 40, 40, 1);
      const mesh = new Mesh(box, new MeshNormalMaterial());
      mesh.translateZ(-10);
      mesh.updateMatrix();
      const csgBox = CSG.fromMesh(mesh, 0);
      let output = csgBox;
      let extrud = CSG.fromMesh(extrudes[0]);
      console.log('beginning unions, ', extrudes.length - 1);
      for (let i = 1; i < extrudes.length; ++i) {
        extrud = extrud.union(CSG.fromMesh(extrudes[i]));
        console.log('completed union ', i);
      }
      output = output.subtract(extrud);
      setOutputMesh(CSG.toMesh(output));
      setUpdating(false);
    }, 1000);
  }, [extrudes]);

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
      <ColumnContainer style={{height: '200px', width: '100%', padding: '20px', gap: '10px'}}>
        <div>
          <label htmlFor="pattern-name-input">Pattern Name: </label>
          <input
            id="pattern-name-input"
            type="text"
            value={patternName}
            onChange={(e) => setPatternName(e.target.value)}
          />
        </div>
        <div>
          <span>Status: </span>{updating ? <span>Updating...</span> : <span>Update complete</span>}
        </div>
        <div><SaveJSON /></div>
        <div><LoadPattern/></div>
      </ColumnContainer>
      <Canvas style={{height: (height + 'px'), width: (width + 'px')}}>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={new Vector3(0, 0, 10)}

          up={new Vector3(0, 0, 1)}
        />

        {/*<pointLight position={[0, 100, 100]} color={'#00DD00'}/>*/}
        {/*<pointLight position={[100, 0, 100]} color={'#DD0000'}/>*/}
        {/*<pointLight position={[0, 0, 100]} color={'#0000DD'}/>*/}
        {/*{activeRosePatterns.map(rosePattern => <RoseToolPath boxRef={boxRef as any} pattern={rosePattern}/>)}*/}
        {/*<Box position={[-1.2, 0, 0]} />*/}
        {/*<Box position={[1.2, 0, 0]} />*/}
        {/*<mesh position={[0,0,-10]}>*/}
        {/*  <boxGeometry args={[100, 100, 20]}/>*/}
        {/*  <meshPhongMaterial color={'pink'}/>*/}
        {/*</mesh>*/}

        {/*<mesh geometry={patterns[0].generatePathsLatheGeometry()}>*/}
        {/*  <meshPhongMaterial color={'#88DDFF'}/>*/}
        {/*</mesh>*/}
        <mesh geometry={outputMesh.geometry} castShadow={false}>
          <meshNormalMaterial />
          {/*<meshPhongMaterial color={'#88DDFF'} reflectivity={0.8}  specular={new Color(255, 190, 90)}/>*/}
          {/*<lineSegments>*/}
          {/*  <edgesGeometry args={[combined.geometry, 0]}></edgesGeometry>*/}
          {/*  <lineBasicMaterial color={'red'}/>*/}
          {/*</lineSegments>*/}
        </mesh>
        {/*<lineSegments>*/}
        {/*  <edgesGeometry args={[patterns[0].generatePathsLatheGeometry(), 0]}>*/}

        {/*  </edgesGeometry>*/}
        {/*  <lineBasicMaterial color={'red'}/>*/}
        {/*</lineSegments>*/}
        {/*{extrudes.map((extr, i) => (<mesh key={i} geometry={extr.geometry} >*/}
        {/*  <meshPhongMaterial color={randomcolor()}/>*/}
        {/*</mesh>))}*/}
      </Canvas>
    </ColumnContainer>
  )
}