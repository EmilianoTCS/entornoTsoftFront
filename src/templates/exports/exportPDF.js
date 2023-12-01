import React from "react";
import html2pdf from "html2pdf.js";
import "./export.css";

const ExportPDF = ({ nombreTabla }) => {
  const exportToPDF = () => {
    const pdfOptions = {
      filename: nombreTabla,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 4, allowTaint: true },
      jsPDF: { unit: "mm", orientation: "landscape" },
      pagebreak: {
        mode: "avoid-all",
        before: ["#fondoTablaDashCompProy", ".containerBarras"],
      },
      DisablePdfCompression: 0
    };

    const content = document.body;

    html2pdf()
      .from(content)
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
