import React, { useState, useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarEDDEvalProyEmp = ({
  isActiveEDDEvalProyEmp,
  cambiarEstado,
  EDDEvalProyEmp,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [evalRespondida, setevalRespondida] = useState("");

  const [idEDDEvaluacion, setidEDDEvaluacion] = useState("");
  const [idEDDProyEmpEvaluador, setidEDDProyEmpEvaluador] = useState("");
  const [idEDDProyEmpEvaluado, setidEDDProyEmpEvaluado] = useState("");

  const [listEDDProyEmpEvaluador, setlistEDDProyEmpEvaluador] = useState([""]);
  const [listEDDProyEmpEvaluado, setlistEDDProyEmpEvaluado] = useState([""]);

  const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);

  const listEDDEvalProyEmp = EDDEvalProyEmp;

  const show = isActiveEDDEvalProyEmp;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerEvaluado() {
    const url = "pages/auxiliares/listadoEddProyEmp.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setlistEDDProyEmpEvaluado(response)
    }
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
  // filtro = TECH & FUN 
  // function filterItems(listEDDProyEmpEvaluado, filtro) {
  //   var listFiltrada = listEDDProyEmpEvaluado.filter((listOriginal) => listOriginal.toLowerCase().includes(filtro.toLowerCase()))
  //   console.log(listFiltrada);
  //   return listFiltrada;
  // }



  function SendData(e) {
    // e.preventDefault();
    const url = "pages/insertar/insertarEddEvalProyEmp.php";
    const operationUrl = "insertarEddEvalProyEmp";
    var data = {
      usuarioCreacion: userData.usuario,
      evalRespondida: 0,
      idEDDProyEmpEvaluado: idEDDProyEmpEvaluado,
      idEDDProyEmpEvaluador: idEDDProyEmpEvaluador,
      idEDDEvaluacion: idEDDEvaluacion,
      isActive: true,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      TopAlerts("successCreated");
      actualizarEDDEvalProyEmp(EDDEvalProyEmp);
      console.log(response);
    });
  }

  function actualizarEDDEvalProyEmp(response) {
    listEDDEvalProyEmp.push(response);
  }

  useEffect(function () {
    obtenerEvaluacion();
    obtenerEvaluado();
    obtenerEvaluador()
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Asociar evaluación al <br></br>proyecto - colaborador</Modal.Title>
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
              <label htmlFor="input_proyemp">Proyecto - Evaluador: </label>
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
                  <option value={valor.idEDDProyEmp}>{valor.nomProyEmp}</option>
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
                placeholder="Seleccione la Proyecto + Evaluador"
                onChange={({ target }) => setidEDDProyEmpEvaluador(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listEDDProyEmpEvaluador.map((valor) => (
                  <option value={valor.idEDDProyEmp}>{valor.nomProyEmp}</option>
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
export default InsertarEDDEvalProyEmp;
