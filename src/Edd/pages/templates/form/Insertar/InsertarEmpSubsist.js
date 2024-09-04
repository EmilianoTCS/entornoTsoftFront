import React, { useState, useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarEmpSubsist = ({
  isActiveEmpSubsist,
  cambiarEstado,
  EmpSubsist,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [idEmpleado, setidEmpleado] = useState("");
  const [idSubsistema, setidSubsistema] = useState("");

  const [listEmpleado, setlistEmpleado] = useState([""]);
  const [listSubsistema, setlistSubsistema] = useState([""]);

  const listEmpSubsist = EmpSubsist;

  const show = isActiveEmpSubsist;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------
  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }

  function obtenerSubsist() {
    const url = "pages/auxiliares/listadoSubsistemaForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistSubsistema(response)
    );
  }

  function validaciones() {
    if (idEmpleado.trim() === "") {
      TopAlertsError("01", "El colaborador no debe estar vacío");
      return true;
    } else if (idSubsistema.trim() === "") {
      TopAlertsError("02", "El subsistema no debe estar vacío");
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarEmpSubsist.php";
      const operationUrl = "insertarEmpSubsist";
      var data = {
        usuarioCreacion: userData.usuario,
        idEmpleado: idEmpleado,
        idSubsistema: idSubsistema,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
        actualizarEmpSubsist(datos);
      });
    }
  }

  function actualizarEmpSubsist(response) {
    listEmpSubsist.push(response);
  }

  useEffect(function () {
    obtenerEmpleado();
    obtenerSubsist();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Asociar empleado a subsistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Empleado">Empleado: </label>
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
              <label htmlFor="input_SubSistema">SubSistema: </label>
              <select
                required
                className="form-control"
                name="input_SubSistema"
                id="input_SubSistema"
                placeholder="Seleccione el subsistema"
                onChange={({ target }) => setidSubsistema(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listSubsistema.map((valor) => (
                  <option value={valor.idSubsistema}>
                    {valor.nomSubsistema}
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
export default InsertarEmpSubsist;
