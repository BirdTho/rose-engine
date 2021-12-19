import React, {ChangeEvent, memo, useMemo, useState} from "react";
import {useSetRecoilState} from "recoil";
import {activeRosePatternsAtom, patternNameAtom} from "../state/activeRosePatterns";
import {RosePatternConfig} from "../types";

export default React.memo(function LoadPattern() {
  const setActivePattern = useSetRecoilState(activeRosePatternsAtom);
  const setPatternName = useSetRecoilState(patternNameAtom);
  const [fName, setFName] = useState('');
  const [parsedJSON, setParsedJSON] = useState<null | RosePatternConfig[]>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const isDisabled = useMemo(() => {
    if (parsedJSON && !isLoaded) {
      return false;
    }
    return true;
  }, [isLoaded, parsedJSON]);

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoaded(false);
    const files = event.target.files;
    if (files?.length) {
      const firstFile = files.item(0);
      if (firstFile) {
        try {
          const textContent = await firstFile.text();
          const parsedContents = JSON.parse(textContent) as RosePatternConfig[];
          let name = firstFile.name;
          if (name.indexOf('saved-') === 0) {
            name = name.substring(6);
          }
          if (name.indexOf('.json') > 1) {
            name = name.substring(0, name.length - 5);
          }
          setFName(name);
          setParsedJSON(parsedContents);
        } catch (err) {
        }
      }
    }
  };

  const onClick = () => {
    setPatternName(fName);
    setActivePattern(parsedJSON as RosePatternConfig[]);
    setParsedJSON(null);
    setIsLoaded(true);
  };

  return (
    <div>
      <label htmlFor="json-file-loader">Choose a file: </label>
      <input id="json-file-loader" type="file" accept="application/json,text/json,.json" onChange={onFileSelected}/>
      <button disabled={isDisabled} onClick={onClick}>Load file {fName}</button>
    </div>
  )
});