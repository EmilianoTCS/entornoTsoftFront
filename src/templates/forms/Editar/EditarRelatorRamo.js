import React, { useState, useEffect } from "react";
import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import TopAlertsError from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarRelatorRamo = ({
  isActiveEditRelatorRamo,
  cambiarEstado,
  idRelatorRamo,
  relatorRamo,
  setRelatorRamo,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [fechaIni, setfechaIni] = useState("");
  const [fechaFin, setfechaFin] = useState("");

  const [idEmpleado, setidEmpleado] = useState("");
  const [idRamo, setidRamo] = useState("");

  const [listEmpleado, setlistEmpleado] = useState([""]);
  const [listRamo, setlistRamo] = useState([""]);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [responseID, setResponseID] = useState([""]);
  const listRelatorRamo = relatorRamo;

  const show = isActiveEditRelatorRamo;

  const handleClose = () => {
    cambiarEstado(false);

    setfechaIni(responseID[0].fechaIni);
    setfechaFin(responseID[0].fechaFin);

    setidEmpleado(responseID[0].idEmpleado);
    setidRamo(responseID[0].idRamo);
  };
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

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idRelatorRamo, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setfechaIni(response[0].fechaIni);
      setfechaFin(response[0].fechaFin);

      setidEmpleado(response[0].idEmpleado);
      setidRamo(response[0].idRamo);
    });
  }, [idRelatorRamo]);

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
      const url = "pages/editar/editarRelatorRamo.php";
      const operationUrl = "editarRelatorRamo";
      var data = {
        usuarioModificacion: userData.usuario,
        idRelatorRamo: idRelatorRamo,
        fechaIni: fechaIni === "" ? responseID[0].fechaIni : fechaIni,
        fechaFin: fechaFin === "" ? responseID[0].fechaFin : fechaFin,

        idEmpleado: idEmpleado === "" ? responseID[0].idEmpleado : idEmpleado,
        idRamo: idRamo === "" ? responseID[0].idRamo : idRamo,

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
  function actualizarRelatorRamo(relatorRamo) {
    const nuevosRelatorRamo = listRelatorRamo.map((c) =>
      c.idRelatorRamo === relatorRamo.idRelatorRamo ? relatorRamo : c
    );
    setRelatorRamo(nuevosRelatorRamo);
  }
  useEffect(
    function () {
      if (idRelatorRamo !== null) {
        getData();
        obtenerEmpleado();
        obtenerRamo();
      }
    },
    [idRelatorRamo]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar RelatorRamo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_fechaI">Fecha inicio:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio"
                value={fechaIni || ""}
                type="datetime"
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
                type="datetime"
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
                {listEmpleado.map((valor) => (
                  <option
                    selected={valor.idEmpleado === idEmpleado ? "selected" : ""}
                    value={valor.idEmpleado}
                  >
                    {valor.nomEmpleado}
                  </option>
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

export default EditarRelatorRamo;
