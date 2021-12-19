import React, {useEffect, useMemo, useState} from 'react';
import {ColumnContainer} from "./elements";
import {Canvas} from "@react-three/fiber";
import {Line, OrbitControls} from "@react-three/drei";
import {useRecoilState, useRecoilValue} from "recoil";
import {activeRosePatternsAtom, patternNameAtom} from "../state/activeRosePatterns";
import {RosePatternConfig} from "../types";
import PatternSegment from "../rose/rose-engine";
import {
  BufferGeometry,
  Vector3,
} from "three";
import SaveJSON from "./SaveJSON";
import LoadPattern from "./LoadPattern";
import SaveToolpath from "../utility/SaveToolpath";

export default function ThreeJSView() {
  const [width, setWidth] = useState(window.innerWidth >> 1);
  const [height, setHeight] = useState(Math.floor(window.innerHeight - 220));
  //const [updating, setUpdating] = useState(false);
  const [patternName, setPatternName] = useRecoilState(patternNameAtom);

  const activeRosePatterns = useRecoilValue(activeRosePatternsAtom);
  const patterns = useMemo<PatternSegment[]>(() => activeRosePatterns.map(pattern => new PatternSegment(pattern)), [activeRosePatterns]);
  const lines = useMemo(() => {
    let cutMoves: Vector3[][] = [];
    let jogMoves: Vector3[][] = [];
    for (let i = 0; i < patterns.length; ++i) {
      const toolPaths = patterns[i].generatePathsXYZ();
      cutMoves = cutMoves.concat(toolPaths.cutMoves);
      jogMoves = jogMoves.concat(toolPaths.jogMoves);
    }
    return {
      cutMoves,
      jogMoves
    };
  }, [patterns]);

  // useEffect(() => {
  //   setUpdating(true);
  //   setTimeout(() => {
  //     const box = new BoxGeometry(100, 100, 20, 40, 40, 1);
  //     const mesh = new Mesh(box, new MeshNormalMaterial());
  //     mesh.translateZ(-10);
  //     mesh.updateMatrix();
  //     const csgBox = CSG.fromMesh(mesh, 0);
  //     let output = csgBox;
  //     let extrud = CSG.fromMesh(extrudes[0]);
  //     console.log('beginning unions, ', extrudes.length - 1);
  //     for (let i = 1; i < extrudes.length; ++i) {
  //       extrud = extrud.union(CSG.fromMesh(extrudes[i]));
  //       console.log('completed union ', i);
  //     }
  //     output = output.subtract(extrud);
  //     setOutputMesh(CSG.toMesh(output));
  //     setUpdating(false);
  //   }, 1000);
  // }, [extrudes]);

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
          {/*<span>Status: </span>{updating ? <span>Updating...</span> : <span>Update complete</span>}*/}
        </div>
        <div><SaveJSON /></div>
        <div><LoadPattern/></div>
        <div><SaveToolpath/></div>
      </ColumnContainer>
      <Canvas style={{height: (height + 'px'), width: (width + 'px')}}>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={new Vector3(0, 0, 10)}

          up={new Vector3(0, 0, 1)}
        />

        {lines.cutMoves.map((buf, i) => (
          <Line points={buf} key={i} color={'#44FF44'}>
            <lineBasicMaterial color={'#44FF44'} />
          </Line>
        ))}
        {lines.jogMoves.map((buf, i) => (
          <Line points={buf} key={i} color={'#FF4444'}>
            <lineBasicMaterial color={'#FF4444'} />
          </Line>
        ))}
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