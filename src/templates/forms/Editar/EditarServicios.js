import React, { useState, useEffect } from "react";
import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import TopAlertsError from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarServicio = ({
  isActiveEditServicio,
  cambiarEstado,
  idServicio,
  servicio,
  setServicio,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomServicio, setnomServicio] = useState("");
  const [idCliente, setidCliente] = useState("");

  const [listCliente, setlistCliente] = useState([""]);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [responseID, setResponseID] = useState([""]);
  const listServicio = servicio;

  const show = isActiveEditServicio;

  const handleClose = () => {
    cambiarEstado(false);
    setnomServicio(responseID[0].nomServicio);
    setidCliente(responseID[0].idCliente);
  };
  // ----------------------FUNCIONES----------------------------
  function obtenerCliente() {
    const url = "pages/auxiliares/listadoClienteForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCliente(response)
    );
  }

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idServicio, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setnomServicio(response[0].nomServicio);
      setidCliente(response[0].idCliente);
    });
  }, [idServicio]);

  function validaciones() {
    if (nomServicio.trim() === "") {
      TopAlertsError("01", "El nombre del servicio no puede estar vacío");
      return true;
    } else if (idCliente < 0) {
      TopAlertsError("02", "El cliente no debe estar vacío");
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/editar/editarServicio.php";
      const operationUrl = "editarServicio";
      var data = {
        usuarioModificacion: userData.usuario,
        idServicio: idServicio,
        nomServicio:
          nomServicio === "" ? responseID[0].nomServicio : nomServicio,
        idCliente: idCliente === "" ? responseID[0].idCliente : idCliente,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...servicio } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarServicio(servicio);
      });
    }
  }
  function actualizarServicio(servicio) {
    const nuevosServicio = listServicio.map((c) =>
      c.idServicio === servicio.idServicio ? servicio : c
    );
    setServicio(nuevosServicio);
  }
  useEffect(
    function () {
      if (idServicio !== null) {
        getData();
        obtenerCliente();
      }
    },
    [idServicio]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelservicio">Servicio:</label>
              <input
                style={{ textTransform: "uppercase" }}
                value={nomServicio || ""}
                placeholder="Escriba nombre del servicio"
                type="text"
                className="form-control"
                name="input_nombreDelServicio"
                id="input_nombreDelServicio"
                maxLength="50"
                onChange={({ target }) => setnomServicio(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_Pais">Cliente:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidCliente(target.value)}
              >
                {listCliente.map((valor) => (
                  <option
                    selected={valor.idCliente === idCliente ? "selected" : ""}
                    value={valor.idCliente}
                  >
                    {valor.nomCliente}
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

export default EditarServicio;
