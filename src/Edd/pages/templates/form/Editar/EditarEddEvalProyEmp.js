import React, { useState, useEffect } from "react";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";
import TopAlertsError from "../../../../../templates/alerts/TopAlerts";

const EditarEddEvalProyEmp = ({
  isActiveEditEDDEvalProyEmp,
  cambiarEstado,
  idEDDEvalProyEmp,
  EDDEvalProyEmp,
  setEDDEvalProyEmp,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------

  const [evalRespondida, setevalRespondida] = useState("");
  const [cicloEvaluacion, setcicloEvaluacion] = useState("");

  const [idEDDEvaluacion, setidEDDEvaluacion] = useState("");
  const [idEDDProyEmpEvaluador, setidEDDProyEmpEvaluador] = useState("");
  const [idEDDProyEmpEvaluado, setidEDDProyEmpEvaluado] = useState("");

  const [listEDDProyEmpEvaluador, setlistEDDProyEmpEvaluador] = useState([""]);
  const [listEDDProyEmpEvaluado, setlistEDDProyEmpEvaluado] = useState([""]);

  const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const listEDDEvalProyEmp = EDDEvalProyEmp;

  var [idProyecto, setidProyecto] = useState("0");
  const [listProyecto, setlistProyecto] = useState([""]);

  const show = isActiveEditEDDEvalProyEmp;

  const handleClose = () => {
    cambiarEstado(false);
    // setResponseID('');
    // setidProyecto('0');
    // setidEDDEvaluacion('');
    // setidEDDProyEmpEvaluado('');
    // setidEDDProyEmpEvaluador('');
    // setevalRespondida('');
  };

  // ----------------------FUNCIONES----------------------------

  function obtenerProyecto() {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    var data = {
      idServicio: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setlistProyecto(data);
    });
  }

  function obtenerEvaluadorEvaluado() {
    const url = "pages/auxiliares/listadoEddProyEmp.php";
    const operationUrl = "listados";
    var data = {
      idProyecto: idProyecto, // Usar el proyecto seleccionado
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setlistEDDProyEmpEvaluado(response);
      setlistEDDProyEmpEvaluador(response);
    });
  }

  function obtenerEvaluacion() {
    const url = "pages/auxiliares/listadoEddEvaluacion.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvaluacion(response)
    );
  }
  const getData = () => {
    const url = "pages/seleccionar/seleccionarDatos.php";

    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEDDEvalProyEmp, nombreTabla: nombreTabla };

    SendDataService(url, operationUrl, data).then((response) => {
      setResponseID(response);
      setidProyecto(response[0].idProyecto);
      setidEDDEvaluacion(response[0].idEDDEvaluacion);
      setidEDDProyEmpEvaluado(response[0].idEDDProyEmpEvaluado);
      setidEDDProyEmpEvaluador(response[0].idEDDProyEmpEvaluador);
      setevalRespondida(response[0].evalRespondida);
      setcicloEvaluacion(response[0].cicloEvaluacion);
    });
  };

  // function ExisteAsocProy(idEDDProyEmpEvaluado,idEDDProyEmpEvaluador,idProyecto) {
  //   var url = "";
  //   var operationUrl = "";

  // }

  function SendData(e) {
    e.preventDefault();

    if (idEDDProyEmpEvaluado === idEDDProyEmpEvaluador) {
      // Los valores son iguales, mostrar una alerta
      TopAlerts("MismoEvaludorYEvaluado");
    }
    // else if (!ExisteAsocProy(idEDDProyEmpEvaluado,idEDDProyEmpEvaluador,idProyecto)) {
    // e.preventDefault();
    var url = "pages/editar/editarEddEvalProyEmp.php";
    var operationUrl = "editarEddEvalProyEmp";
    var data = {
      usuarioModificacion: userData.usuario,
      idEDDEvalProyEmp: idEDDEvalProyEmp,
      evalRespondida: evalRespondida === "" ? responseID[0].evalRespondida : 0,
      idEDDEvaluacion:
        idEDDEvaluacion === ""
          ? responseID[0].idEDDEvaluacion
          : idEDDEvaluacion,
      idEDDProyEmpEvaluado:
        idEDDProyEmpEvaluado === ""
          ? responseID[0].idEDDProyEmpEvaluado
          : idEDDProyEmpEvaluado,

      idEDDProyEmpEvaluador:
        idEDDProyEmpEvaluador === ""
          ? responseID[0].idEDDProyEmpEvaluador
          : idEDDProyEmpEvaluador,

      cicloEvaluacion:
        cicloEvaluacion === ""
          ? responseID[0].cicloEvaluacion
          : cicloEvaluacion,

      isActive: true,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      if (response[0].OUT_CODRESULT !== "00") {
        TopAlertsError(response[0].OUT_CODRESULT, response[0].OUT_MJERESULT);
      } else {
        TopAlerts("successEdited");
        actualizarEDDEvalProyEmp(EDDEvalProyEmp);
      }
    });
  }

  function actualizarEDDEvalProyEmp(EDDEvalProyEmp) {
    const nuevosEDDEvalProyEmp = listEDDEvalProyEmp.map((c) =>
      c.idEDDEvalProyEmp === EDDEvalProyEmp.idEDDEvalProyEmp
        ? EDDEvalProyEmp
        : c
    );
    setEDDEvalProyEmp(nuevosEDDEvalProyEmp);
  }

  useEffect(
    function () {
      if (idEDDEvalProyEmp !== null) {
        getData();
        obtenerEvaluacion();
        obtenerEvaluadorEvaluado();
        obtenerProyecto();
      }
    },
    [idEDDEvalProyEmp]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>
            Editar evaluación al <br></br> proyecto - colaborador.
          </Modal.Title>
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
                placeholder="Seleccione la evaluación"
                onChange={({ target }) => setidEDDEvaluacion(target.value)}
              >
                {listEDDEvaluacion.map((valor) => (
                  <option
                    selected={
                      valor.idEDDEvaluacion === idEDDEvaluacion
                        ? "selected"
                        : ""
                    }
                    value={valor.idEDDEvaluacion}
                  >
                    {valor.nomEvaluacion}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input_proyemp">Proyecto: </label>
              <select
                required
                className="form-control"
                name="input_proyemp"
                id="input_proyemp"
                placeholder="Seleccione la Proyecto"
                onChange={({ target }) => {
                  idProyecto = target.value;
                  obtenerEvaluadorEvaluado(); // Llama a la función para obtener evaluados
                  setidProyecto(target.value);
                }}
                value={idProyecto}
              >
                {listProyecto.map((valor) => (
                  <option
                    key={valor.idEDDProyecto}
                    value={valor.idEDDProyecto}
                    selected={
                      valor.idEDDProyecto === idProyecto ? "selected" : ""
                    }
                  >
                    {valor.nomProyecto}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input_proyemp">Proyecto - Evaluador: </label>
              <select
                required
                className="form-control"
                name="input_proyemp"
                id="input_proyemp"
                placeholder="Seleccione la Proyecto + Evaluador"
                onChange={({ target }) =>
                  setidEDDProyEmpEvaluador(target.value)
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listEDDProyEmpEvaluador.map((valor) => (
                  <option
                    selected={
                      valor.idEDDProyEmp === idEDDProyEmpEvaluador
                        ? "selected"
                        : ""
                    }
                    value={valor.idEDDProyEmp}
                  >
                    {valor.nomProyEmp}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input_proyemp">Proyecto - Evaluado: </label>
              <select
                required
                className="form-control"
                name="input_proyemp"
                id="input_proyemp"
                placeholder="Seleccione la Proyecto + Evaluado"
                onChange={({ target }) => setidEDDProyEmpEvaluado(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listEDDProyEmpEvaluado.map((valor) => (
                  <option
                    selected={
                      valor.idEDDProyEmp === idEDDProyEmpEvaluado
                        ? "selected"
                        : ""
                    }
                    value={valor.idEDDProyEmp}
                  >
                    {valor.nomProyEmp}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input_proyemp">Ciclo de evaluación: </label>
              <input
                required
                disabled
                className="form-control"
                name="input_proyemp"
                id="input_proyemp"
                type="number"
                value={cicloEvaluacion}
                // placeholder=""
                onChange={({ target }) => setcicloEvaluacion(target.value)}
              ></input>
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

export default EditarEddEvalProyEmp;
