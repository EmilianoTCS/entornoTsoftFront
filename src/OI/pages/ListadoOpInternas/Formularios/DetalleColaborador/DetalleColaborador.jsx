import React, { useState, useEffect } from "react";
import "./DetalleColaborador.css";

import getDataService from "../../../../../services/GetDataService";
import TopAlertsError from "../../../../../templates/alerts/TopAlerts";
import SendDataService from "../../../../../services/SendDataService";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function DetalleColaborador({
  isActive,
  cambiarEstado,
  datosFila,
}) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveDetalleColaborador: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [listadoInfoColaborador, setListadoInfoColaborador] = useState([]);
  const [listadoDocColaborador, setListadoDocColaborador] = useState([]);

  function obtenerDatos(IN_idEmpleado) {
    const url = "pages/listados/oi_listadoDetalleColab.php";
    const operationUrl = "oi_listadoDetalleColab";
    var data = {
      idEmpleado: IN_idEmpleado || "",
    };

    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);

      setListadoInfoColaborador(response.datos);
    });
  }
  function obtenerDatosDocumentos(IN_idEmpleado) {
    const url = "pages/listados/oi_listadoDocColaborador.php";
    const operationUrl = "oi_listadoDocColaborador";
    var data = {
      idEmpleado: IN_idEmpleado || "",
      num_boton: "1",
      cantidadPorPagina: "999999999",
    };

    SendDataService(url, operationUrl, data).then((response) => {
      // console.log("response", response.datos);

      setListadoDocColaborador(response.datos);
    });
  }

  const descargarCV = (datos) => {
    var date = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);

    const cvTerms = ["cv", "curriculum", "curriculum vitae"];
    const archivo = datos.find((doc) =>
      cvTerms.some((term) => doc.nombreArchivo.toLowerCase().includes(term))
    );

    if (!archivo) return;

    const byteCharacters = atob(archivo.archivo);
    const byteArray = new Uint8Array(
      byteCharacters.split("").map((char) => char.charCodeAt(0))
    );
    const blob = new Blob([byteArray], { type: `application/${archivo.tipo}` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${archivo.nombreArchivo}_${listadoInfoColaborador[0].nomEmpleado}_${date}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const descargarFeedback = (datos) => {
    var date = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
    const cvTerms = ["feedback", "fdbck"];
    const archivo = datos.find((doc) =>
      cvTerms.some((term) => doc.nombreArchivo.toLowerCase().includes(term))
    );

    if (!archivo) return;

    const byteCharacters = atob(archivo.archivo);
    const byteArray = new Uint8Array(
      byteCharacters.split("").map((char) => char.charCodeAt(0))
    );
    const blob = new Blob([byteArray], { type: `application/${archivo.tipo}` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${archivo.nombreArchivo}_${listadoInfoColaborador[0].nomEmpleado}_${date}.${archivo.tipo}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(
    function () {
      if (datosFila) {
        obtenerDatos(datosFila.idEmpleado);
        obtenerDatosDocumentos(datosFila.idEmpleado);
      }
    },
    [isActive, datosFila]
  );

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        {listadoInfoColaborador.length > 0 && (
          <Modal.Body className="body_modal_detalle_colab">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                width: "500px",
                margin: "auto",
              }}
            >
              <section className="opInternas_form_detalle_foto_perfil">
                <div className="fotoPerfil">Foto</div>
              </section>
              <section className="opInternas_form_detalle_nombre_usuario">
                <h3>{listadoInfoColaborador[0].nomEmpleado}</h3>
                <h5>{listadoInfoColaborador[0].nomCargo}</h5>
              </section>
            </div>

            {/* <br></br> */}

            <label
              className="opInternas_titulo_label"
              htmlFor="opInternas_form_detalle_skills"
            >
              Competencias actuales
            </label>
            <section
              className="opInternas_form_detalle_skills"
              name="opInternas_form_detalle_skills"
            >
              {listadoInfoColaborador.length > 0 &&
                listadoInfoColaborador.map((info) => (
                  <span key={info.nomCompetencia}>
                    {info.nomCompetencia} - <b>{info.porcentaje}%</b>
                  </span>
                ))}
            </section>
            <br></br>
            <label className="opInternas_titulo_label">
              Información adicional
            </label>
            <table className="opInternas_form_info_extra">
              <tbody>
                <tr>
                  <td style={{ width: "130px" }}>Antig&uuml;edad:</td>
                  <td>
                    <b>{listadoInfoColaborador[0].antiguedad}</b>
                  </td>
                  <td style={{ paddingLeft: "20px", width: "170px" }}>
                    Motivo liberación:
                  </td>
                  <td>
                    <b>{listadoInfoColaborador[0].motivo}</b>
                  </td>
                </tr>
                <tr>
                  <td>Días SA:</td>
                  <td>
                    <b>{listadoInfoColaborador[0].diasSinAsig}</b>
                  </td>
                  <td style={{ paddingLeft: "20px" }}>Último líder:</td>
                  <td>
                    <b>{listadoInfoColaborador[0].nomEmpLider}</b>
                  </td>
                </tr>
              </tbody>
            </table>
            <label style={{fontSize: "10pt"}}>SA: Sin asignación</label>
            <section className="opInternas_form_botones">
              <Button
                variant="secondary"
                id="btn_registrar"
                onClick={() => descargarCV(listadoDocColaborador)}
              >
                Descargar CV
              </Button>
              <Button
                variant="secondary"
                id="btn_registrar"
                onClick={() => descargarFeedback(listadoDocColaborador)}
              >
                Descargar feedback
              </Button>
              {/* <Button
                variant="secondary"
                id="btn_registrar"
                // onClick={() => downloadErrors(errores)}
              >
                Ir a EDD relacionada
              </Button> */}
              {/* <Button
              variant="secondary"
              id="btn_registrar"
              // onClick={() => downloadErrors(errores)}
            >
              Más información
            </Button> */}
            </section>
          </Modal.Body>
        )}
      </Modal>
    </>
  );
}
