import React, { memo } from "react";
import { Line } from "react-chartjs-2";

function ChartLine({ data, options }) {
    return (
        <>
            <Line data={data} options={options} />
        </>
    );
}
export default memo(ChartLine);
