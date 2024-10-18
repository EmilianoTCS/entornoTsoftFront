import React, { useState, useEffect } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TopAlertsError from "../../alerts/TopAlerts";

const InsertarSesion = ({ isActiveSesion, cambiarEstado, sesion }) => {
  // ----------------------CONSTANTES----------------------------
  const [nroSesion, setnroSesion] = useState("");
  const [nomSesion, setnomSesion] = useState("");
  const [tipoSesion, settipoSesion] = useState("");
  const [tipoSesionHH, settipoSesionHH] = useState("");
  const [duracionSesionHH, setduracionSesionHH] = useState("");

  const [idRamo, setidRamo] = useState("");

  const [listRamo, setlistRamo] = useState([""]);
  const [listTipoSesion, setlistTipoSesion] = useState([""]);
  const [listTipoSesionHH, setlistTipoSesionHH] = useState([""]);

  const listSesion = sesion;

  const show = isActiveSesion;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerRamo() {
    const url = "pages/auxiliares/listadoRamoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistRamo(response));
  }

  function obtenerTipoSesion() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "AF",
      subTipoConfDato: "TIPO_SESION",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setlistTipoSesion(response);
    });
  }
  function obtenerTipoSesionHH() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "AF",
      subTipoConfDato: "TIPO_SESION_HH",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setlistTipoSesionHH(response);
    });
  }
  function validaciones() {
    if (nroSesion.trim() <= 0) {
      TopAlertsError("01", "El número de sesión no debe estar vacío");
      return true;
    } else if (nomSesion.trim() === "") {
      TopAlertsError("02", "El nombre de la sesión no debe estar vacío");
      return true;
    } else if (tipoSesion.trim() === "") {
      TopAlertsError("03", "El tipo de sesión no puede estar vacío");
      return true;
    } else if (tipoSesionHH.trim() === "") {
      TopAlertsError("04", "El tipo de HH de la sesión no puede estar vacío");
      return true;
    } else if (duracionSesionHH <= 0) {
      TopAlertsError("05", "La duración de la sesión debe ser mayor a cero");
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarSesion.php";
      const operationUrl = "insertarSesion";
      var data = {
        usuarioCreacion: userData.usuario,
        nroSesion: nroSesion,
        nomSesion: nomSesion,
        tipoSesion: tipoSesion,
        tipoSesionHH: tipoSesionHH,
        duracionSesionHH: duracionSesionHH,
        idRamo: idRamo,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...sesion } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarSesion(sesion);
        cambiarEstado(false);
      });
    }
  }

  function actualizarSesion(response) {
    listSesion.push(response);
  }

  useEffect(function () {
    obtenerRamo();
    obtenerTipoSesion();
    obtenerTipoSesionHH();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Insertar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_NotaExamen">Número de sesión:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Número de la sesion"
                type="number"
                className="form-control"
                name="input_NotaExamen"
                id="input_NotaExamen"
                maxLength="11"
                onChange={({ target }) => setnroSesion(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_nombreDelSesion">
                Nombre de la sesión:
              </label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre de la Sesion"
                type="text"
                className="form-control"
                name="input_nombreDelSesion"
                id="input_nombreDelSesion"
                maxLength="50"
                onChange={({ target }) => setnomSesion(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_tipoDeShh">Tipo sesión:</label>
              <select
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba tipo del ramo HH"
                className="form-control"
                name="input_tipoDeShh"
                id="input_tipoDeShh"
                onChange={({ target }) => settipoSesion(target.value)}
                required
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listTipoSesion &&
                  listTipoSesion.map((valor) => (
                    <option value={valor.datoVisible}>
                      {valor.datoVisible}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_tipoDeS">Tipo sesión HH:</label>
              <select
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba tipo del ramo HH"
                className="form-control"
                name="input_tipoDeS"
                id="input_tipoDeS"
                onChange={({ target }) => settipoSesionHH(target.value)}
                required
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listTipoSesionHH &&
                  listTipoSesionHH.map((valor) => (
                    <option value={valor.datoVisible}>
                      {valor.datoVisible}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_duracionSesion">
                Duración de la sesión:
              </label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba la duración de la sesion"
                type="number"
                className="form-control"
                name="input_duracionSesion"
                id="input_duracionSesion"
                onChange={({ target }) => setduracionSesionHH(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_Pais">Ramo:</label>
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
export default InsertarSesion;
