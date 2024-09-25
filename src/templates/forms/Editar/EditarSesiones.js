import React, { useState, useEffect } from "react";
import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";
import TopAlertsError from "../../alerts/TopAlerts";

const EditarSesion = ({
  isActiveEditSesion,
  cambiarEstado,
  idSesion,
  sesion,
  setSesion,
  nombreTabla,
}) => {
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
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [responseID, setResponseID] = useState([""]);
  const listSesion = sesion;

  const show = isActiveEditSesion;

  const handleClose = () => {
    cambiarEstado(false);
    setnroSesion(responseID[0].nroSesion);
    setnomSesion(responseID[0].nomSesion);
    settipoSesion(responseID[0].tipoSesion);
    settipoSesionHH(responseID[0].tipoSesionHH);
    setduracionSesionHH(responseID[0].duracionSesionHH);
    setidRamo(responseID[0].idRamo);
  };
  // ----------------------FUNCIONES----------------------------
  function obtenerRamo() {
    const url = "pages/auxiliares/listadoRamoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistRamo(response));
  }
  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idSesion, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      setResponseID(response);
      setnroSesion(response[0].nroSesion);
      setnomSesion(response[0].nomSesion);
      settipoSesion(response[0].tipoSesion);
      settipoSesionHH(response[0].tipoSesionHH);
      setduracionSesionHH(response[0].duracionSesionHH);
      setidRamo(response[0].idRamo);
    });
  }, [idSesion]);

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
      const url = "pages/editar/editarSesion.php";
      const operationUrl = "editarSesion";

      var data = {
        usuarioModificacion: userData.usuario,
        idSesion: idSesion,
        nroSesion: nroSesion === "" ? responseID[0].nroSesion : nroSesion,
        nomSesion: nomSesion === "" ? responseID[0].nomSesion : nomSesion,
        tipoSesion: tipoSesion === "" ? responseID[0].tipoSesion : tipoSesion,
        tipoSesionHH:
          tipoSesionHH === "" ? responseID[0].tipoSesionHH : tipoSesionHH,
        duracionSesionHH:
          duracionSesionHH === ""
            ? responseID[0].duracionSesionHH
            : duracionSesionHH,
        idRamo: idRamo === "" ? responseID[0].idRamo : idRamo,

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
  function actualizarSesion(sesion) {
    const nuevosSesion = listSesion.map((c) =>
      c.idSesion === sesion.idSesion ? sesion : c
    );
    setSesion(nuevosSesion);
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

  useEffect(
    function () {
      if (idSesion !== null) {
        getData();
        obtenerRamo();
        obtenerTipoSesion();
        obtenerTipoSesionHH();
      }
    },
    [idSesion]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_NotaExamen">Número de sesión:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Número de la sesión"
                value={nroSesion || ""}
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
                placeholder="Escriba el nombre de la sesión"
                value={nomSesion || ""}
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
                value={tipoSesion || ""}
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
                    <option
                      value={valor.datoVisible}
                      selected={tipoSesion === valor.datoVisible ? true : false}
                    >
                      {valor.datoVisible}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_tipoDeS">Tipo sesión HH:</label>
              <select
                style={{ textTransform: "uppercase" }}
                value={tipoSesionHH || ""}
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
                    <option
                      value={valor.datoVisible}
                      selected={
                        tipoSesionHH === valor.datoVisible ? true : false
                      }
                    >
                      {valor.datoVisible}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_nombreDelSesion">
                Duración de la sesión:
              </label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba la duración de la sesión"
                value={duracionSesionHH || ""}
                type="number"
                className="form-control"
                name="input_nombreDelSesion"
                id="input_nombreDelSesion"
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
                {listRamo.map((valor) => (
                  <option
                    selected={valor.idRamo === idRamo ? "selected" : ""}
                    value={valor.idRamo}
                  >
                    {valor.nomRamo}
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

export default EditarSesion;
