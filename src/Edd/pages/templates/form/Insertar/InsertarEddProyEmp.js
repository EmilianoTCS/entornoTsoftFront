import React, { useState, useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarEDDProyEmp = ({
  isActiveEDDProyEmp,
  cambiarEstado,
  EDDProyEmp,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [cargoEnProy, setcargoEnProy] = useState("");

  const [idProyecto, setidProyecto] = useState("");
  const [idEmpleado, setidEmpleado] = useState("");

  const [listProyecto, setlistProyecto] = useState([""]);
  const [listEmpleado, setlistEmpleado] = useState([""]);

  const listEDDProyEmp = EDDProyEmp;

  const show = isActiveEDDProyEmp;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerProyecto() {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistProyecto(response)
    );
  }
  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }

  function SendData(e) {
    // e.preventDefault();
    const url = "pages/insertar/insertarEddProyEmp.php";
    const operationUrl = "insertarEddProyEmp";
    var data = {
      usuarioCreacion: userData.usuario,
      cargoEnProy: cargoEnProy,
      idProyecto: idProyecto,
      idEmpleado: idEmpleado,
      isActive: true,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
        TopAlerts("successCreated");
      actualizarEDDProyEmp(EDDProyEmp);
      console.log(response);
    });
  }

  function actualizarEDDProyEmp(response) {
    listEDDProyEmp.push(response);
  }

  useEffect(function () {
    obtenerEmpleado();
    obtenerProyecto();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title> Asociar proyecto - empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_serv">Proyecto: </label>
              <select
                required
                className="form-control"
                name="input_Empleado"
                id="input_Empleado"
                placeholder="Seleccione el Empleado"
                onChange={({ target }) => setidProyecto(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listProyecto.map((valor) => (
                  <option value={valor.idEDDProyecto}>
                    {valor.nomProyecto}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_serv">Empleado: </label>
              <select
                required
                className="form-control"
                name="input_Empleado"
                id="input_Empleado"
                placeholder="Seleccione el empleado"
                onChange={({ target }) => setidEmpleado(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listEmpleado.map((valor) => (
                  <option value={valor.idEmpleado}>{valor.nomEmpleado}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_nombreDelcargo">Cargo en proyecto: </label>
              <select
                required
                className="form-control"
                name="input_nombreDelcargo"
                id="input_nombreDelcargo"
                onChange={({ target }) => setcargoEnProy(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                <option value="Referente">
                  REFERENTE
                </option>
                <option value="Colaborador">
                  COLABORADOR
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
export default InsertarEDDProyEmp;
