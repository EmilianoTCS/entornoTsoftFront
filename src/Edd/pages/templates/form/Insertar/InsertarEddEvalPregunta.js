import React, { useState, useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TopAlertsError from "../../../../../templates/alerts/TopAlerts";
const InsertarEDDEvalPregunta = ({
  isActiveEDDEvalPregunta,
  cambiarEstado,
  EDDEvalPregunta,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomPregunta, setnomPregunta] = useState("");
  const [ordenPregunta, setordenPregunta] = useState("");
  const [tipoResp, settipoResp] = useState([""]);
  const [preguntaObligatoria, setpreguntaObligatoria] = useState([""]);

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

  function validaciones() {
    if (nomPregunta.trim() === "") {
      TopAlertsError("01", "El nombre de la pregunta no debe estar vacío");
      return true;
    } else if (ordenPregunta.trim() === "") {
      TopAlertsError("02", "El orden de la pregunta no debe estar vacío");
      return true;
    } else if (tipoResp.trim() === "") {
      TopAlertsError(
        "03",
        "El tipo de respuesta de la pregunta no debe estar vacío"
      );
      return true;
    } else if (preguntaObligatoria.trim() === "") {
      TopAlertsError(
        "04",
        "El campo pregunta obligatoria no debe no debe estar vacío"
      );
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarEddEvalPregunta.php";
      const operationUrl = "insertarEddEvalPregunta";

      let competenciaValue = idEDDEvalCompetencia;
      if (tipoResp === "T") {
        // Si el tipo de respuesta es 'TEXTO', establece el valor de competencia en null
        competenciaValue = "0";
      }
      var data = {
        usuarioCreacion: userData.usuario,
        nomPregunta: nomPregunta,
        ordenPregunta: ordenPregunta,
        idEDDEvalCompetencia: competenciaValue,
        idEDDEvaluacion: idEDDEvaluacion,
        tipoResp: tipoResp,
        preguntaObligatoria: preguntaObligatoria,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarEDDEvalPregunta(datos);
        cambiarEstado(false);
      });
    }
  }

  function actualizarEDDEvalPregunta(response) {
    listEDDEvalPregunta.push(response);
  }

  useEffect(function () {
    obtenerEDDEvalCompetencia();
    obtenerEDDEvaluacion();
  }, []);

  const [competenciaEnabled, setCompetenciaEnabled] = useState(true);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear pregunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
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
            <div>
              <label htmlFor="input_nombreDelEDDEvalPregunta">Pregunta:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre"
                type="text"
                className="form-control"
                name="input_nombreDelEDDEvalPregunta"
                id="input_nombreDelEDDEvalPregunta"
                maxLength="300"
                value={nomPregunta || ""}
                onChange={({ target }) => setnomPregunta(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_ordenPregunta">Orden:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba número"
                type="number"
                className="form-control"
                name="input_ordenPregunta"
                id="input_ordenPregunta"
                onChange={({ target }) => setordenPregunta(target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="input_TipRESP">Tipo de respuesta: </label>
              <select
                required
                className="form-control"
                name="input_TipRESP"
                id="input_TipRESP"
                onChange={({ target }) => {
                  settipoResp(target.value);
                  if (target.value === "T") {
                    setCompetenciaEnabled(false);
                  } else {
                    setCompetenciaEnabled(true);
                  }
                }}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                <option value="A">ALTERNATIVA</option>
                <option value="T">TEXTO</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input_comp">Competencia: </label>
              <select
                required
                className="form-control"
                name="input_comp"
                id="input_comp"
                placeholder="Seleccione la competencia"
                onChange={({ target }) => setidEDDEvalCompetencia(target.value)}
                disabled={!competenciaEnabled}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                <option value="0">Ninguno</option>
                {listEDDEvalCompetencia.map((valor) => (
                  <option value={valor.idEDDEvalCompetencia}>
                    {valor.nomCompetencia}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input_comp">Pregunta obligatoria: </label>
              <select
                required
                className="form-control"
                name="input_comp"
                id="input_comp"
                onChange={({ target }) => setpreguntaObligatoria(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                <option value="1">SI</option>
                <option value="0">NO</option>
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
