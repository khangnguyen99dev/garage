// import logo200Image from '@/assets/img/logo/logo_200.png';
import sidebarBgImage from "@/assets/img/sidebar/sidebar-4.jpg";
import SourceLink from "@/components/SourceLink";
import React, { useEffect } from "react";
import logo from "@/pages/PrintPDF/logo.jpg";
import { MdBorderAll } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, NavItem, NavLink as BSNavLink } from "reactstrap";
import * as Icons from "react-icons/fa";
import bn from "@/utils/bemnames";
import { useSelector, useDispatch } from "react-redux";
import ServiceCrud from "@/services/ServiceCrud";
import _ from "lodash";

function Sidebar() {
    const sidebarBackground = {
        backgroundImage: `url("${sidebarBgImage}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };

    const auth = useSelector((state) => state.Auth);

    const setting = useSelector((state) => state.Setting);

    const dispatchs = useDispatch();

    const navItems = auth.menus;

    useEffect(() => {
        dispatchs({
            type: "RESET_FILLTER",
        });
        document.title = "Garage An Khang";
        ServiceCrud.instance
            .show("user-menus", auth.user.id)
            .then((response) => {
                const { menus, custom_roles_menu } = response.data;
                let arrayNav = [];
                if (custom_roles_menu) {
                    custom_roles_menu.map((value) => {
                        arrayNav.push({
                            to: value.link,
                            name: value.label,
                            exact: true,
                            Icon: Icons[value.icon] || MdBorderAll,
                        });
                    });
                } else {
                    menus.map((value) => {
                        arrayNav.push({
                            to: value.link,
                            name: value.label,
                            exact: true,
                            Icon: Icons[value.icon] || MdBorderAll,
                        });
                    });
                }

                arrayNav.push(
                    {
                        to: "/admin/info",
                        name: "Info",
                        exact: false,
                        Icon: MdBorderAll,
                    },
                    {
                        to: "/admin/setting",
                        name: "Setting",
                        exact: false,
                        Icon: MdBorderAll,
                    }
                );
                dispatchs({
                    type: "SET_CHECK_MENUS",
                    payload: arrayNav,
                });
            })
            .catch((error) => {
                console.log("Error: " + error);
            });
    }, []);

    const bem = bn.create("sidebar");

    return (
        <aside className="cr-sidebar cr-sidebar--open" data-image={sidebarBgImage}>
            <div className={bem.e("background")} style={sidebarBackground} />
            <div className={bem.e("content")}>
                <Navbar>
                    <SourceLink className="navbar-brand d-flex">
                        <img
                            src={"../" + setting.data.logo || logo}
                            width="40"
                            height="30"
                            className="pr-2"
                            alt=""
                        />
                        <span className="text-white text-uppercase font-logo">
                            {setting.data.name || "GARAGE"}
                        </span>
                    </SourceLink>
                </Navbar>
                <Nav vertical>
                    {navItems.map(({ to, name, exact, Icon }, index) => {
                        return (
                            exact && (
                                <NavItem key={index} className={bem.e("nav-item")}>
                                    <BSNavLink
                                        id={`navItem-${name}-${index}`}
                                        className="text-uppercase"
                                        tag={NavLink}
                                        to={to}
                                        activeClassName="active"
                                        exact={exact}
                                    >
                                        <Icon className={bem.e("nav-item-icon")} />
                                        <span className="">{name}</span>
                                    </BSNavLink>
                                </NavItem>
                            )
                        );
                    })}

                    {/* <NavItem
            className={bem.e('nav-item')}
            onClick={handleClick('Contents')}
          >
            <BSNavLink className={bem.e('nav-item-collapse')}>
              <div className="d-flex">
                <MdSend className={bem.e('nav-item-icon')} />
                <span className="text-uppercase">Tiếp nhận xe</span>
              </div>
              <MdKeyboardArrowDown
                className={bem.e('nav-item-icon')}
                style={{
                  padding: 0,
                  transform: state.isOpenContents
                    ? 'rotate(0deg)'
                    : 'rotate(-90deg)',
                  transitionDuration: '0.3s',
                  transitionProperty: 'transform',
                }}
              />
            </BSNavLink>
          </NavItem>
          <Collapse isOpen={state.isOpenContents}>
            {navContents.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}
          </Collapse> */}
                </Nav>
            </div>
        </aside>
    );
}

export default Sidebar;
