import React from "react";
import * as XLSX from "xlsx";
import "./exportCSV.css";
import TopAlerts from "../alerts/TopAlerts";

const ExportCSV = ({ inputData, nomTabla }) => {
  const exportData = (format) => {

    if (inputData.length === 0 || inputData[0] === '') {
      console.error("No hay datos para exportar");
      TopAlerts('01', "No hay datos para exportar")
      return;
    }

    let formattedData;
    let contentType;

    if (format === "csv") {
      // Formato CSV
      const csvData = [];
      const headers = Object.keys(inputData[0]);
      csvData.push(headers.join(";"));

      inputData.forEach((item) => {
        const row = headers.map((header) => item[header]);
        csvData.push(row.join(";"));
      });

      formattedData = csvData.join("\n");
      contentType = "text/csv;charset=utf-8;";

      const blob = new Blob([formattedData], { type: contentType });

      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${nomTabla}.${format}`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (format === "xlsx") {
      // Formato XLSX (Excel)
      if (typeof XLSX == "undefined") XLSX = require("xlsx");

      const ws = XLSX.utils.json_to_sheet(inputData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, nomTabla);

      /* Genera un archivo XLSX*/
      XLSX.writeFile(wb, `${nomTabla}.xlsx`);
    } else {
      console.error("Formato de exportación no válido");
      return;
    }
  };

  return (
    <table>
      <tr>
        <button className="btnExport" onClick={() => exportData("csv")}>
          Exportar a CSV
        </button>
      </tr>
      <tr>
        <button className="btnExport" onClick={() => exportData("xlsx")}>
          Exportar a Excel
        </button>
      </tr>
    </table>
  );
};

export default ExportCSV;
