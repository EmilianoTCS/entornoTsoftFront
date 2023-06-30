import React, { useState, useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarEDDEvalPregunta = ({
  isActiveEDDEvalPregunta,
  cambiarEstado,
  EDDEvalPregunta,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomPregunta, setnomPregunta] = useState("");
  const [ordenPregunta, setordenPregunta] = useState("");

  const [idEDDEvalCompetencia, setidEDDEvalCompetencia] = useState([""]);
  const [idEDDEvaluacion, setidEDDEvaluacion] = useState([""]);

  const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);
  const [listEDDEvalCompetencia, setlistEDDEvalCompetencia] = useState([""]);

  const listEDDEvalPregunta = EDDEvalPregunta;

  const show = isActiveEDDEvalPregunta;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------
  function obtenerEDDEvalCompetencia() {
    const url = "pages/auxiliares/listadoEddEvalCompetencia.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvalCompetencia(response)
    );
  }

  function obtenerEDDEvaluacion() {
    const url = "pages/auxiliares/listadoEddEvaluacion.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvaluacion(response)
    );
  }

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/insertarEddEvalPregunta.php";
    const operationUrl = "insertarEddEvalPregunta";
    var data = {
      usuarioCreacion: userData.usuario,
      nomPregunta: nomPregunta,
      ordenPregunta: ordenPregunta,
      idEDDEvalCompetencia: idEDDEvalCompetencia,
      idEDDEvaluacion: idEDDEvaluacion,
      isActive: true,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      // TopAlerts("successCreated");
      actualizarEDDEvalPregunta(EDDEvalPregunta);
      console.log(response);
    });
  }

  function actualizarEDDEvalPregunta(response) {
    listEDDEvalPregunta.push(response);
  }

  useEffect(function () {
    obtenerEDDEvalCompetencia();
    obtenerEDDEvaluacion();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Pregunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelEDDEvalPregunta">Pregunta:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre Proyecto"
                type="text"
                className="form-control"
                name="input_nombreDelEDDEvalPregunta"
                id="input_nombreDelEDDEvalPregunta"
                value={nomPregunta || ""}
                maxLength="50"
                onChange={({ target }) => setnomPregunta(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_nombreDelEDDEvalPregunta">Orden:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre Proyecto"
                type="number"
                className="form-control"
                name="input_nombreDelEDDEvalPregunta"
                id="input_nombreDelEDDEvalPregunta"
                value={ordenPregunta || ""}
                maxLength="11"
                onChange={({ target }) => setordenPregunta(target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="input_eval">Evaluación: </label>
              <select
                required
                className="form-control"
                name="input_eval"
                id="input_eval"
                placeholder="Seleccione la Evaluación"
                onChange={({ target }) => setidEDDEvaluacion(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listEDDEvaluacion.map((valor) => (
                  <option value={valor.idEDDEvaluacion}>
                    {valor.nomEvaluacion}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_comp">Competencia: </label>
              <select
                required
                className="form-control"
                name="input_comp"
                id="input_comp"
                placeholder="Seleccione la Competencia"
                onChange={({ target }) => setidEDDEvalCompetencia(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listEDDEvalCompetencia.map((valor) => (
                  <option value={valor.idEDDEvalCompetencia}>
                    {valor.nomCompetencia}
                  </option>
                ))}
              </select>
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
export default InsertarEDDEvalPregunta;