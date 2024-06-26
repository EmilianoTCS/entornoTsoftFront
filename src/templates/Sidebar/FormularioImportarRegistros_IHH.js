import React, { useState } from "react";
import TopAlertsError from "../alerts/TopAlerts";
import SendFilesService from "../../services/SendFilesService";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Insertar.css";
import DownloadFilesService from "../../services/DownloadFilesService";
import { FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver";

export default function FormularioImportarRegistros_IHH({
  isActive,
  cambiarEstado,
}) {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [archivoCargaRegistros, setArchivoCargaRegistros] = useState("");
  const [errores, setErrores] = useState(null);
  const [resumenRegistros, setResumenRegistros] = useState(null);

  const show = isActive;
  
  const handleClose = () => {
    cambiarEstado(false);
    setErrores(null);
    setResumenRegistros(null);
  };
  const styleDescPlantilla = {
    fontWeight: "700",
    fontSize: "20pt",
    textDecoration: "underline",
    color: "#66a8de",
    cursor: "pointer",
  };
  const section1Plantilla = {
    backgroundColor: "#ededed",
    padding: "5px 5px 0 5px",
    borderRadius: "10px",
    margin: "auto",
  };

  const parseErrors = (errorArray) => {
    const errorMap = {};

    errorArray.forEach((line) => {
      const errors = line.split("\n").filter((error) => error.trim() !== "");
      errors.forEach((error) => {
        const match = error.match(/Error fila: (\d+), (.+)/);
        if (match) {
          const [_, fila, mensaje] = match;
          if (!errorMap[fila]) {
            errorMap[fila] = [];
          }
          errorMap[fila].push(mensaje.trim());
        }
      });
    });

    return errorMap;
  };

  const downloadErrors = (errorMap) => {
    let csvContent = "\uFEFF"; // BOM (Byte Order Mark) para garantizar la correcta codificación UTF-8
    csvContent += "Error fila,mensaje\n"; // Encabezado del CSV
    Object.keys(errorMap).forEach((fila) => {
      errorMap[fila].forEach((mensaje) => {
        // Escapar comillas dobles y manejar caracteres especiales
        const mensajeEscaped = mensaje.replace(/"/g, '""');
        csvContent += `"Error fila ${fila}","${mensajeEscaped}"\n`;
      });
    });

    // Crear el URI codificado
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);

    // Crear un enlace temporal y simular clic para descargar el archivo
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "errores.csv");
    document.body.appendChild(link); // Necesario para Firefox
    link.click();
    document.body.removeChild(link); // Limpiar el enlace después de la descarga
  };

  function SubirArchivo(e) {
    e.preventDefault();
    var data = {
      idRegistro: 1,
      nomTabla: "Plantilla_carga_IHH.xlsx",
      descripcion: "Plantilla_carga_IHH.xlsx",
      isActive: "1",
      usuarioCreacion: userData.usuario,
    };
    SendFilesService(
      "/pages/gestorArchivos/importacionRegistros_IHH.php",
      archivoCargaRegistros,
      data
    ).then((response) => {
      const { errores } = response;
      console.log(response);
      setResumenRegistros({
        cantExitosos: response.cantExitosos,
        cantFallidos: response.cantFallidos,
        cantTotal: response.cantTotal,
      });
      if (Array.isArray(errores)) {
        const errorMap = parseErrors(errores);
        setErrores(errorMap);
      }
    });
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Importación de impugnaciones de horas al sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section style={section1Plantilla}>
            <p>
              Para la importar datos al sistema, es necesario bajar la{" "}
              <b>siguiente plantilla</b> para mantener el formato correcto:
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p style={styleDescPlantilla}>
                <div
                  style={{
                    border: "1px solid black",
                    padding: "5px 25px 10px 25px",
                  }}
                >
                  <DownloadFilesService
                    idRegistro={"1"}
                    nomTabla={"plantilla_carga_IHH"}
                    baseURL={
                      "http://localhost/entornoTsoft/pages/gestorArchivos/seleccionarDocumento.php"
                    }
                    title="Descargar plantilla"
                  >
                    <FaDownload />
                  </DownloadFilesService>
                </div>
              </p>
            </div>
            <p>
              Una vez completa, se debe convertir el archivo a formato .CSV para
              que el sistema pueda reconocerlo y guardar la información.
            </p>
          </section>
          <br />
          <section style={section1Plantilla}>
            <p>Selecciona el archivo a subir:</p>
            <form onSubmit={SubirArchivo}>
              <input
                type="file"
                id="fileInput"
                name="fileInput"
                onChange={(e) => {
                  setArchivoCargaRegistros(e.target.files[0]);
                }}
              />
              <Button
                variant="secondary"
                type="submit"
                id="btn_registrar"
                value="Registrar"
              >
                Importar datos
              </Button>
            </form>
            <br />
            <br />
          </section>
          <br />
          {resumenRegistros && (
            <section style={section1Plantilla}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  margin: "auto",
                }}
              >
                <p>
                  Total de datos procesados: <b>{resumenRegistros.cantTotal}</b>
                </p>
                <p>
                  Total de datos exitosos:{" "}
                  <b>{resumenRegistros.cantExitosos}</b>
                </p>
                <p>
                  Total de datos fallidos:{" "}
                  <b>{resumenRegistros.cantFallidos}</b>
                </p>
              </div>
            </section>
          )}
          <br />
          {errores && (
            <section style={section1Plantilla}>
              <h4>Se han encontrado los siguientes errores:</h4>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {Object.keys(errores).map((fila) => (
                  <div key={fila}>
                    <p>
                      <strong>Error fila {fila}:</strong>
                    </p>
                    <ul>
                      {errores[fila].map((mensaje, index) => (
                        <li key={index}>- {mensaje}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                id="btn_registrar"
                onClick={() => downloadErrors(errores)}
              >
                Descargar Errores
              </Button>
            </section>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
