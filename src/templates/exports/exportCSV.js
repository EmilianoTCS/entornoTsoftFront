import React from "react";
import * as XLSX from "xlsx";
import "./export.css";
import TopAlerts from "../alerts/TopAlerts";

const ExportCSV = ({ inputData, nomTabla }) => {
  const exportData = (format) => {
    if (inputData.length === 0 || inputData[0] === '') {
      console.error("No hay datos para exportar");
      TopAlerts('01', "No hay datos para exportar")
      return;
    }

    if (format === "csv") {
      // Formato CSV
      const csvData = [];
      const headers = Object.keys(inputData[0]);
      csvData.push(headers.join(";"));

      inputData.forEach((item) => {
        const row = headers.map((header) => item[header]);
        csvData.push(row.join(";"));
      });

      const csvContent = csvData.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${nomTabla}.csv`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } else if (format === "xlsx") {
      // Formato XLSX (Excel)
      const ws = XLSX.utils.json_to_sheet(inputData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, nomTabla);

      XLSX.writeFile(wb, `${nomTabla}.xlsx`);
    } else {
      console.error("Formato de exportación no válido");
    }
  };

  return (
    <div>
      <button className="btnExport" onClick={() => exportData("csv")}>
        Exportar a CSV
      </button>
      <button className="btnExport" onClick={() => exportData("xlsx")}>
        Exportar a Excel
      </button>
    </div>
  );
};

export default ExportCSV;
