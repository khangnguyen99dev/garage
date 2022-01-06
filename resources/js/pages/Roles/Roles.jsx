import React, { useEffect } from "react";
import Page from "@/components/Page";
import PageSpinner from "@/components/PageSpinner";
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import Pagination from "react-js-pagination";
import RolesModal from "./RolesModal";
import { BiEdit, BiTrash } from "react-icons/bi";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { getPaging, handleShow } from "@/store/actions/RolesAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import DefaultRolesModal from "../DefaultRoles/DefaultRolesModal";
function Roles() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Roles);

    useEffect(() => {
        dispatchs(getPaging());
    }, [props.params.page, props.params.total, props.params.search, props.load]);

    return (
        <Page title="Quyền" breadcrumbs={[{ name: "Quyền", active: true }]} className="Roles">
            <RolesModal />
            <DefaultRolesModal />
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Quyền</CardHeader>
                        <CardBody>
                            <Button
                                data-modal="add_role"
                                onClick={(e) => dispatchs(handleShow(e))}
                                className="btn btn-info btn-sm"
                            >
                                Thêm quyền
                            </Button>
                            {props.isLoading ? (
                                <PageSpinner />
                            ) : (
                                <Table hover responsive className="text-center">
                                    <thead>
                                        <tr>
                                            <th>Tên</th>
                                            <th>Mô tả</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((role, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row">{role.name}</td>
                                                            <td>{role.description}</td>
                                                            <td>
                                                                {role.menus.length > 0 ? (
                                                                    <Button
                                                                        data-key={role.id}
                                                                        data-modal="edit_default_role"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-info btn-sm"
                                                                        title="Phân quyền"
                                                                    >
                                                                        <AiOutlineUsergroupAdd />
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        data-key={role.id}
                                                                        data-modal="add_default_role"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-info btn-sm"
                                                                        title="Phân quyền"
                                                                    >
                                                                        <AiOutlineUsergroupAdd />
                                                                    </Button>
                                                                )}
                                                                &nbsp;
                                                                <Button
                                                                    data-key={role.id}
                                                                    data-modal="edit_role"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-warning btn-sm"
                                                                >
                                                                    <BiEdit />
                                                                </Button>{" "}
                                                                &nbsp;
                                                                <Button
                                                                    data-key={role.id}
                                                                    data-modal="delete"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-danger btn-sm"
                                                                >
                                                                    <BiTrash />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan={5}>Không có dữ liệu!</td>
                                            </tr>
                                        </tbody>
                                    )}
                                </Table>
                            )}
                            <div className="mt-3">
                                <Pagination
                                    firstPageText="Trang đầu"
                                    lastPageText="Trang cuối"
                                    innerClass="pagination justify-content-end"
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    activePage={props.params.page}
                                    itemsCountPerPage={props.params.per_page}
                                    totalItemsCount={props.params.total}
                                    onChange={(pageNumber) => {
                                        dispatchs(handlePageChange(pageNumber, path));
                                    }}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Page>
    );
}

export default Roles;
