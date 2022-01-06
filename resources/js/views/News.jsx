import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNewClients } from "@/store/actions/NewsAction";
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
import { NavLink } from "react-router-dom";

function News() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.News);

    useEffect(() => {
        dispatchs(getNewClients());
    }, [props.params.page, props.params.total, props.params.search, props.load]);

    return (
        <>
            <div className="main mt-3">
                <Container>
                    <Row>
                        {props.data.map((news, index) => {
                            return (
                                <Col md="4" key={index}>
                                    <Card
                                        className="box-shadow"
                                        to={"/news/" + `${news.slug}-${news.id}`}
                                        exact
                                        tag={NavLink}
                                    >
                                        <CardImg
                                            className="card-img-client"
                                            top
                                            width="100%"
                                            src={"../../" + news.image}
                                            alt={news.name}
                                        />
                                        <CardBody>
                                            <CardTitle tag="h5">{news.name}</CardTitle>
                                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                                                Tin tức
                                            </CardSubtitle>
                                            <CardText>{news.description}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default News;
