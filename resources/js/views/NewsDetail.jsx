import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { handleGetNewDetail } from "@/store/actions/ClientsAction";
import { Col, Container, Row } from "reactstrap";
import moment from "moment";

function NewsDetail() {
    const dispatch = useDispatch();
    const { slug } = useParams();

    const props = useSelector((state) => state.Clients.dataNewDetail);

    useEffect(() => {
        dispatch(handleGetNewDetail(slug));
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
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default NewsDetail;
