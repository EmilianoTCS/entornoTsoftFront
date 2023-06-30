import React, { useState, useEffect } from "react";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const editarEDDEvalPregunta = ({
  isActiveEditEDDEvalPregunta,
  cambiarEstado,
  idEDDEvalPregunta,
  EDDEvalPregunta,
  setEDDEvalPregunta,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomPregunta, setnomPregunta] = useState("");
  const [ordenPregunta, setordenPregunta] = useState("");

  const [idEDDEvalCompetencia, setidEDDEvalCompetencia] = useState([""]);
  const [idEDDEvaluacion, setidEDDEvaluacion] = useState([""]);

  const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);
  const [listEDDEvalCompetencia, setlistEDDEvalCompetencia] = useState([""]);

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const listEDDEvalPregunta = EDDEvalPregunta;

  const show = isActiveEditEDDEvalPregunta;

  const handleClose = () => {
    cambiarEstado(false);
    setnomPregunta(responseID[0].nomPregunta);
    setordenPregunta(responseID[0].ordenPregunta);

    setidEDDEvalCompetencia(responseID[0].idEDDEvalCompetencia);
    setidEDDEvaluacion(responseID[0].idEDDEvaluacion);

  };

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

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEDDEvalPregunta, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setnomPregunta(response[0].nomPregunta);
      setordenPregunta(response[0].ordenPregunta);

      setidEDDEvalCompetencia(response[0].idEDDEvalCompetencia);
      setidEDDEvaluacion(response[0].idEDDEvaluacion);

    });
  }, [idEDDEvalPregunta]);

  function SendData(e) {
    e.preventDefault();
    var url = "pages/editar/editarEddEvalPregunta.php";
    var operationUrl = "editarEddEvalPregunta";
    var data = {
      usuarioModificacion: userData.usuario,
      idEDDEvalPregunta: idEDDEvalPregunta,
      nomPregunta: nomPregunta === "" ? responseID[0].nomPregunta : nomPregunta,
      ordenPregunta: ordenPregunta === "" ? responseID[0].ordenPregunta : ordenPregunta,
      idEDDEvalCompetencia: idEDDEvalCompetencia === "" ? responseID[0].idEDDEvalCompetencia : idEDDEvalCompetencia,
      idEDDEvaluacion: idEDDEvaluacion === "" ? responseID[0].idEDDEvaluacion : idEDDEvaluacion,
      isActive: true,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      TopAlerts("successEdited");
      actualizarEDDEvalPregunta(EDDEvalPregunta);console.log(response);
    });

    function actualizarEDDEvalPregunta(EDDEvalPregunta) {
      const nuevosEDDEvalPregunta = listEDDEvalPregunta.map((c) =>
        c.idEDDEvalPregunta === EDDEvalPregunta.idEDDEvalPregunta ? EDDEvalPregunta : c
      );
      setEDDEvalPregunta(nuevosEDDEvalPregunta);
    }
  }

  useEffect(
    function () {
      if (idEDDEvalPregunta !== null) {
        getData();
        obtenerEDDEvalCompetencia();
        obtenerEDDEvaluacion()
      }
    },
    [idEDDEvalPregunta]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Pregunta</Modal.Title>
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
                {listEDDEvaluacion.map((valor) => (
                  <option
                    selected={valor.idEDDEvaluacion === idEDDEvaluacion ? "selected" : ""}
                    value={valor.idEDDEvaluacion}
                  >
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
                {listEDDEvalCompetencia.map((valor) => (
                  <option
                    selected={valor.idEDDEvalCompetencia === idEDDEvalCompetencia ? "selected" : ""}
                    value={valor.idEDDEvalCompetencia}
                  >
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

export default editarEDDEvalPregunta;
