import React, { useState, useEffect } from "react";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

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

  const [idEDDEvaluacion, setidEDDEvaluacion] = useState("");
  const [idEDDProyEmpEvaluador, setidEDDProyEmpEvaluador] = useState("");
  const [idEDDProyEmpEvaluado, setidEDDProyEmpEvaluado] = useState("");

  const [listEDDProyEmpEvaluador, setlistEDDProyEmpEvaluador] = useState([""]);
  const [listEDDProyEmpEvaluado, setlistEDDProyEmpEvaluado] = useState([""]);

  const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const listEDDEvalProyEmp = EDDEvalProyEmp;

  const show = isActiveEditEDDEvalProyEmp;

  const handleClose = () => {
    cambiarEstado(false);
    setidEDDEvaluacion(responseID[0].idEDDEvaluacion);

    setidEDDEvaluacion(responseID[0].idEDDEvaluacion);
    setidEDDProyEmpEvaluador(responseID[0].idEDDProyEmpEvaluador);
    setidEDDProyEmpEvaluado(responseID[0].idEDDProyEmpEvaluado);

    setevalRespondida(responseID[0].evalRespondida);

  };

  // ----------------------FUNCIONES----------------------------
  function obtenerEvaluado() {
    const url = "pages/auxiliares/listadoEddProyEmp.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
    setlistEDDProyEmpEvaluado(response)
    );
  }


  function obtenerEvaluador() {
    const url = "pages/auxiliares/listadoEddProyEmp.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
    setlistEDDProyEmpEvaluador(response)
    );
  }
  function obtenerEvaluacion() {
    const url = "pages/auxiliares/listadoEddEvaluacion.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvaluacion(response)
    );
  }

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEDDEvalProyEmp, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setidEDDEvaluacion(response[0].idEDDEvaluacion);
      setidEDDEvaluacion(response[0].idEDDEvaluacion);
      setidEDDProyEmpEvaluado(response[0].idEDDProyEmpEvaluado);
      setidEDDProyEmpEvaluador(response[0].idEDDProyEmpEvaluador);

      setevalRespondida(response[0].evalRespondida);
    });
  }, [idEDDEvalProyEmp]);

  function SendData(e) {
    // e.preventDefault();
    var url = "pages/editar/editarEddEvalProyEmp.php";
    var operationUrl = "editarEddEvalProyEmp";
    var data = {
      usuarioModificacion: userData.usuario,
      idEDDEvalProyEmp: idEDDEvalProyEmp,
      evalRespondida:
        evalRespondida === "" ? responseID[0].evalRespondida : 0,
      idEDDEvaluacion:
        idEDDEvaluacion === ""
          ? responseID[0].idEDDEvaluacion
          : idEDDEvaluacion,
          idEDDProyEmpEvaluado:
          idEDDProyEmpEvaluado === "" ? responseID[0].idEDDProyEmpEvaluado : idEDDProyEmpEvaluado,

          idEDDProyEmpEvaluador:
          idEDDProyEmpEvaluador === "" ? responseID[0].idEDDProyEmpEvaluador : idEDDProyEmpEvaluador,

      isActive: true,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      TopAlerts("successEdited");
      actualizarEDDEvalProyEmp(EDDEvalProyEmp);console.log(response);
    });

    function actualizarEDDEvalProyEmp(EDDEvalProyEmp) {
      const nuevosEDDEvalProyEmp = listEDDEvalProyEmp.map((c) =>
        c.idEDDEvalProyEmp === EDDEvalProyEmp.idEDDEvalProyEmp
          ? EDDEvalProyEmp
          : c
      );
      setEDDEvalProyEmp(nuevosEDDEvalProyEmp);
    }
  }

  useEffect(
    function () {
      if (idEDDEvalProyEmp !== null) {
        getData();
        obtenerEvaluacion();
        obtenerEvaluado();
        obtenerEvaluador()
      }
    },
    [idEDDEvalProyEmp]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
        <Modal.Title>Editar evaluación al <br></br>proyecto - colaborador</Modal.Title>
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
                    selected={valor.idEDDEvaluacion === idEDDEvaluacion ? "selected" : ""}
                    value={valor.idEDDEvaluacion}
                  >
                    {valor.nomEvaluacion}
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
                onChange={({ target }) => setidEDDProyEmpEvaluador(target.value)}
              >
                {listEDDProyEmpEvaluador.map((valor) => (
                  <option
                    selected={valor.idEDDProyEmp === idEDDProyEmpEvaluador ? "selected" : ""}
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
                {listEDDProyEmpEvaluado.map((valor) => (
                  <option
                    selected={valor.idEDDProyEmp === idEDDProyEmpEvaluado ? "selected" : ""}
                    value={valor.idEDDProyEmp}
                  >
                    {valor.nomProyEmp}
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

export default EditarEddEvalProyEmp;
