import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Container } from "reactstrap";
import { getServiceClients } from "@/store/actions/ServicesAction";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 1,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

const Example = () => {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Services);

    useEffect(() => {
        dispatchs(getServiceClients());
    }, [props.params.page, props.params.total, props.params.search, props.load]);

    return (
        <div>
            <Container>
                <Carousel
                    swipeable={false}
                    draggable={false}
                    showDots={true}
                    responsive={responsive}
                    ssr={true}
                    infinite={true}
                    // autoPlay={true}
                    autoPlaySpeed={3000}
                    keyBoardControl={true}
                    customTransition="all .5"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    // deviceType={this.props.deviceType}
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-40-px"
                >
                    {props.data.map((service, index) => {
                        return (
                            <div className="p-3" key={index}>
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
                            </div>
                        );
                    })}
                </Carousel>
            </Container>
        </div>
    );
};

export default Example;
