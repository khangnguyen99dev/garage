import React from "react";
import { MdSecurity } from "react-icons/md";

import { BsFillBriefcaseFill, BsFillBarChartFill } from "react-icons/bs";
import { Container, Row, Col } from "reactstrap";

function Carousels() {
    return (
        <>
            <div className="section pt-o" id="carousel">
                <Container>
                    <Row>
                        <Col className="ml-auto mr-auto" md="6">
                            <div className="title">
                                <h5>Giới thiệu chung về</h5>
                                <h3 style={{ color: "red", fontWeight: 700 }}>
                                    GARAGE ÔTÔ AN KHANG
                                </h3>
                            </div>
                            <div className="description">
                                GARA Ô TÔ - AN KHANG được biết đến là một trong những garage uy tín
                                với trên 10 năm kinh nghiệm và đội ngũ trên 50 kỹ thuật viên chuyên
                                nghiệp sẽ đem lại cho quý khánh hàng những chẩn đoán nhanh, chính
                                xác bệnh của xe và đưa ra giải pháp khắc phục một cách tối ưu nhất
                                với phương châm “bắt đúng bệnh, trị đúng cách”, qua đó quý khách
                                hàng sẽ tiết kiệm được thời gian và chi phí sửa chữa
                            </div>
                            <Container>
                                <div className="section text-center">
                                    <Row>
                                        <Col md="4">
                                            <div className="info">
                                                <div className="icon icon-info">
                                                    <BsFillBriefcaseFill />
                                                </div>
                                                <div className="description">
                                                    <p className="description">Chuyên nghiệp</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="info">
                                                <div className="icon icon-info">
                                                    <BsFillBarChartFill />
                                                </div>
                                                <div className="description">
                                                    <p className="description">
                                                        Công nghệ tiên phong
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="info">
                                                <div className="icon icon-info">
                                                    <MdSecurity />
                                                </div>
                                                <div className="description">
                                                    <p className="description">An toàn tối đa</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Container>
                        </Col>
                        <Col className="ml-auto mr-auto" md="6">
                            <div>
                                <img
                                    style={{ borderRadius: "12px" }}
                                    src={require("../../assets/img/garage-69.jpg").default}
                                    alt=""
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>{" "}
        </>
    );
}

export default Carousels;
