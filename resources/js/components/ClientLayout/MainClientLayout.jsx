import React from "react";
import Navbars from "./NavBars";
import HeaderClient from "./HeaderClient";
import FooterClient from "./FooterClient";
import Contents from "@/views/sections/Contents";

import "../../styles/scss/paper-kit.scss?v=1.3.0";
import "../../styles/demo/demo.css?v=1.3.0";
function MainClientLayout(props) {
    const { children } = props;
    return (
        <>
            <Navbars />
            <HeaderClient />
            <div className="main">
                {children}
                <Contents />
                <FooterClient />
            </div>
        </>
    );
}

export default MainClientLayout;
