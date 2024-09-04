import React, { useState, useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarEmpTipoPerfil = ({
  isActiveEmpTipoPerfil,
  cambiarEstado,
  EmpTipoPerfil,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [idTipoPerfil, setidTipoPerfil] = useState("");
  const [idEmpleado, setidEmpleado] = useState("");

  const [listEmpleado, setlistEmpleado] = useState([""]);

  const [listTipoPerfil, setlistTipoPerfil] = useState([""]);
  const listEmpTipoPerfil = EmpTipoPerfil;

  const show = isActiveEmpTipoPerfil;

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
  function obtenerTipoPerfil() {
    const url = "pages/auxiliares/listadoTipoPerfilForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistTipoPerfil(response)
    );
  }
  function validaciones() {
    if (idEmpleado.trim() === "") {
      TopAlertsError("01", "El colaborador no debe estar vacío");
      return true;
    } else if (idTipoPerfil.trim() === "") {
      TopAlertsError("02", "El tipo de perfil no debe estar vacío");
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarEmpTipoPerfil.php";
      const operationUrl = "insertarEmpTipoPerfil";
      var data = {
        usuarioCreacion: userData.usuario,
        idTipoPerfil: idTipoPerfil,
        idEmpleado: idEmpleado,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
        actualizarEmpTipoPerfil(datos);
      });
    }
  }

  function actualizarEmpTipoPerfil(response) {
    listEmpTipoPerfil.push(response);
  }

  useEffect(function () {
    obtenerEmpleado();
    obtenerTipoPerfil();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title> Asociar perfil a empleado</Modal.Title>
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
                placeholder="Seleccione el Empleado"
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
              <label htmlFor="input_tipPerf">Tipo perfil: </label>
              <select
                required
                className="form-control"
                name="input_tipPerf"
                id="input_tipPerf"
                placeholder="Seleccione el tipo perfil"
                onChange={({ target }) => setidTipoPerfil(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listTipoPerfil.map((valor) => (
                  <option value={valor.idTipoPerfil}>
                    {valor.nomTipoPerfil}
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
export default InsertarEmpTipoPerfil;
