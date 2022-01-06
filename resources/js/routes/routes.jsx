import React from "react";
import { STATE_LOGIN } from "@/components/AuthForm";
import "@/styles/css/style.css";
//Admin
const DashboardPage = React.lazy(() => import("@/pages/DashboardPage"));
const Suppliers = React.lazy(() => import("@/pages/Suppliers/Suppliers"));
const CustomerTypes = React.lazy(() => import("@/pages/CustomerTypes/CustomerTypes"));
const CarBrands = React.lazy(() => import("@/pages/CarBrands/CarBrands"));
const Customers = React.lazy(() => import("@/pages/Customers/Customers"));
const Cars = React.lazy(() => import("@/pages/Cars/Cars"));
const ReceiveVotes = React.lazy(() => import("@/pages/ReceiveVotes/ReceiveVotes"));
const AuthPage = React.lazy(() => import("@/pages/AuthPage"));
const ProductTypes = React.lazy(() => import("@/pages/ProductTypes/ProductTypes"));
const Products = React.lazy(() => import("@/pages/Products/Products"));
const Categories = React.lazy(() => import("@/pages/Categories/Categories"));
const ServiceTypes = React.lazy(() => import("@/pages/ServiceTypes/ServiceTypes"));
const Services = React.lazy(() => import("@/pages/Services/Services"));
const RepairVotes = React.lazy(() => import("@/pages/RepairVotes/RepairVotes"));
const ExportVotes = React.lazy(() => import("@/pages/ExportVotes/ExportVotes"));
const ImportVotes = React.lazy(() => import("@/pages/ImportVotes/ImportVotes"));
const Roles = React.lazy(() => import("@/pages/Roles/Roles"));
const Menus = React.lazy(() => import("@/pages/Menus/Menus"));
const Users = React.lazy(() => import("@/pages/Users/Users"));
const BookingsAdmin = React.lazy(() => import("@/pages/Bookings/Bookings"));
const Info = React.lazy(() => import("@/pages/Info/Info"));
const NewsAdmin = React.lazy(() => import("@/pages/News/News"));
const Feedbacks = React.lazy(() => import("@/pages/Feedbacks/Feedbacks"));
const Setting = React.lazy(() => import("@/pages/Setting/Setting"));

//Client
const Index = React.lazy(() => import("@/views/Index"));
const Introduce = React.lazy(() => import("@/views/Introduce"));
const Service = React.lazy(() => import("@/views/Services"));
const News = React.lazy(() => import("@/views/News"));
const Bookings = React.lazy(() => import("@/views/Bookings"));
const CarProfile = React.lazy(() => import("@/views/CarProfile"));
const UserProfile = React.lazy(() => import("@/views/UserProfile"));
const HistoryRepair = React.lazy(() => import("@/views/HistoryRepair"));
const ServicesDetail = React.lazy(() => import("@/views/ServicesDetail"));
const NewsDetail = React.lazy(() => import("@/views/NewsDetail"));
const Feedback = React.lazy(() => import("@/views/Feedback"));
const Contact = React.lazy(() => import("@/views/Contact"));
const ChangePass = React.lazy(() => import("@/views/ChangePass"));

const routes = [
    {
        path: "/",
        exact: true,
        auth: false,
        component: Index,
        admin: false,
    },
    {
        path: "/introduce",
        exact: true,
        auth: false,
        component: Introduce,
        admin: false,
    },
    {
        path: "/services",
        exact: true,
        auth: false,
        component: Service,
        admin: false,
    },
    {
        path: "/services/:slug",
        exact: true,
        auth: false,
        component: ServicesDetail,
        admin: false,
    },
    {
        path: "/news/:slug",
        exact: true,
        auth: false,
        component: NewsDetail,
        admin: false,
    },
    {
        path: "/news",
        exact: true,
        auth: false,
        component: News,
        admin: false,
    },
    {
        path: "/contact",
        exact: true,
        auth: false,
        component: Contact,
        admin: false,
    },
    {
        path: "/bookings",
        exact: true,
        auth: false,
        component: Bookings,
        admin: false,
    },
    {
        path: "/car-profile",
        exact: true,
        auth: true,
        component: CarProfile,
        admin: false,
    },
    {
        path: "/user-profile",
        exact: true,
        auth: true,
        component: UserProfile,
        admin: false,
    },
    {
        path: "/history-repairs",
        exact: true,
        auth: true,
        component: HistoryRepair,
        admin: false,
    },
    {
        path: "/feedback/:id",
        exact: true,
        auth: false,
        component: Feedback,
        admin: false,
    },
    {
        path: "/change-password",
        exact: true,
        auth: false,
        component: ChangePass,
        admin: false,
    },

    {
        path: "/admin",
        exact: true,
        auth: true,
        component: DashboardPage,
        admin: true,
    },
    {
        path: "/admin/login",
        exact: true,
        auth: false,
        component: AuthPage,
        authState: STATE_LOGIN,
        base: true,
        admin: true,
    },
    {
        path: "/admin/car-brands",
        exact: true,
        auth: true,
        component: CarBrands,
        admin: true,
    },
    {
        path: "/admin/suppliers",
        exact: true,
        auth: true,
        component: Suppliers,
        admin: true,
    },
    {
        path: "/admin/categories",
        exact: true,
        auth: true,
        component: Categories,
        admin: true,
    },
    {
        path: "/admin/customer-types",
        exact: true,
        auth: true,
        component: CustomerTypes,
        admin: true,
    },
    {
        path: "/admin/customers",
        exact: true,
        auth: true,
        component: Customers,
        admin: true,
    },
    {
        path: "/admin/cars",
        exact: true,
        auth: true,
        component: Cars,
        admin: true,
    },
    {
        path: "/admin/receive-votes",
        exact: true,
        auth: true,
        component: ReceiveVotes,
        admin: true,
    },
    {
        path: "/admin/product-types",
        exact: true,
        auth: true,
        component: ProductTypes,
        admin: true,
    },
    {
        path: "/admin/products",
        exact: true,
        auth: true,
        component: Products,
        admin: true,
    },
    {
        path: "/admin/service-types",
        exact: true,
        auth: true,
        component: ServiceTypes,
        admin: true,
    },
    {
        path: "/admin/services",
        exact: true,
        auth: true,
        component: Services,
        admin: true,
    },
    {
        path: "/admin/repair-votes",
        exact: true,
        auth: true,
        component: RepairVotes,
        admin: true,
    },
    {
        path: "/admin/export-votes",
        exact: true,
        auth: true,
        component: ExportVotes,
        admin: true,
    },
    {
        path: "/admin/import-votes",
        exact: true,
        auth: true,
        component: ImportVotes,
        admin: true,
    },
    {
        path: "/admin/roles",
        exact: true,
        auth: true,
        component: Roles,
        admin: true,
    },
    {
        path: "/admin/menus",
        exact: true,
        auth: true,
        component: Menus,
        admin: true,
    },
    {
        path: "/admin/users",
        exact: true,
        auth: true,
        component: Users,
        admin: true,
    },
    {
        path: "/admin/bookings",
        exact: true,
        auth: true,
        component: BookingsAdmin,
        admin: true,
    },
    {
        path: "/admin/info",
        exact: true,
        auth: true,
        component: Info,
        admin: true,
    },

    {
        path: "/admin/news",
        exact: true,
        auth: true,
        component: NewsAdmin,
        admin: true,
    },
    {
        path: "/admin/feedbacks",
        exact: true,
        auth: true,
        component: Feedbacks,
        admin: true,
    },
    {
        path: "/admin/setting",
        exact: true,
        auth: true,
        component: Setting,
        admin: true,
    },
];

export default routes;
