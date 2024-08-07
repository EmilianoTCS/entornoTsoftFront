import React, { useState, useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TopAlertsError from "../../../../../templates/alerts/TopAlerts";


const InsertarEDDEvaluacion = ({
  isActiveEDDEvaluacion,
  cambiarEstado,
  EDDEvaluacion,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomEvaluacion, setnomEvaluacion] = useState("");
  const [fechaIni, setfechaIni] = useState("");
  const [fechaFin, setfechaFin] = useState("");
  const [tipoEvaluacion, settipoEvaluacion] = useState("");
  const [descFormulario, setdescFormulario] = useState("");

  const listEDDEvaluacion = EDDEvaluacion;

  const show = isActiveEDDEvaluacion;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/insertarEddEvaluacion.php";
    const operationUrl = "insertarEddEvaluacion";
    var data = {
      usuarioCreacion: userData.usuario,
      nomEvaluacion: nomEvaluacion,
      fechaIni: fechaIni,
      fechaFin: fechaFin,
      tipoEvaluacion: tipoEvaluacion,
      descFormulario: descFormulario,
      isActive: true,
    };

    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
      actualizarEDDEvaluacion(datos);
      cambiarEstado(false)
    });
  }

  function actualizarEDDEvaluacion(response) {
    listEDDEvaluacion.push(response);
  }

  useEffect(function () {}, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear evaluación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelEDDEvaluacion">Evaluación:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre de la evaluación"
                type="text"
                className="form-control"
                name="input_nombreDelEDDEvaluacion"
                id="input_nombreDelEDDEvaluacion"
                maxLength="50"
                onChange={({ target }) => setnomEvaluacion(target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="input_nombreDelcargo">Tipo evaluación: </label>
              <select
                required
                className="form-control"
                name="input_nombreDelcargo"
                id="input_nombreDelcargo"
                onChange={({ target }) => settipoEvaluacion(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                <option value="Referente">REFERENTE</option>
                <option value="Colaborador">COLABORADOR</option>
              </select>
            </div>
            <div>
              <label htmlFor="Descripción">Descripción de la evaluación:</label>
              <textarea
                style={{ textTransform: "uppercase" }}
                placeholder="Descripción de la evaluación"
                type="text"
                className="form-control"
                name="Descripción"
                id="Descripción"
                onChange={({ target }) => setdescFormulario(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_fechaI">Fecha inicio vigencia:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio vigencia"
                type="date"
                className="form-control"
                name="input_fechaI"
                id="input_fechaI"
                onChange={({ target }) => setfechaIni(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_fechaF">Fecha fin vigencia:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha fin vigencia"
                type="date"
                className="form-control"
                name="input_fechaF"
                id="input_fechaF"
                onChange={({ target }) => setfechaFin(target.value)}
                required
              />
            </div>
            <Button
              variant="secondary"
              type="submit"
              id="btn_registrar"
              value="Registrar"
            >
              Registrar
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default InsertarEDDEvaluacion;
