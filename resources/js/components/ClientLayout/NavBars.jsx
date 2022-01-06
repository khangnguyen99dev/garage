import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { NavLink as RRNavLink } from "react-router-dom";
import AuthClient from "@/views/AuthClient";

import {
    Collapse,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import { handleShow, handleLogout } from "@/store/actions/ClientsAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

function Navbars() {
    const dispatchs = useDispatch();
    const auth = useSelector((state) => state.Auth);

    const setting = useSelector((state) => state.Setting);

    const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
    const [navbarCollapse, setNavbarCollapse] = React.useState(false);

    const toggleNavbarCollapse = () => {
        setNavbarCollapse(!navbarCollapse);
        document.documentElement.classList.toggle("nav-open");
    };

    const historys = useHistory();

    React.useEffect(() => {
        const updateNavbarColor = () => {
            if (document.documentElement.scrollTop > 299 || document.body.scrollTop > 299) {
                setNavbarColor("");
            } else if (document.documentElement.scrollTop < 300 || document.body.scrollTop < 300) {
                setNavbarColor("navbar-transparent");
            }
        };

        window.addEventListener("scroll", updateNavbarColor);

        return function cleanup() {
            window.removeEventListener("scroll", updateNavbarColor);
        };
    });
    return (
        <Navbar
            className={classnames("fixed-top", "client", navbarColor)}
            color-on-scroll="300"
            expand="lg"
        >
            <Container>
                <div className="navbar-translate justify-content-end">
                    <NavbarBrand
                        data-placement="bottom"
                        to="/"
                        title={setting.data.name || "GARAGE"}
                        tag={RRNavLink}
                    >
                        {setting.data.name || "GARAGE"}
                    </NavbarBrand>
                    <button
                        aria-expanded={navbarCollapse}
                        className={classnames("navbar-toggler navbar-toggler", {
                            toggled: navbarCollapse,
                        })}
                        onClick={toggleNavbarCollapse}
                    >
                        <span className="navbar-toggler-bar bar1" />
                        <span className="navbar-toggler-bar bar2" />
                        <span className="navbar-toggler-bar bar3" />
                    </button>
                </div>
                <Collapse className="justify-content-end" navbar isOpen={navbarCollapse}>
                    <Nav navbar>
                        <NavItem>
                            <NavLink to="/" tag={Link}>
                                <i className="fa fa-home"></i>Trang chủ
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                tag={RRNavLink}
                                exact
                                to="/introduce"
                                className="nav-link"
                                activeClassName="active"
                            >
                                Giới thiệu
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                tag={RRNavLink}
                                exact
                                to="/services"
                                className="nav-link"
                                activeClassName="active"
                            >
                                Dịch vụ
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                tag={RRNavLink}
                                exact
                                to="/news"
                                className="nav-link"
                                activeClassName="active"
                            >
                                Tin tức
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                tag={RRNavLink}
                                exact
                                to="/contact"
                                className="nav-link"
                                activeClassName="active"
                            >
                                Liên hệ
                            </NavLink>
                        </NavItem>

                        {!auth.isAuthenticated ? (
                            <>
                                <NavItem>
                                    <NavLink
                                        className="btn btn-sm"
                                        data-modal="register"
                                        onClick={(e) => dispatchs(handleShow(e))}
                                    >
                                        Đăng ký
                                    </NavLink>
                                </NavItem>{" "}
                                |
                                <NavItem>
                                    <NavLink
                                        className="btn btn-sm"
                                        data-modal="login"
                                        onClick={(e) => dispatchs(handleShow(e))}
                                    >
                                        Đăng nhập
                                    </NavLink>
                                </NavItem>{" "}
                            </>
                        ) : (
                            <Nav className="align-items-center d-none d-md-flex" navbar>
                                <UncontrolledDropdown nav>
                                    <DropdownToggle className="pr-0" nav>
                                        <Media className="align-items-center">
                                            <span className="avatar avatar-sm rounded-circle">
                                                <div
                                                    className="img-circle img-no-padding img-responsive avatar-uploader__avatar-image img-avatar"
                                                    style={{
                                                        backgroundImage: `url(
                                                                ${
                                                                    auth.user.avatar
                                                                        ? "../" + auth.user.avatar
                                                                        : require("@/assets/img/users/default_avatar.jpg")
                                                                              .default
                                                                }
                                                            )`,
                                                    }}
                                                ></div>
                                            </span>
                                            <Media className="ml-2 d-none d-lg-block">
                                                <span className="mb-0 text-sm font-weight-bold">
                                                    {auth.user.name}
                                                </span>
                                            </Media>
                                        </Media>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-arrow" right>
                                        <DropdownItem className="noti-title" header tag="div">
                                            <h6 className="text-overflow m-0">
                                                Xin chào {auth.user.name}!
                                            </h6>
                                        </DropdownItem>
                                        <DropdownItem to="/user-profile" exact tag={RRNavLink}>
                                            <i className="fa fa-user"></i>
                                            <span>Thông tin</span>
                                        </DropdownItem>
                                        <DropdownItem to="/change-password" exact tag={RRNavLink}>
                                            <i className="fa fa-key"></i>
                                            <span>Đổi mật khẩu</span>
                                        </DropdownItem>
                                        <DropdownItem to="/car-profile" exact tag={RRNavLink}>
                                            <i className="fa fa-car"></i>
                                            <span>Thông tin xe</span>
                                        </DropdownItem>
                                        <DropdownItem to="/history-repairs" exact tag={RRNavLink}>
                                            <i className="fa fa-history"></i>
                                            <span>Lịch sử sửa chữa</span>
                                        </DropdownItem>
                                        <DropdownItem to="/bookings" exact tag={RRNavLink}>
                                            <i className="fa fa-calendar"></i>
                                            <span>Đặt lịch sửa chữa</span>
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem
                                            onClick={() => dispatchs(handleLogout(historys))}
                                        >
                                            <i className="fa fa-sign-out"></i>
                                            <span>Đăng xuất</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                        )}
                    </Nav>
                </Collapse>
                <AuthClient />
            </Container>
        </Navbar>
    );
}

export default Navbars;
