import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 1,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
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

const items = [
    {
        src: require("../../assets/img/banner.png").default,
        altText: "Slide 1",
        caption: "Slide 1",
    },
    {
        src: require("../../assets/img/banner1.jpg").default,
        altText: "Slide 2",
        caption: "Slide 2",
    },
    {
        src: require("../../assets/img/banner2.jpg").default,
        altText: "Slide 3",
        caption: "Slide 3",
    },
];

const slides = items.map((item) => {
    return (
        <div key={item.src}>
            <img src={item.src} alt={item.altText} />
        </div>
    );
});

function HeaderClient() {
    // let pageHeader = React.createRef();

    // React.useEffect(() => {
    //     if (window.innerWidth < 991) {
    //         const updateScroll = () => {
    //             let windowScrollTop = window.pageYOffset / 3;
    //             pageHeader.current.style.transform = "translate3d(0," + windowScrollTop + "px,0)";
    //         };
    //         window.addEventListener("scroll", updateScroll);
    //         return function cleanup() {
    //             window.removeEventListener("scroll", updateScroll);
    //         };
    //     }
    // });

    return (
        <>
            <div>
                <Carousel
                    swipeable={false}
                    draggable={false}
                    showDots={true}
                    responsive={responsive}
                    ssr={true} // means to render carousel on server-side.
                    infinite={true}
                    autoPlay={true}
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
                    {slides}
                </Carousel>
            </div>
            {/* <div
                style={{
                    backgroundImage: "url(" + require("../../assets/img/banner.png").default + ")",
                }}
                className="page-header page-header-xs"
                data-parallax={true}
                ref={pageHeader}
            >
                <div className="filter" />
            </div> */}
        </>
    );
}

export default HeaderClient;
