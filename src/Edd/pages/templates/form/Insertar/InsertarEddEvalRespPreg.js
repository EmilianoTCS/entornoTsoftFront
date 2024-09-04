import React, { useState, useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarEDDEvalRespPreg = ({
  isActiveEDDEvalRespPreg,
  cambiarEstado,
  EDDEvalRespPreg,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomRespPreg, setnomRespPreg] = useState("");

  const [listadoEvaluaciones, setListadoEvaluaciones] = useState([""]);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);

  const [ordenRespPreg, setordenRespPreg] = useState("");

  const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState("");

  const [listEDDEvalPregunta, setlistEDDEvalPregunta] = useState([""]);

  const listEDDEvalRespPreg = EDDEvalRespPreg;

  const show = isActiveEDDEvalRespPreg;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerEvaluacion() {
    const url = "pages/auxiliares/listadoEddEvaluacion.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setListadoEvaluaciones(response)
    );
  }

  function obtenerEvalPreg(idEvaluacion) {
    const url = "pages/auxiliares/listadoEddEvalPregunta.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      const filtered = response.filter(
        (item) => item.idEvaluacion === idEvaluacion
      );
      setlistEDDEvalPregunta(filtered);
    });
  }

  function validaciones() {
    if (nomRespPreg.trim() === "") {
      TopAlertsError("01", "La respuesta no debe estar vacía");
      return true;
    } else if (ordenRespPreg.trim() === "") {
      TopAlertsError("02", "El orden de la respuesta no debe estar vacío");
      return true;
    } else if (idEDDEvalPregunta.trim() === "") {
      TopAlertsError("03", "La pregunta no debe estar vacía");
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarEddEvalRespPreg.php";
      const operationUrl = "insertarEddEvalRespPreg";
      var data = {
        usuarioCreacion: userData.usuario,
        nomRespPreg: nomRespPreg,
        ordenRespPreg: ordenRespPreg,
        idEDDEvalPregunta: idEDDEvalPregunta,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
        actualizarEDDEvalRespPreg(datos);
      });
    }
  }

  function actualizarEDDEvalRespPreg(response) {
    listEDDEvalRespPreg.push(response);
  }

  useEffect(function () {
    obtenerEvaluacion();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear respuesta de pregunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Evaluacion">Evaluación: </label>
              <select
                required
                className="form-control"
                name="input_Evaluacion"
                id="input_Evaluacion"
                placeholder="Seleccione una evaluación"
                onChange={({ target }) => {
                  setSelectedEvaluacion(target.value);
                  obtenerEvalPreg(target.value);
                }}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listadoEvaluaciones.map((valor) => (
                  <option value={valor.idEDDEvaluacion}>
                    {valor.nomEvaluacion}
                  </option>
                ))}
              </select>
            </div>

            {selectedEvaluacion ? (
              <>
                <div className="form-group">
                  <label htmlFor="input_EvalPregunta">Pregunta: </label>
                  <select
                    required
                    className="form-control"
                    name="input_EvalPregunta"
                    id="input_EvalPregunta"
                    placeholder="Seleccione la EvalPreg"
                    onChange={({ target }) =>
                      setidEDDEvalPregunta(target.value)
                    }
                  >
                    <option hidden value="">
                      Desplegar lista
                    </option>
                    {listEDDEvalPregunta.map((valor) => (
                      <option
                        // selected={valor.idEDDEvalPregunta === idEDDEvalPregunta ? "selected" : ""}
                        value={valor.idEDDEvalPregunta}
                      >
                        {valor.nomPregunta}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="input_Orden">Orden:</label>
                  <input
                    style={{ textTransform: "uppercase" }}
                    placeholder="Escriba número"
                    type="number"
                    className="form-control"
                    name="input_Orden"
                    id="input_Orden"
                    maxLength="11"
                    onChange={({ target }) => setordenRespPreg(target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input_TipRESP">Respuesta: </label>
                  <select
                    required
                    className="form-control"
                    name="input_TipRESP"
                    id="input_TipRESP"
                    onChange={({ target }) => setnomRespPreg(target.value)}
                  >
                    <option hidden value="">
                      Desplegar lista
                    </option>

                    <option value="<TEXTO>">TIPO TEXTO</option>
                    <option disabled>ALTERNATIVAS</option>
                    <option value="MUY BUENO">MUY BUENO</option>
                    <option value="BUENO">BUENO</option>
                    <option value="MEDIO">MEDIO</option>
                    <option value="NO SATISFACTORIO">NO SATISFACTORIO</option>
                  </select>
                </div>
              </>
            ) : null}
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
export default InsertarEDDEvalRespPreg;
