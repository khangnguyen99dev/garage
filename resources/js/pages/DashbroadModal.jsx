import React from "react";
import PropTypes from "prop-types";
import {
    Button,
    Col,
    Container,
    Form,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    FormGroup,
    Row,
} from "reactstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleMultiChange,
    handleMultiFocus,
    handleGetDashboard,
    onDateChanges,
    handleChangeInput,
    handleClearDate,
    handleClearFillter,
} from "@/store/actions/DashboadAction";
import RangePicker from "react-range-picker";
import { DebounceInput } from "react-debounce-input";
import { AiOutlineClear } from "react-icons/ai";

function DashbroadModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Dashboard);

    const { modal, isShow } = props.show;

    const {
        car_brands,
        categories,
        customers,
        service_types,
        employee_technical,
        status,
        suppliers,
        date_range,
        address,
    } = props.fillter;

    const {
        data_car_brands,
        data_categories,
        data_customers,
        data_service_types,
        data_employee_technical,
        data_status,
        data_suppliers,
    } = props.dataFillter;

    if (modal == "fillter") {
        return (
            <Modal isOpen={isShow} size="xl">
                <ModalHeader>Bộ lọc</ModalHeader>
                <Form>
                    <ModalBody>
                        <Container>
                            <Row>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="Hãng xe">Hãng xe</Label>
                                        <Select
                                            name="car_brands"
                                            placeholder="Chọn hãng xe"
                                            value={car_brands}
                                            options={data_car_brands}
                                            onChange={(value, e) =>
                                                dispatchs(handleMultiChange(value, e.name))
                                            }
                                            inputId="car-brands"
                                            onFocus={(e) => dispatchs(handleMultiFocus(e))}
                                            isMulti={true}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="Danh mục phụ tùng">Danh mục phụ tùng</Label>
                                        <Select
                                            name="categories"
                                            placeholder="Chọn danh mục"
                                            value={categories}
                                            options={data_categories}
                                            onChange={(value, e) =>
                                                dispatchs(handleMultiChange(value, e.name))
                                            }
                                            inputId="categories"
                                            onFocus={(e) => dispatchs(handleMultiFocus(e))}
                                            isMulti={true}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="Khách hàng">Khách hàng</Label>
                                        <Select
                                            name="customers"
                                            placeholder="Chọn khách hàng"
                                            value={customers}
                                            options={data_customers}
                                            onChange={(value, e) =>
                                                dispatchs(handleMultiChange(value, e.name))
                                            }
                                            inputId="customers"
                                            onFocus={(e) => dispatchs(handleMultiFocus(e))}
                                            isMulti={true}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="mt-5">
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="Loại dịch vụ">Loại dịch vụ</Label>
                                        <Select
                                            name="service_types"
                                            placeholder="Chọn loại dịch vụ"
                                            value={service_types}
                                            options={data_service_types}
                                            onChange={(value, e) =>
                                                dispatchs(handleMultiChange(value, e.name))
                                            }
                                            inputId="service-types"
                                            onFocus={(e) => dispatchs(handleMultiFocus(e))}
                                            isMulti={true}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="Nhân viên kỹ thuật">Nhân viên kỹ thuật</Label>
                                        <Select
                                            name="employee_technical"
                                            placeholder="Chọn nhân viên kỹ thuật"
                                            value={employee_technical}
                                            options={data_employee_technical}
                                            onChange={(value, e) =>
                                                dispatchs(handleMultiChange(value, e.name))
                                            }
                                            inputId="employee-technical"
                                            onFocus={(e) => dispatchs(handleMultiFocus(e))}
                                            isMulti={true}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="Trạng thái">Trạng thái</Label>
                                        <Select
                                            name="status"
                                            placeholder="Chọn trạng thái"
                                            value={status}
                                            options={data_status}
                                            onChange={(value, e) =>
                                                dispatchs(handleMultiChange(value, e.name))
                                            }
                                            isMulti={true}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="mt-5">
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="Nhà cung cấp">Nhà cung cấp</Label>
                                        <Select
                                            name="suppliers"
                                            placeholder="Chọn nhà cung cấp"
                                            value={suppliers}
                                            options={data_suppliers}
                                            onChange={(value, e) =>
                                                dispatchs(handleMultiChange(value, e.name))
                                            }
                                            inputId="suppliers"
                                            onFocus={(e) => dispatchs(handleMultiFocus(e))}
                                            isMulti={true}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="Địa chỉ">Địa chỉ</Label>
                                        <DebounceInput
                                            type="text"
                                            debounceTimeout={1000}
                                            className="form-control"
                                            placeholder="Nhập địa chỉ"
                                            value={address || ""}
                                            onChange={(value) => {
                                                dispatchs(handleChangeInput(value));
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="Ngày sửa chữa">Ngày sửa chữa</Label>
                                        {date_range.length > 0 && (
                                            <RangePicker
                                                placeholderText="Từ ngày / Đến ngày"
                                                defaultValue={{
                                                    startDate: new Date(date_range[0]),
                                                    endDate: new Date(date_range[1]),
                                                }}
                                                onDateSelected={(start, end) =>
                                                    dispatchs(onDateChanges(start, end))
                                                }
                                            />
                                        )}

                                        {date_range.length == 0 && (
                                            <RangePicker
                                                placeholderText="Từ ngày / Đến ngày"
                                                defaultValue={{ startDate: null, endDate: null }}
                                                onDateSelected={(start, end) =>
                                                    dispatchs(onDateChanges(start, end))
                                                }
                                            />
                                        )}

                                        <Button
                                            className="btn-md ml-2"
                                            onClick={() => dispatchs(handleClearDate())}
                                        >
                                            <AiOutlineClear />
                                        </Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Container>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="success" onClick={() => dispatchs(handleGetDashboard())}>
                            Xác nhận
                        </Button>{" "}
                        <Button
                            className="btn btn-warning"
                            onClick={() => dispatchs(handleClearFillter())}
                        >
                            Làm mới
                        </Button>{" "}
                        <Button
                            color="secondary"
                            type="button"
                            onClick={(e) => {
                                dispatchs(handleShow(e));
                            }}
                        >
                            Đóng
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    } else {
        return <div></div>;
    }
}

DashbroadModal.propTypes = {
    modal: PropTypes.bool,
};

DashbroadModal.defaultProps = {
    modal: false,
};

export default DashbroadModal;
