import React from "react";

import * as FileSaver from "file-saver";

import * as XLSX from "xlsx";
import { Button } from "reactstrap";
import { RiFileExcel2Fill } from "react-icons/ri";

export const ExportCSV = ({ csvData, fileName }) => {
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

    const fileExtension = ".xlsx";

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);

        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, fileName + fileExtension);
    };

    return (
        <Button
            className="btn-sm"
            onClick={(e) => exportToCSV(csvData, fileName)}
            title="Xuất file Excel"
        >
            <RiFileExcel2Fill />
        </Button>
    );
};
