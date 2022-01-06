import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServiceClients } from "@/store/actions/ServicesAction";
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

function Services() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Services);

    useEffect(() => {
        dispatchs(getServiceClients());
    }, [props.params.page, props.params.total, props.params.search, props.load]);

    return (
        <>
            <div className="main mt-3">
                <Container>
                    <Row>
                        {props.data.map((service, index) => {
                            return (
                                <Col md="4" key={index}>
                                    <Card
                                        className="box-shadow"
                                        to={"/services/" + `${service.slug}-${service.id}`}
                                        exact
                                        tag={NavLink}
                                    >
                                        <CardImg
                                            className="card-img-client"
                                            top
                                            width="100%"
                                            src={"../../" + service.image}
                                            alt={service.name}
                                        />
                                        <CardBody>
                                            <CardTitle tag="h5">{service.name}</CardTitle>
                                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                                                {service.name_service_type}
                                            </CardSubtitle>
                                            <CardText>{service.description}</CardText>
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

export default Services;
