import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { handleGetServiceDetail } from "@/store/actions/ClientsAction";
import {
    Card,
    CardBody,
    CardImg,
    CardSubtitle,
    CardText,
    CardTitle,
    Col,
    Container,
    Row,
} from "reactstrap";
import moment from "moment";

function ServicesDetail() {
    const dispatch = useDispatch();
    const { slug } = useParams();

    const props = useSelector((state) => state.Clients.dataServiceDetail);

    useEffect(() => {
        dispatch(handleGetServiceDetail(slug));
    }, []);
    return (
        <>
            <Container>
                <Row>
                    <Col md="12">
                        <div className="mt-5">
                            <h2>{props.name}</h2>
                            <div>Ngày đăng: {moment(props.created_at).format("DD/MM/YYYY")}</div>
                        </div>
                        <hr />
                        <div className="mt-3">
                            <div className="description">
                                <div dangerouslySetInnerHTML={{ __html: props.content }} />
                            </div>
                            {/* <h3>KHI NÀO CẦN LÀM ĐỒNG SƠN XE?</h3>
                            <div className="description">
                                Đi sử dụng xe ô tô, dù bạn cẩn thận đến đâu thì việc va quẹt gây
                                trầy xước là điều không thể tránh khỏi. Hoặc xe sau một thời gian
                                dài sử dụng sẽ khiến lớp sơn bị ngả màu, xỉn màu, gỉ sét...gây mất
                                thẩm mỹ. Đó chính là lúc bạn nên quan tâm đến việc sơn mới, tân
                                trang lại cho chiếc "xế" yêu quý của mình.
                            </div>
                            <div className="center-image-client mt-2">
                                <img
                                    src={"../" + props.image}
                                    alt=""
                                    className="img-service-detail"
                                />
                                <i>{props.name}</i>
                            </div>
                            <div className="description mb-5 mt-3">
                                Các vết trầy xước trên xe không chỉ làm xe mất thẩm mỹ, mà còn tạo
                                điều kiện cho các bụi bặm bám vào, nước mưa ngấm rồi oxy hóa. Nếu
                                tình trạng trầm trọng còn có thể làm cho vỏ xe chỗ trầy xước bị ăn
                                mòn, rỉ rồi loang rộng ra,...làm cho chiếc xế yêu của quý khách ngày
                                càng tàn đi. Vì vậy, quý khách nên tiến hành đồng sơn lại chiếc xe
                                của mình để luôn đẹp, luôn bóng bẩy và sang trọng trong con mắt
                                người khác. Ngoài ra vào cuối năm thường có nhiều người muốn đi tân
                                trang lại vẻ đẹp cho chiếc xe yêu quý của mình để đón tết và cùng
                                gia đình tận hưởng những phút giây thư giãn trọn vẹn nhất. Do đó,
                                thời điểm này chúng ta thường thấy các dịch vụ chăm sóc xe hơi như
                                làm đồng sơn xe ô tô, bảo dưỡng xe ô tô… trở nên rất nhộn nhịp. Tuy
                                nhiên, vấn đề đặt ra ở đây là làm thế nào để chọn được địa chỉ chăm
                                sóc và bảo dưỡng xe hơi uy tín, chất lượng.
                            </div> */}
                        </div>
                    </Col>
                    {/* <Col md="3">
                        <Card>
                            <CardImg
                                top
                                width="100%"
                                src={require("../assets/img/den-pha-o-to.png").default}
                                alt="Card image cap"
                            />
                            <CardBody>
                                <CardTitle tag="h5" style={{ fontWeight: 600 }}>
                                    Xe ô tô có những loại đèn nào? Cách tăng sáng cho đèn pha
                                </CardTitle>
                                <CardSubtitle tag="h6" className="mb-2 text-muted">
                                    Tin tức
                                </CardSubtitle>
                                <CardText>
                                    Đèn pha ô tô được ví như đôi mắt của một chiếc ô tô tuy vậy mỗi
                                    dòng xe lại có một kiểu đèn khác nhau và chế độ chăm sóc, vệ
                                    sinh cũng cần thật cẩn thận.
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col> */}
                </Row>
            </Container>
        </>
    );
}

export default ServicesDetail;
