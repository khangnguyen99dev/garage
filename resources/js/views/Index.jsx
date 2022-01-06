import React from "react";
import Carousels from "./sections/Carousels";
import Indexs from "./sections";
import Example from "./sections/Example";
function Index(props) {
    return (
        <div>
            <Carousels />
            <Indexs />
            <Example />
        </div>
    );
}

export default Index;
