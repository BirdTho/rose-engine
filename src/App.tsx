import React from "react";
import {Page, RowContainer} from "./Components/elements";
//import PreviewGraph from "./Components/PreviewGraph";
import PatternList from "./Components/PatternList";
import ThreeJSView from "./Components/ThreeJSViewToolpaths";

function App() {
  return (
    <Page>
      <RowContainer>
        {/*<ThreeJSView/>*/}
        <ThreeJSView/>
        {/*<PreviewGraph/>*/}
        <PatternList />
      </RowContainer>
    </Page>
  );
}

export default App;
