import React, { useState, useEffect } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import TopAlertsError from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarRelatorRamo = ({
  isActiveRelatorRamo,
  cambiarEstado,
  relatorRamo,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [fechaIni, setfechaIni] = useState("");
  const [fechaFin, setfechaFin] = useState("");

  const [idEmpleado, setidEmpleado] = useState("");
  const [idRamo, setidRamo] = useState("");

  const [listEmpleado, setlistEmpleado] = useState([""]);
  const [listRamo, setlistRamo] = useState([""]);

  const listRelatorRamo = relatorRamo;

  const show = isActiveRelatorRamo;

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

  function obtenerRamo() {
    const url = "pages/auxiliares/listadoRamoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistRamo(response));
  }

  function validaciones() {
    if (idEmpleado < 0) {
      TopAlertsError("01", "El nombre del relator no puede estar vacío");
      return true;
    } else if (idRamo < 0) {
      TopAlertsError("02", "El nombre del ramo no debe estar vacío");
      return true;
    } else if (fechaFin) {
      if (fechaIni > fechaFin) {
        TopAlertsError(
          "03",
          "La fecha inicio no puede ser mayor a la fecha término"
        );
        return true;
      }
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarRelatorRamo.php";
      const operationUrl = "insertarRelatorRamo";
      var data = {
        usuarioCreacion: userData.usuario,
        fechaIni: fechaIni,
        fechaFin: fechaFin,

        idEmpleado: idEmpleado,
        idRamo: idRamo,

        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...relatorRamo } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRelatorRamo(relatorRamo);
        cambiarEstado(false);
      });
    }
  }

  function actualizarRelatorRamo(response) {
    listRelatorRamo.push(response);
  }

  useEffect(function () {
    obtenerEmpleado();
    obtenerRamo();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear RelatorRamo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_fechaI">Fecha inicio:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio"
                value={fechaIni || ""}
                type="date"
                className="form-control"
                name="input_fechaI"
                id="input_fechaI"
                onChange={({ target }) => setfechaIni(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_fechaI">Fecha Fin:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha fin"
                value={fechaFin || ""}
                type="date"
                className="form-control"
                name="input_fechaI"
                id="input_fechaI"
                onChange={({ target }) => setfechaFin(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_Empleado">Relator:</label>
              <select
                required
                type="text"
                className="form-control"
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

            <div>
              <label htmlFor="input_Ramo">Ramo:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidRamo(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listRamo.map((valor) => (
                  <option value={valor.idRamo}>{valor.nomRamo}</option>
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
export default InsertarRelatorRamo;
