import React from "react";
import html2pdf from "html2pdf.js";
import "./export.css";

const ExportPDF = ({ nombreTabla }) => {
  const exportToPDF = (e) => {
    e.stopPropagation();
    let body = document.body;
    let html = document.documentElement;
    let height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    let heightCM = height / 35.35;

    const pdfOptions = {
      margin: 1,
      filename: `${nombreTabla}`,

      html2canvas: { scale: 2, dpi: 192, letterRendering: true },
      jsPDF: {
        orientation: "portrait",
        unit: "cm",
        format: [heightCM, 30],
      },
    };

    html2pdf()
      .from(body)
      .set(pdfOptions)
      .to("container")
      .outputPdf((pdf) => {
        pdf.ignoreElements = (element) => {
          return element.classList.contains("btnExport");
        };

        const blob = new Blob([pdf], { type: "application/pdf" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = pdfOptions.filename;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      })
      .save();
  };

  return (
    <div data-html2canvas-ignore="true">
      <button className="btnExport" onClick={exportToPDF}>
        Exportar a PDF
      </button>
    </div>
  );
};

export default ExportPDF;
