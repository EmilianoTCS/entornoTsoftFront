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
  const [tipoResp, settipoResp] = useState([""]);
  const [preguntaObligatoria, setpreguntaObligatoria] = useState([""]);

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
    settipoResp(responseID[0].tipoResp);
    setpreguntaObligatoria(responseID[0].preguntaObligatoria);

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

  function getData(){
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEDDEvalPregunta, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setnomPregunta(response[0].nomPregunta);
      setordenPregunta(response[0].ordenPregunta);
      settipoResp(response[0].tipoResp);
      setpreguntaObligatoria(response[0].preguntaObligatoria);
      setidEDDEvalCompetencia(response[0].idEDDEvalCompetencia);
      setidEDDEvaluacion(response[0].idEDDEvaluacion);

    });
  };

  function SendData(e) {
    e.preventDefault();
    var url = "pages/editar/editarEddEvalPregunta.php";
    var operationUrl = "editarEddEvalPregunta";

    let competenciaValue = idEDDEvalCompetencia;
    if (tipoResp === 'T') {
      // Si el tipo de respuesta es 'TEXTO', establece el valor de competencia en null
      competenciaValue = '0';
    }

    var data = {
      usuarioModificacion: userData.usuario,
      idEDDEvalPregunta: idEDDEvalPregunta,
      nomPregunta: nomPregunta === "" ? responseID[0].nomPregunta : nomPregunta,
      ordenPregunta: ordenPregunta === "" ? responseID[0].ordenPregunta : ordenPregunta,
      tipoResp: tipoResp === "" ? responseID[0].tipoResp : tipoResp,
      preguntaObligatoria: preguntaObligatoria === "" ? responseID[0].preguntaObligatoria : preguntaObligatoria,
      idEDDEvalCompetencia: competenciaValue,
      idEDDEvaluacion: idEDDEvaluacion === "" ? responseID[0].idEDDEvaluacion : idEDDEvaluacion,
      isActive: true,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      TopAlerts("successEdited");
      actualizarEDDEvalPregunta(EDDEvalPregunta);
    });

    function actualizarEDDEvalPregunta(EDDEvalPregunta) {
      console.log(EDDEvalPregunta);
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

  const [competenciaEnabled, setCompetenciaEnabled] = useState(true);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar pregunta</Modal.Title>
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
            <div>
              <label htmlFor="input_nombreDelEDDEvalPregunta">Pregunta:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre"
                type="text"
                className="form-control"
                name="input_nombreDelEDDEvalPregunta"
                id="input_nombreDelEDDEvalPregunta"
                value={nomPregunta || ""}
                maxLength="300"
                onChange={({ target }) => setnomPregunta(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_nombreDelEDDEvalPregunta">Orden:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba número"
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
              <label htmlFor="input_TipRESP">Tipo de respuesta: </label>
              <select
                required
                className="form-control"
                name="input_TipRESP"
                id="input_TipRESP"
                value={tipoResp || ""}
                onChange={({ target }) => {
                  settipoResp(target.value);
                  if (target.value === 'T') {
                    setCompetenciaEnabled(false);
                  } else {
                    setCompetenciaEnabled(true);
                  }
                }}
              >
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
                placeholder="Seleccione la Competencia"
                onChange={({ target }) => setidEDDEvalCompetencia(target.value)}
                disabled={!competenciaEnabled}
              >
                
                {listEDDEvalCompetencia.map((valor) => (
                  <option
                    selected={valor.idEDDEvalCompetencia === idEDDEvalCompetencia ? "selected" : ""}
                    value={valor.idEDDEvalCompetencia}
                  >
                    {valor.nomCompetencia}
                  </option>
                  
                ))}
                 <option value='0'>
                  Ninguno
                </option>
              </select>
            </div>




            <div className="form-group">
              <label htmlFor="input_comp">Pregunta obligatoria: </label>
              <select
                required
                className="form-control"
                name="input_comp"
                id="input_comp"
                value={preguntaObligatoria || ""}
                onChange={({ target }) => setpreguntaObligatoria(target.value)}
              >
                <option value="1">
                  SI
                </option>
                <option value="0">
                  NO
                </option>
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
