import React, { useState, useEffect } from "react";
import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";
import TopAlertsError from "../../alerts/TopAlerts";
const EditarRamo = ({
  isActiveEditRamo,
  cambiarEstado,
  idRamo,
  ramos,
  setRamos,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------duracionRamoHH
  const [codRamo, setcodRamo] = useState("");
  const [nomRamo, setnomRamo] = useState("");
  const [tipoRamo, settipoRamo] = useState("");
  const [tipoRamoHH, settipoRamoHH] = useState("");
  const [cantSesionesRamo, setcantSesionesRamo] = useState("");
  const [duracionRamoHH, setduracionRamoHH] = useState("");

  const [idCurso, setidCurso] = useState("");

  const [listCurso, setlistCurso] = useState([""]);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [responseID, setResponseID] = useState([""]);
  const [listTipoRamo, setlistTipoRamo] = useState([""]);
  const [listTipoRamoHH, setlistTipoRamoHH] = useState([""]);
  const listRamos = ramos;

  const show = isActiveEditRamo;

  const handleClose = () => {
    cambiarEstado(false);
    setcodRamo(responseID[0].codRamo);
    setnomRamo(responseID[0].nomRamo);
    settipoRamo(responseID[0].tipoRamo);
    settipoRamoHH(responseID[0].tipoRamoHH);
    setcantSesionesRamo(responseID[0].cantSesionesRamo);
    setduracionRamoHH(responseID[0].duracionRamoHH);
    setidCurso(responseID[0].idCurso);
  };
  // ----------------------FUNCIONES----------------------------
  function obtenerCurso() {
    const url = "pages/auxiliares/listadoCursoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCurso(response)
    );
  }
  function obtenerTipoRamo() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "AF",
      subTipoConfDato: "TIPO_RAMO",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setlistTipoRamo(response);
    });
  }
  function obtenerTipoRamoHH() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "AF",
      subTipoConfDato: "TIPO_RAMO_HH",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setlistTipoRamoHH(response);
    });
  }
  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idRamo, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setcodRamo(response[0].codRamo);
      setnomRamo(response[0].nomRamo);
      settipoRamo(response[0].tipoRamo);
      settipoRamoHH(response[0].tipoRamoHH);
      setcantSesionesRamo(response[0].cantSesionesRamo);
      setduracionRamoHH(response[0].duracionRamo);
      setidCurso(response[0].idCurso);
    });
  }, [idRamo]);

  function validaciones() {
    if (codRamo.trim() === "") {
      TopAlertsError("01", "El código del ramo no debe estar vacío");
      return true;
    } else if (nomRamo.trim() === "") {
      TopAlertsError("02", "El nombre del ramo no debe estar vacío");
      return true;
    } else if (tipoRamo.trim() === "") {
      TopAlertsError("03", "El tipo de ramo no puede estar vacío");
      return true;
    } else if (tipoRamoHH.trim() === "") {
      TopAlertsError("04", "El tipo de HH en el ramo no puede estar vacío");
      return true;
    } else if (duracionRamoHH <= 0) {
      TopAlertsError("05", "La duración del ramo debe ser mayor a cero");
      return true;
    } else if (cantSesionesRamo <= 0) {
      TopAlertsError(
        "06",
        "La cantidad de sesiones del ramo debe ser mayor a cero"
      );
      return true;
    } else if (idCurso <= 0) {
      TopAlertsError("07", "El curso relacionado no puede estar vacío");
      return true;
    } else {
      return false;
    }
  }

  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/editar/editarRamo.php";
      const operationUrl = "editarRamo";

      var data = {
        usuarioModificacion: userData.usuario,
        idRamo: idRamo,
        codRamo: codRamo === "" ? responseID[0].codRamo : codRamo,
        nomRamo: nomRamo === "" ? responseID[0].nomRamo : nomRamo,
        tipoRamo: tipoRamo === "" ? responseID[0].tipoRamo : tipoRamo,
        tipoRamoHH: tipoRamoHH === "" ? responseID[0].tipoRamoHH : tipoRamoHH,
        duracionRamoHH:
          duracionRamoHH === "" ? responseID[0].duracionRamoHH : duracionRamoHH,
        cantSesionesRamo:
          cantSesionesRamo === ""
            ? responseID[0].cantSesionesRamo
            : cantSesionesRamo,
        idCurso: idCurso,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...ramos } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRamo(ramos);
        cambiarEstado(false);
      });
    }
  }

  function actualizarRamo(ramos) {
    const nuevosRamos = listRamos.map((c) =>
      c.idRamo === ramos.idRamo ? ramos : c
    );
    setRamos(nuevosRamos);
  }
  useEffect(
    function () {
      if (idRamo !== null) {
        getData();
        obtenerCurso();
        obtenerTipoRamo();
        obtenerTipoRamoHH();
      }
    },
    [idRamo]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar ramo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_tipoDelRamo">Código del ramo:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre completo del Ramo"
                value={codRamo || ""}
                type="text"
                className="form-control"
                name="input_tipoDelRamo"
                id="input_tipoDelRamo"
                maxLength="20"
                onChange={({ target }) => setcodRamo(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_nombreDelRamo">Nombre ramo:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre completo del Ramo"
                value={nomRamo || ""}
                type="text"
                className="form-control"
                name="input_nombreDelRamo"
                id="input_nombreDelRamo"
                maxLength="50"
                onChange={({ target }) => setnomRamo(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_tipoDelRamo">Tipo ramo:</label>
              <select
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba el tipo del Ramo"
                className="form-control"
                name="input_tipoDelRamo"
                id="input_tipoDelRamo"
                onChange={({ target }) => settipoRamo(target.value)}
                required
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listTipoRamo &&
                  listTipoRamo.map((valor) => (
                    <option
                      value={valor.datoVisible}
                      selected={tipoRamo === valor.datoVisible}
                    >
                      {valor.datoVisible}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label htmlFor="input_tipoDelRamohh">Tipo ramo HH:</label>
              <select
                style={{ textTransform: "uppercase" }}
                value={tipoRamoHH || ""}
                placeholder="Escriba tipo del ramo HH"
                className="form-control"
                name="input_tipoDelRamohh"
                id="input_tipoDelRamohh"
                onChange={({ target }) => settipoRamoHH(target.value)}
                required
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listTipoRamoHH &&
                  listTipoRamoHH.map((valor) => (
                    <option
                      value={valor.datoVisible}
                      selected={tipoRamoHH === valor.datoVisible}
                    >
                      {valor.datoVisible}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_duracionDelRamo">Duración ramo HH:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre completo del Ramo"
                value={duracionRamoHH || ""}
                type="double"
                className="form-control"
                name="input_duracionDelRamo"
                id="input_duracionDelRamo"
                maxLength="12"
                onChange={({ target }) => setduracionRamoHH(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_cantSesionesDelRamo">
                Cantidad sesiones ramo:
              </label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre completo del Ramo"
                value={cantSesionesRamo || ""}
                type="number"
                className="form-control"
                name="input_cantSesionesDelRamo"
                id="input_cantSesionesDelRamo"
                maxLength="11"
                onChange={({ target }) => setcantSesionesRamo(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_Curso">Nombre del curso:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidCurso(target.value)}
              >
                {listCurso.map((valor) => (
                  <option
                    selected={valor.idCurso === idCurso ? "selected" : ""}
                    value={valor.idCurso}
                  >
                    {valor.nomCurso}
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

export default EditarRamo;
