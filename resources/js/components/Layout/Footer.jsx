import React from "react";
import { Navbar, Nav, NavItem } from "reactstrap";
import Notifications from "react-notification-system-redux";
import { NOTIFICATION_SYSTEM_STYLE } from "@/utils/constants";
import { useSelector } from "react-redux";

const Footer = () => {
    const setting = useSelector((state) => state.Setting);

    const notifications = useSelector((state) => state.notifications);
    return (
        <Navbar>
            <Nav navbar>
                <NavItem>{setting.data.email || ""}</NavItem>
                {/* <NavItem>{setting.data.phone || ""}</NavItem> */}
            </Nav>
            <Notifications notifications={notifications} style={NOTIFICATION_SYSTEM_STYLE} />
        </Navbar>
    );
};

export default Footer;
