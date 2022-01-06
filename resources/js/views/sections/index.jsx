import React from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { MdLocalCarWash } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";
import { AiTwotoneTool } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";

function index() {
    document.documentElement.classList.remove("nav-open");
    React.useEffect(() => {
        document.body.classList.add("profile-page");
        return function cleanup() {
            document.body.classList.remove("profile-page");
        };
    });
    return (
        <>
            <div className="main">
                <div className="section section-dark text-center">
                    <Container>
                        <h2 className="title">Phản hồi của khách hàng</h2>
                        <Row>
                            <Col md="4">
                                <Card className="card-profile card-plain">
                                    <div className="card-avatar">
                                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                src={
                                                    require("../../assets/img/users/joe-gardner-2.jpg")
                                                        .default
                                                }
                                            />
                                        </a>
                                    </div>
                                    <CardBody>
                                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                            <div className="author">
                                                <CardTitle tag="h4">Hoàng Tuyết Nhung</CardTitle>
                                                <h6 className="card-category">Giám đốc</h6>
                                            </div>
                                        </a>
                                        <p className="card-description text-center">
                                            Điều làm tôi hài lòng nhất ở Garage An Khang là chất
                                            lượng sơn rất tốt, các bạn sơn rất cẩn thận, phòng sơn
                                            rất hiện đại. Tôi hy vọng Garage An Khang sẽ phát triển
                                            hơn nữa
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="4">
                                <Card className="card-profile card-plain">
                                    <div className="card-avatar">
                                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                src={
                                                    require("../../assets/img/users/clem-onojeghuo-2.jpg")
                                                        .default
                                                }
                                            />
                                        </a>
                                    </div>
                                    <CardBody>
                                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                            <div className="author">
                                                <CardTitle tag="h4">Đặng Ngọc Sơn</CardTitle>
                                                <h6 className="card-category">Giám đốc</h6>
                                            </div>
                                        </a>
                                        <p className="card-description text-center">
                                            Điều làm cho tôi cảm thấy yên tâm và tin tưởng lựa chọn
                                            Garage An Khang đó là đội ngũ nhân viên có tay nghề cao
                                            và chế độ chăm sóc tận tình, chu đáo.
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="4">
                                <Card className="card-profile card-plain">
                                    <div className="card-avatar">
                                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                src={
                                                    require("../../assets/img/users/erik-lucatero-2.jpg")
                                                        .default
                                                }
                                            />
                                        </a>
                                    </div>
                                    <CardBody>
                                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                            <div className="author">
                                                <CardTitle tag="h4">Nguyễn Trọng Tài</CardTitle>
                                                <h6 className="card-category">Giám đốc</h6>
                                            </div>
                                        </a>
                                        <p className="card-description text-center">
                                            Nhờ có Garage An Khang, thủ tục trở nên đơn giản hơn bao
                                            giờ hết, tôi chỉ việc đem xe đến và nhận lại xe được tân
                                            trang lại như mới.
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="section text-center">
                    <Container>
                        <Row>
                            <Col className="ml-auto mr-auto" md="8">
                                <h2 className="title">GARAGE ÔTÔ AN KHANG</h2>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col md="3">
                                <div className="info">
                                    <div className="icon icon-info">
                                        <MdLocalCarWash />
                                    </div>
                                    <div className="description">
                                        <h4 className="info-title">10+</h4>
                                        <p className="description">Hơn 10 năm kinh nghiệm</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md="3">
                                <div className="info">
                                    <div className="icon icon-info">
                                        <IoPeopleOutline />
                                    </div>
                                    <div className="description">
                                        <h4 className="info-title">2000+</h4>
                                        <p>Hơn 2000 khách hàng tin tưởng sử dụng dịch vụ</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md="3">
                                <div className="info">
                                    <div className="icon icon-info">
                                        <AiTwotoneTool />
                                    </div>
                                    <div className="description">
                                        <h4 className="info-title">50+</h4>
                                        <p>Có hơn 50 dịch vụ sửa chữa</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md="3">
                                <div className="info">
                                    <div className="icon icon-info">
                                        <IoIosPeople />
                                    </div>
                                    <div className="description">
                                        <h4 className="info-title">50+</h4>
                                        <p>Hơn 50 nhân viên có nhiều kinh nghiệm</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    );
}

export default index;
