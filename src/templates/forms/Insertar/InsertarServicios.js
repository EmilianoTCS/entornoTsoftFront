import React, { useState, useEffect } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TopAlertsError from "../../alerts/TopAlerts";

const InsertarServicio = ({ isActiveServicio, cambiarEstado, servicio }) => {
  // ----------------------CONSTANTES----------------------------
  const [nomServicio, setnomServicio] = useState("");
  const [idCliente, setidCliente] = useState("");

  const [listCliente, setlistCliente] = useState([""]);

  const listServicio = servicio;

  const show = isActiveServicio;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerCliente() {
    const url = "pages/auxiliares/listadoClienteForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCliente(response)
    );
  }

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/insertarServicio.php";
    const operationUrl = "insertarServicio";
    var data = {
      usuarioCreacion: userData.usuario,
      nomServicio: nomServicio,
      idCliente: idCliente,
      isActive: true,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
      actualizarServicio(servicio);
      console.log(response);
    });
  }

  function actualizarServicio(response) {
    listServicio.push(response);
  }

  useEffect(function () {
    obtenerCliente();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelservicio">Servicio:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre del servicio"
                type="text"
                className="form-control"
                name="input_nombreDelContacto"
                id="input_nombreDelContacto"
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
                {" "}
                <option hidden value="">
                  Desplegar lista
                </option>
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
export default InsertarServicio;
