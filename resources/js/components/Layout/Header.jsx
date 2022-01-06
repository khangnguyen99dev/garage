import Avatar from "@/components/Avatar";
import { UserCard } from "@/components/Card";
import Notifications from "@/components/Notifications";
import SearchInput from "@/components/SearchInput";
import { notificationsData } from "@/demos/header";
import withBadge from "@/hocs/withBadge";
import React, { useState } from "react";
import * as actions from "@/store/actions";
import { NavLink as RRNavLink } from "react-router-dom";
import {
    MdClearAll,
    MdExitToApp,
    MdHelp,
    MdInsertChart,
    MdMessage,
    MdNotificationsActive,
    MdNotificationsNone,
    MdPersonPin,
    MdSettingsApplications,
} from "react-icons/md";
import {
    Button,
    ListGroup,
    ListGroupItem,
    Nav,
    Navbar,
    NavItem,
    NavLink,
    Popover,
    PopoverBody,
} from "reactstrap";
import bn from "@/utils/bemnames";
import { useDispatch, useSelector } from "react-redux";

const bem = bn.create("header");

const MdNotificationsActiveWithBadge = withBadge({
    size: "md",
    color: "primary",
    style: {
        top: -10,
        right: -10,
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
    },
    children: <small>5</small>,
})(MdNotificationsActive);

function Header() {
    const dispatchs = useDispatch();

    const auth = useSelector((state) => state.Auth);

    const [state, setState] = useState({
        isOpenNotificationPopover: false,
        isNotificationConfirmed: false,
        isOpenUserCardPopover: false,
    });

    const toggleNotificationPopover = () => {
        setState({
            isOpenNotificationPopover: !state.isOpenNotificationPopover,
        });

        if (!state.isNotificationConfirmed) {
            setState({ isNotificationConfirmed: true });
        }
    };

    const toggleUserCardPopover = () => {
        setState({
            isOpenUserCardPopover: !state.isOpenUserCardPopover,
        });
    };

    const handleSidebarControlButton = (event) => {
        event.preventDefault();
        event.stopPropagation();
        document.querySelector(".cr-sidebar").classList.toggle("cr-sidebar--open");
    };

    const logout = (e) => {
        dispatchs(actions.authLogout());
    };

    const { isNotificationConfirmed } = state;

    return (
        <Navbar light expand className={bem.b("bg-white")}>
            <Nav navbar className="mr-2">
                <Button outline onClick={handleSidebarControlButton}>
                    <MdClearAll size={25} />
                </Button>
            </Nav>
            <Nav navbar>
                <SearchInput />
            </Nav>

            <Nav navbar className={bem.e("nav-right")}>
                <NavItem className="d-inline-flex">
                    <NavLink id="Popover1" className="position-relative">
                        {isNotificationConfirmed ? (
                            <MdNotificationsNone
                                size={25}
                                className="text-secondary can-click"
                                onClick={toggleNotificationPopover}
                            />
                        ) : (
                            <MdNotificationsActiveWithBadge
                                size={25}
                                className="text-secondary can-click animated swing infinite"
                                onClick={toggleNotificationPopover}
                            />
                        )}
                    </NavLink>
                    <Popover
                        placement="bottom"
                        isOpen={state.isOpenNotificationPopover}
                        toggle={toggleNotificationPopover}
                        target="Popover1"
                    >
                        <PopoverBody>
                            <Notifications notificationsData={notificationsData} />
                        </PopoverBody>
                    </Popover>
                </NavItem>

                <NavItem>
                    <NavLink id="Popover2">
                        <Avatar onClick={toggleUserCardPopover} className="can-click" />
                    </NavLink>
                    <Popover
                        placement="bottom-end"
                        isOpen={state.isOpenUserCardPopover}
                        toggle={toggleUserCardPopover}
                        target="Popover2"
                        className="p-0 border-0"
                        style={{ minWidth: 250 }}
                    >
                        <PopoverBody className="p-0 border-light">
                            <UserCard
                                title={auth.user.name}
                                subtitle={auth.user.email}
                                text={auth.user.phone}
                                className="border-light"
                            >
                                <ListGroup flush>
                                    <ListGroupItem
                                        to="/admin/info"
                                        exact
                                        tag={RRNavLink}
                                        action
                                        className="border-light"
                                    >
                                        <MdPersonPin /> Thông tin
                                    </ListGroupItem>
                                    <ListGroupItem
                                        to="/admin"
                                        exact
                                        tag={RRNavLink}
                                        action
                                        className="border-light"
                                    >
                                        <MdInsertChart /> Thống kê
                                    </ListGroupItem>
                                    {/* <ListGroupItem tag="button" action className="border-light">
                                        <MdMessage /> Thông điệp
                                    </ListGroupItem> */}
                                    {auth.user.email == "admin@gmail.com" && (
                                        <ListGroupItem
                                            to="/admin/setting"
                                            exact
                                            tag={RRNavLink}
                                            action
                                            className="border-light"
                                        >
                                            <MdSettingsApplications /> Cài đặt
                                        </ListGroupItem>
                                    )}
                                    {/* <ListGroupItem tag="button" action className="border-light">
                                        <MdHelp /> Trợ giúp
                                    </ListGroupItem> */}
                                    <ListGroupItem
                                        tag="button"
                                        onClick={logout}
                                        action
                                        className="border-light"
                                    >
                                        <MdExitToApp /> Đăng xuất
                                    </ListGroupItem>
                                </ListGroup>
                            </UserCard>
                        </PopoverBody>
                    </Popover>
                </NavItem>
            </Nav>
        </Navbar>
    );
}

export default Header;
