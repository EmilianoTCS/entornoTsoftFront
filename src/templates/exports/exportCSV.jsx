import React from 'react';

const TuComponente = ({ dashcomproy }) => {
  const exportData = (format) => {
    if (dashcomproy.length === 0) {
      console.error("No hay datos para exportar");
      return;
    }

    let formattedData;
    let contentType;

    if (format === 'csv') {
      // Formato CSV
      const csvData = [];
      const headers = Object.keys(dashcomproy[0]);
      csvData.push(headers.join(","));

      dashcomproy.forEach((item) => {
        const row = headers.map((header) => item[header]);
        csvData.push(row.join(","));
      });

      formattedData = csvData.join("\n");
      contentType = "text/csv;charset=utf-8;";
    } else if (format === 'excel') {
      // Formato Excel
      const csvData = [];
      const headers = Object.keys(dashcomproy[0]);
      csvData.push(headers.join(","));

      dashcomproy.forEach((item) => {
        const row = headers.map((header) => item[header]);
        csvData.push(row.join(","));
      });

      formattedData = csvData.join("\n");
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;";
    } else {
      console.error("Formato de exportación no válido");
      return;
    }

    const blob = new Blob([formattedData], { type: contentType });

    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `dashboard_comp_proy.${format}`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      {/* Otro contenido de tu componente */}
      
      {/* Botones de exportación */}
      <button onClick={() => exportData('csv')}>Exportar a CSV</button>
      <button onClick={() => exportData('excel')}>Exportar a Excel</button>
    </div>
  );
};

export default TuComponente;
