import Page from "@/components/Page";
import { NumberWidget } from "@/components/Widget";

import React, { useEffect, useRef, useState } from "react";
// import { Line } from "react-chartjs-2";
// import { MdRateReview, MdShare, MdThumbUp } from "react-icons/md";
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { handleGetDashboard, handleShow } from "@/store/actions/DashboadAction";
import NumberFormat from "react-number-format";
import DashbroadModal from "./DashbroadModal";
import moment from "moment";
import { ExportCSV } from "./PrintPDF/ExportCSV";
import ChartLine from "./ChartLine/ChartLine";
import { AiOutlineFilePdf } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import ReportPDF from "./PrintPDF/ReportPDF";
// const today = new Date();
// const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

function DashboardPage() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Dashboard);

    useEffect(() => {
        dispatchs(handleGetDashboard());
    }, []);

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const { received, finished, total_revenue, order_pending, line, data, viewers } = props;

    const renderStatus = (key) => {
        switch (key) {
            case "0":
                return <Badge color="warning">Chờ xử lý</Badge>;
            case "1":
                return <Badge color="info">Đã tiếp nhận</Badge>;
            case "2":
                return <Badge color="warning">Đang xử lý</Badge>;
            case "3":
                return <Badge color="success">Đã hoàn thành</Badge>;
            case "4":
                return <Badge color="danger">Đã hủy</Badge>;
            default:
                return <Badge color="danger">Chưa xác định</Badge>;
        }
    };

    const fileName = "thong_ke_" + moment(new Date()).format("DD_MM_YY_hh_mm_ss");

    return (
        <Page
            className="Trang chủ"
            title="Trang chủ"
            // breadcrumbs={[{ name: "Dashboard", active: true }]}
        >
            <DashbroadModal />
            <div style={{ display: "none" }}>
                <ReportPDF ref={componentRef} data={viewers} />
            </div>
            <Row>
                <Col lg={3} md={6} sm={6} xs={12}>
                    <NumberWidget
                        title="Chờ duyệt"
                        subtitle={order_pending.date_order_pending}
                        number={order_pending.count_order_pending}
                        color="secondary"
                        progress={{
                            value: 45,
                            label: "Last month",
                        }}
                    />
                </Col>

                <Col lg={3} md={6} sm={6} xs={12}>
                    <NumberWidget
                        title="Đã tiếp nhận"
                        subtitle={received.date_received}
                        number={received.count_received}
                        color="secondary"
                        progress={{
                            value: 33,
                            label: "100",
                        }}
                    />
                </Col>

                <Col lg={3} md={6} sm={6} xs={12}>
                    <NumberWidget
                        title="Đã hoàn thành"
                        subtitle={finished.date_finished}
                        number={finished.count_finished}
                        color="secondary"
                        progress={{
                            value: 33,
                            label: "Last month",
                        }}
                    />
                </Col>

                <Col lg={3} md={6} sm={6} xs={12}>
                    <NumberWidget
                        title="Tổng tiền"
                        subtitle={total_revenue.date_total_revenue}
                        number={
                            <NumberFormat
                                value={total_revenue.count_total_revenue}
                                displayType={"text"}
                                suffix="₫"
                                thousandSeparator={true}
                            />
                        }
                        color="secondary"
                        progress={{
                            value: 60,
                            label: "Last month",
                        }}
                    />
                </Col>
            </Row>

            <Row>
                <Col lg="12" md="12" sm="12" xs="12">
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col md="10">
                                    Thống kê{" "}
                                    <small className="text-muted text-capitalize">Biểu đồ</small>
                                </Col>
                                <Col md="2">
                                    <Button
                                        className="btn-sm"
                                        data-modal="fillter"
                                        onClick={(e) => dispatchs(handleShow(e))}
                                    >
                                        Bộ lọc
                                    </Button>{" "}
                                    <ExportCSV csvData={viewers} fileName={fileName} />{" "}
                                    <Button
                                        className="btn-sm"
                                        title="Xuất báo cáo"
                                        onClick={() =>
                                            handlePrint(
                                                (document.title =
                                                    "TK_" + moment(new Date()).format("_DD_MM_YY"))
                                            )
                                        }
                                    >
                                        <AiOutlineFilePdf />
                                    </Button>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            {/* <Line data={line.data} options={line.options} /> */}
                            <ChartLine data={line.data} options={line.options} />
                        </CardBody>
                    </Card>
                </Col>

                {/* <Col lg="4" md="12" sm="12" xs="12">
                    <Card>
                        <CardHeader>Total Expense</CardHeader>
                        <CardBody>
                            <Bar data={chartjs.bar.data} options={chartjs.bar.options} />
                        </CardBody>
                        <ListGroup flush>
                            <ListGroupItem>
                                <MdInsertChart size={25} color={primaryColor} /> Cost of sales{" "}
                                <Badge color="secondary">$3000</Badge>
                            </ListGroupItem>
                            <ListGroupItem>
                                <MdBubbleChart size={25} color={primaryColor} /> Management costs{" "}
                                <Badge color="secondary">$1200</Badge>
                            </ListGroupItem>
                            <ListGroupItem>
                                <MdShowChart size={25} color={primaryColor} /> Financial costs{" "}
                                <Badge color="secondary">$800</Badge>
                            </ListGroupItem>
                            <ListGroupItem>
                                <MdPieChart size={25} color={primaryColor} /> Other operating costs{" "}
                                <Badge color="secondary">$2400</Badge>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col> */}
            </Row>

            <Row>
                <Table hover responsive className="text-center">
                    <thead>
                        <tr>
                            {/* <th>STT</th> */}
                            <th>Khách hàng</th>
                            <th>Ngày sửa chữa</th>
                            <th>Tổng tiền</th>
                            <th>Địa chỉ</th>
                            <th>NV. Kỹ Thuật</th>
                            <th>Hãng xe</th>
                            <th>Loại DV</th>
                            <th>Danh mục</th>
                            <th>Nhà cung cấp</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    {data.length > 0 ? (
                        <tbody>
                            {data &&
                                data.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            {/* <td scope="row">{index + 1}</td> */}
                                            <td>{value.name_customer}</td>
                                            <td>
                                                {moment(value.repair_date).format(
                                                    "hh:mm DD/MM/YYYY"
                                                )}
                                            </td>
                                            <td>
                                                <NumberFormat
                                                    value={value.total_price}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                />
                                                ₫
                                            </td>
                                            <td>{value.address_customer}</td>
                                            <td>{value.name_employee}</td>
                                            <td>{value.name_car_brand}</td>
                                            <td>
                                                {value.services.length > 0 &&
                                                    value.services
                                                        .filter(
                                                            (v, i, a) =>
                                                                a.findIndex(
                                                                    (t) =>
                                                                        t.name_service_type ===
                                                                        v.name_service_type
                                                                ) === i
                                                        )
                                                        .map((service, serviceindex) => {
                                                            return (
                                                                <Badge key={serviceindex}>
                                                                    {service.name_service_type}
                                                                </Badge>
                                                            );
                                                        })}
                                            </td>
                                            <td>
                                                {value.products.length > 0 &&
                                                    value.products
                                                        .filter(
                                                            (v, i, a) =>
                                                                a.findIndex(
                                                                    (t) =>
                                                                        t.name_category ===
                                                                        v.name_category
                                                                ) === i
                                                        )
                                                        .map((product, productindex) => {
                                                            return (
                                                                <Badge key={productindex}>
                                                                    {product.name_category}
                                                                </Badge>
                                                            );
                                                        })}
                                            </td>
                                            <td>
                                                {value.products.length > 0 &&
                                                    value.products
                                                        .filter(
                                                            (v, i, a) =>
                                                                a.findIndex(
                                                                    (t) =>
                                                                        t.name_supplier ===
                                                                        v.name_supplier
                                                                ) === i
                                                        )
                                                        .map((product, productindex) => {
                                                            return (
                                                                <Badge key={productindex}>
                                                                    {product.name_supplier}
                                                                </Badge>
                                                            );
                                                        })}
                                            </td>
                                            <td>{renderStatus(value.status_receive_vote)}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan={10}>Không có dữ liệu!</td>
                            </tr>
                        </tbody>
                    )}
                </Table>
            </Row>

            {/* <CardGroup style={{ marginBottom: "1rem" }}>
                <IconWidget
                    bgColor="white"
                    inverse={false}
                    icon={MdThumbUp}
                    title="50+ Likes"
                    subtitle="People you like"
                />
                <IconWidget
                    bgColor="white"
                    inverse={false}
                    icon={MdRateReview}
                    title="10+ Reviews"
                    subtitle="New Reviews"
                />
                <IconWidget
                    bgColor="white"
                    inverse={false}
                    icon={MdShare}
                    title="30+ Shares"
                    subtitle="New Shares"
                />
            </CardGroup> */}

            {/* <Row>
                    <Col md="6" sm="12" xs="12">
                        <Card>
                            <CardHeader>New Products</CardHeader>
                            <CardBody>
                                {productsData.map(({ id, image, title, description, right }) => (
                                    <ProductMedia
                                        key={id}
                                        image={image}
                                        title={title}
                                        description={description}
                                        right={right}
                                    />
                                ))}
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md="6" sm="12" xs="12">
                        <Card>
                            <CardHeader>New Users</CardHeader>
                            <CardBody>
                                <UserProgressTable
                                    headers={[
                                        <MdPersonPin size={25} />,
                                        "name",
                                        "date",
                                        "participation",
                                        "%",
                                    ]}
                                    usersData={userProgressTableData}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row> */}

            {/* <Row>
                    <Col lg={4} md={4} sm={12} xs={12}>
                        <Card>
                            <Line
                                data={getStackLineChart({
                                    labels: [
                                        "January",
                                        "February",
                                        "March",
                                        "April",
                                        "May",
                                        "June",
                                        "July",
                                    ],
                                    data: [0, 13000, 5000, 24000, 16000, 25000, 10000],
                                })}
                                options={stackLineChartOptions}
                            />
                            <CardBody className="text-primary" style={{ position: "absolute" }}>
                                <CardTitle>
                                    <MdInsertChart /> Sales
                                </CardTitle>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col lg={4} md={4} sm={12} xs={12}>
                        <Card>
                            <Line
                                data={getStackLineChart({
                                    labels: [
                                        "January",
                                        "February",
                                        "March",
                                        "April",
                                        "May",
                                        "June",
                                        "July",
                                    ],
                                    data: [10000, 15000, 5000, 10000, 5000, 10000, 10000],
                                })}
                                options={stackLineChartOptions}
                            />
                            <CardBody className="text-primary" style={{ position: "absolute" }}>
                                <CardTitle>
                                    <MdInsertChart /> Revenue
                                </CardTitle>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg={4} md={4} sm={12} xs={12}>
                        <Card>
                            <Line
                                data={getStackLineChart({
                                    labels: [
                                        "January",
                                        "February",
                                        "March",
                                        "April",
                                        "May",
                                        "June",
                                        "July",
                                    ],
                                    data: [0, 13000, 5000, 24000, 16000, 25000, 10000].reverse(),
                                })}
                                options={stackLineChartOptions}
                            />
                            <CardBody
                                className="text-primary"
                                style={{ position: "absolute", right: 0 }}
                            >
                                <CardTitle>
                                    <MdInsertChart /> Profit
                                </CardTitle>
                            </CardBody>
                        </Card>
                    </Col>
                </Row> */}

            {/* <Row>
                    <Col lg="4" md="12" sm="12" xs="12">
                        <InfiniteCalendar
                            selected={today}
                            minDate={lastWeek}
                            width="100%"
                            theme={{
                                accentColor: primaryColor,
                                floatingNav: {
                                    background: secondaryColor,
                                    chevron: primaryColor,
                                    color: "#FFF",
                                },
                                headerColor: primaryColor,
                                selectionColor: secondaryColor,
                                textColor: {
                                    active: "#FFF",
                                    default: "#333",
                                },
                                todayColor: secondaryColor,
                                weekdayColor: primaryColor,
                            }}
                        />
                    </Col>

                    <Col lg="8" md="12" sm="12" xs="12">
                        <Card inverse className="bg-gradient-primary">
                            <CardHeader className="bg-gradient-primary">
                                Map with bubbles
                            </CardHeader>
                            <CardBody>
                                <MapWithBubbles />
                            </CardBody>
                        </Card>
                    </Col>
                </Row> */}

            {/* <CardDeck style={{ marginBottom: "1rem" }}>
                    <Card
                        body
                        style={{
                            overflowX: "auto",
                            paddingBottom: "15px",
                            height: "fit-content",
                            paddingTop: "inherit",
                        }}
                    >
                        <HorizontalAvatarList avatars={avatarsData} avatarProps={{ size: 50 }} />
                    </Card>

                    <Card
                        body
                        style={{
                            overflowX: "auto",
                            paddingBottom: "15px",
                            height: "fit-content",
                            paddingTop: "inherit",
                        }}
                    >
                        <HorizontalAvatarList
                            avatars={avatarsData}
                            avatarProps={{ size: 50 }}
                            reversed
                        />
                    </Card>
                </CardDeck> */}

            {/* <Row>
                    <Col lg="4" md="12" sm="12" xs="12">
                        <AnnouncementCard
                            color="gradient-secondary"
                            header="Announcement"
                            avatarSize={60}
                            name="Jamy"
                            date="1 hour ago"
                            text="Lorem ipsum dolor sit amet,consectetuer edipiscing elit,sed diam nonummy euismod tinciduntut laoreet doloremagna"
                            buttonProps={{
                                children: "show",
                            }}
                            style={{ height: 500 }}
                        />
                    </Col>

                    <Col lg="4" md="12" sm="12" xs="12">
                        <Card>
                            <CardHeader>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>Support Tickets</span>
                                    <Button>
                                        <small>View All</small>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {supportTicketsData.map((supportTicket) => (
                                    <SupportTicket key={supportTicket.id} {...supportTicket} />
                                ))}
                            </CardBody>
                        </Card>
                    </Col>

                    <Col lg="4" md="12" sm="12" xs="12">
                        <TodosCard todos={todosData} />
                    </Col>
                </Row> */}
        </Page>
    );
    // }
}
export default DashboardPage;
