import { NOTIFICATION_SYSTEM_STYLE } from "@/utils/constants";
import React from "react";
import Notifications from "react-notification-system-redux";
import { useSelector } from "react-redux";
import { Row, Container, Col } from "reactstrap";

function FooterClient() {
    const setting = useSelector((state) => state.Setting);
    const notifications = useSelector((state) => state.notifications);
    return (
        <footer className="footer footer-black footer-white">
            <Container>
                <Row>
                    <Col md="4" className="text-center">
                        <div className="credits ml-auto">
                            <span className="copyright">
                                © {new Date().getFullYear()}, {setting.data.name || "GARAGE"}
                                <i className="fa fa-heart heart" />
                            </span>
                        </div>
                    </Col>
                    <Col md="4" className="text-center">
                        <div className="credits ml-auto">
                            <span className="copyright">Email: {setting.data.email || ""}</span>
                            <i className="fa fa-heart heart" />
                        </div>
                    </Col>
                    <Col md="4" className="text-center">
                        <div className="credits ml-auto">
                            <span className="copyright">
                                Điện thoại: {setting.data.phone || ""}
                                <i className="fa fa-heart heart" />
                            </span>
                        </div>
                    </Col>
                </Row>
                <Notifications notifications={notifications} style={NOTIFICATION_SYSTEM_STYLE} />
            </Container>
        </footer>
    );
}

export default FooterClient;
