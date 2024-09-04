import React, { useState, useEffect } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TopAlertsError from "../../alerts/TopAlerts";

const InsertarRamoExamen = ({
  isActiveRamoExamen,
  cambiarEstado,
  ramoExamen,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomExamen, setnomExamen] = useState("");
  const [fechaExamen, setfechaExamen] = useState("");
  const [idRamo, setidRamo] = useState("");

  const [listRamo, setlistRamo] = useState([""]);

  const listRamoExamen = ramoExamen;

  const show = isActiveRamoExamen;
  const now = new Date();
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerRamo() {
    const url = "pages/auxiliares/listadoRamoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistRamo(response));
  }

  function validaciones() {
    if (nomExamen.trim() === "") {
      TopAlertsError("01", "El nombre del examen no puede estar vacío");
      return true;
    } else if (new Date(fechaExamen) < now) {
      TopAlertsError(
        "02",
        "La fecha del examen no puede ser menor a la actual"
      );
      return true;
    } else if (idRamo < 0) {
      TopAlertsError("02", "El nombre del ramo no puede estar vacío");
      return true;
    } else {
      return false;
    }
  }

  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarRamoExamen.php";
      const operationUrl = "insertarRamoExamen";
      var data = {
        usuarioCreacion: userData.usuario,
        nomExamen: nomExamen,
        fechaExamen: fechaExamen,
        idRamo: idRamo,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...ramoExamen } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRamoExamen(ramoExamen);
        cambiarEstado(false);
      });
    }
  }

  function actualizarRamoExamen(response) {
    listRamoExamen.push(response);
  }

  useEffect(function () {
    obtenerRamo();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Insertar examen de ramo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelRamoExamen">Nombre examen:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre del examen"
                type="text"
                className="form-control"
                name="input_nombreDelRamoExamen"
                id="input_nombreDelRamoExamen"
                maxLength="50"
                onChange={({ target }) => setnomExamen(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_fechaI">Fecha examen:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio"
                type="date"
                className="form-control"
                name="input_fechaI"
                id="input_fechaI"
                onChange={({ target }) => setfechaExamen(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_Pais">Nombre del ramo:</label>
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
export default InsertarRamoExamen;
