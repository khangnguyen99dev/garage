import React from "react";
import { useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";

export default function Contact() {
    const setting = useSelector((state) => state.Setting);
    return (
        <div>
            <Container>
                <Row>
                    <h1 className="text-uppercase text-danger text-center">
                        {setting.data.name || ""}{" "}
                    </h1>
                </Row>
                <Row className=" mt-5">
                    <Col>
                        <span className="text-primary">Tên doanh nghiệp:</span>{" "}
                        {setting.data.name || ""}
                    </Col>
                    <Col>
                        <span className="text-primary">Email:</span> {setting.data.email || ""}
                    </Col>
                </Row>
                <Row className=" mt-5">
                    <Col>
                        <span className="text-primary">Địa chỉ:</span> {setting.data.address || ""}
                    </Col>
                    <Col>
                        <span className="text-primary">Điện thoại:</span> {setting.data.phone || ""}
                    </Col>
                </Row>
                <Row className=" mt-5">
                    <Col>
                        <span className="text-primary">Website:</span> {setting.data.website || ""}
                    </Col>
                    <Col>
                        <span className="text-primary">Tên người đại diện:</span>{" "}
                        {setting.data.name_represent || ""}
                    </Col>
                </Row>
                <Row className=" mt-5 mb-5">
                    <Col>
                        <span className="text-primary">Số tài khoản:</span>{" "}
                        {setting.data.account_number || ""}
                    </Col>
                    <Col>
                        <span className="text-primary">Tên ngân hàng:</span>{" "}
                        {setting.data.name_bank || ""}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
