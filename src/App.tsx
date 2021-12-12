import React from "react";
import {ColumnContainer, Page, RowContainer} from "./Components/elements";
import PreviewGraph from "./Components/PreviewGraph";
import PatternList from "./Components/PatternList";
import ThreeJSView from "./Components/ThreeJSView";

function App() {
  return (
    <Page>
      <RowContainer>
        <ThreeJSView/>
        {/*<PreviewGraph/>*/}
        <PatternList />
      </RowContainer>
    </Page>
  );
}

export default App;
