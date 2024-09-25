import React, { useState, useEffect } from "react";
import "../insertar/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Table } from "react-bootstrap";
import JSZip from "jszip";
import { saveAs } from "file-saver"; // Para descargar archivos fácilmente
import { BsFillTrashFill } from "react-icons/bs";
import ConfirmAlertEliminarArchivo from "../../../templates/alerts/ConfirmAlertEliminarArchivo";
import SendFilesService from "../../../services/SendFilesService";

const GestorArchivosAcop = ({ isActiveFormulario, cambiarEstado, acop }) => {
  // ----------------------CONSTANTES----------------------------
  const [listadoArchivos, setListadoArchivos] = useState();
  const [listadoArchivosSelect, setListadoArchivosSelect] = useState([]);
  const [isActiveInput, setIsActiveInput] = useState(false);
  const [archivoAcop, setArchivoAcop] = useState([]);

  const show = isActiveFormulario;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  const obtenerDocs = () => {
    var url = "pages/listados/ihh_listadoAcopDoc.php";
    var operationUrl = "ihh_listadoAcopDoc";
    var data = {
      num_boton: 1,
      cantidadPorPagina: 999999999999999,
      idAcop: acop.idAcop,
    };

    SendDataService(url, operationUrl, data).then((response) => {
      if (response && response.datos && response.datos.length > 0) {
        setListadoArchivos(response.datos);
        console.log(response.datos);
      } else {
        console.log("No se encontraron documentos.");
      }
    });
  };

  // Función para convertir base64 a Blob
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // Manejar la selección de los checkboxes
  const handleCheck = (event, item) => {
    const { checked } = event.target;
    if (checked) {
      setListadoArchivosSelect((prev) => [...prev, item]);
    } else {
      setListadoArchivosSelect((prev) =>
        prev.filter((archivo) => archivo.idAcopDoc !== item.idAcopDoc)
      );
    }
  };

  // Descargar los archivos seleccionados
  const handleDownload = async () => {
    // Si es un solo archivo, descargar directamente
    if (listadoArchivosSelect.length === 1) {
      const archivo = listadoArchivosSelect[0];
      const blob = base64ToBlob(archivo.archivo, "application/octet-stream");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = archivo.nomDoc;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (listadoArchivosSelect.length > 1) {
      // Si hay más de un archivo, crear un archivo .zip
      const zip = new JSZip();
      listadoArchivosSelect.forEach((archivo) => {
        const blob = base64ToBlob(archivo.archivo, "application/octet-stream");
        zip.file(archivo.nomDoc, blob);
      });

      // Generar el archivo .zip y descargarlo
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "archivos_acop.zip");
    } else {
      alert("Selecciona al menos un archivo para descargar.");
    }
  };

  function desactivar(ID) {
    ConfirmAlertEliminarArchivo().then((response) => {
      if (response === true) {
        var url = "pages/desactivar/ihh_desactivarAcopDoc.php";
        var operationUrl = "ihh_desactivarAcopDoc";
        var data = {
          idAcopDoc: ID,
          usuarioModificacion: userData.usuario,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
          const filter = listadoArchivos.filter(
            (item) => item.idAcopDoc !== ID
          );
          setListadoArchivos(filter);
        });
      }
    });
  }

  function SendData(e) {
    e.preventDefault();
    var data = {
      idAcop: acop.idAcop,
      usuarioCreacion: userData.usuario,
    };
    SendFilesService(
      "/pages/insertar/ihh_insertarAcopDoc.php",
      archivoAcop,
      data
    ).then((response) => {
      console.log(response);

      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }
  useEffect(() => {
    if (acop) {
      obtenerDocs();
    }
  }, [acop]);

  // ----------------------RENDER----------------------------

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        size="m"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Gestor de archivos de ACOP</h3>
            <p>
              <b>ACOP</b>: {acop.nomAcop}
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Button
              onClick={() => {
                setIsActiveInput(!isActiveInput);
              }}
              id="btn"
              variant="secondary"
            >
              Cargar archivo
            </Button>
            <br></br>
            {isActiveInput && (
              <>
                <br></br>
                <form
                  onSubmit={SendData}
                  style={{ border: "solid 1px black" }}
                >
                  <input
                    className="form-control"
                    type="file"
                    id="fileInput"
                    name="fileInput"
                    onChange={(e) => {
                      setArchivoAcop(e.target.files[0]);
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={handleDownload}
                    style={{float: "right", marginTop: "10px"}}
                  >
                    Cargar
                  </Button>
                </form>
                <br></br>
              </>
            )}
          </div>
          <br></br>
          {listadoArchivos &&
          (listadoArchivos.length === 0 ||
            (listadoArchivos.length === 1 &&
              listadoArchivos[0].idAcopDoc === "empty / vacio")) ? (
            <div>
              <h4>No hay archivos relacionados a este ACOP</h4>
            </div>
          ) : (
            <div>
              <Table id="mainTable" hover responsive>
                <thead>
                  <tr>
                    <th>Nombre archivo</th>
                    <th>Descarga</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {listadoArchivos &&
                    listadoArchivos.map((item) => (
                      <tr key={item.idAcopDoc}>
                        <td>{item.nomDoc}</td>
                        <td style={{ justifyItems: "center" }}>
                          <input
                            type="checkbox"
                            onChange={(event) => handleCheck(event, item)}
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => desactivar(item.idAcopDoc)}
                            id="OperationBtns"
                          >
                            <BsFillTrashFill id="icons" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <Button
                variant="secondary"
                id="btn_registrar"
                onClick={handleDownload}
              >
                Descargar
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export default GestorArchivosAcop;
