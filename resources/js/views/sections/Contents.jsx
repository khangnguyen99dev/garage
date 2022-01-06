import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";

function Contents() {
    const setting = useSelector((state) => state.Setting);
    return (
        <>
            <div className="section section-dark">
                <Container>
                    <Row>
                        <Col className="ml-auto mr-auto text-center" md="8">
                            <h2 className="title">{setting.data.name || "GARAGE"}</h2>
                            <p className="description">
                                {setting.data.content ||
                                    "SỰ HÀI LÒNG CỦA KHÁCH HÀNG LÀ UY TÍN CỦA GARAGE"}
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default Contents;
