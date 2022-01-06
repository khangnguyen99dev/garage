import { combineReducers } from "redux";
import Auth from "./Auth";
import persistStore from "./persistStore";
import CarBrands from "./CarBrands";
import Suppliers from "./Suppliers";
import CustomerTypes from "./CustomerTypes";
import Customers from "./Customers";
import Cars from "./Cars";
import ReceiveVotes from "./ReceiveVotes";
import ProductTypes from "./ProductTypes";
import Products from "./Products";
import Categories from "./Categories";
import RepairVotes from "./RepairVotes";
import ServiceTypes from "./ServiceTypes";
import Services from "./Services";
import ExportVotes from "./ExportVotes";
import ImportVotes from "./ImportVotes";
import ImportVoteDetails from "./ImportVoteDetails";
import Roles from "./Roles";
import Menus from "./Menus";
import DefaultRoles from "./DefaultRoles";
import Users from "./Users";
import CustomRoles from "./CustomRoles";
import Clients from "./Clients";
import Bookings from "./Bookings";
import Dashboard from "./Dashbroad";
import News from "./News";
import Feedbacks from "./Feedbacks";
import Setting from "./Setting";
import { reducer as notifications } from "react-notification-system-redux";

const RootReducer = combineReducers({
    Menus,
    Auth,
    persistStore,
    CarBrands,
    Suppliers,
    CustomerTypes,
    Customers,
    Cars,
    ReceiveVotes,
    ProductTypes,
    Products,
    Categories,
    RepairVotes,
    ServiceTypes,
    Services,
    ExportVotes,
    ImportVotes,
    ImportVoteDetails,
    Roles,
    DefaultRoles,
    CustomRoles,
    Users,
    Clients,
    Bookings,
    Dashboard,
    News,
    Feedbacks,
    Setting,
    notifications,
});

export default RootReducer;
