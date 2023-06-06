import React, { useState,useEffect } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarContacto = ({ isActiveContacto, cambiarEstado, contacto }) => {
  // ----------------------CONSTANTES----------------------------
  const [nomContacto, setnomContacto] = useState("");
  const [correoContacto, setcorreoContacto] = useState("");
  const [telefonoContacto, settelefonoContacto] = useState("");
  const [fechaIni, setfechaIni] = useState("");


  const [idServicio, setidServicio] = useState("");
  
  const [listServicio, setlistServicio] = useState([""]);

  const listContacto = contacto;

  const show = isActiveContacto;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerServicio() {
    const url = "pages/auxiliares/listadoServicioForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistServicio(response));
  }


  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/insertarContacto.php";
    const operationUrl = "insertarContacto";
    var data = {
      usuarioCreacion: userData.usuario,
      nomContacto: nomContacto,
      correoContacto: correoContacto,
      telefonoContacto: telefonoContacto,
      fechaIni: fechaIni,
      idServicio: idServicio,
      isActive:true,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      const { successCreated, ...contacto } = response[0];
      TopAlerts(successCreated);
      actualizarContacto(contacto);
    });
  }

  function actualizarContacto(response) {
    listContacto.push(response);
  }

  useEffect(function () {
    obtenerServicio();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
          <div>
              <label htmlFor="input_nombreDelContacto">Nombre:</label>
              <input
               style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre completo del contacto"
                value={nomContacto || ""}
                type="text"
                className="form-control"
                name="input_nombreDelContacto"
                id="input_nombreDelContacto"
                maxLength="50"
                onChange={({ target }) => setnomContacto(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_Correo">Correo:</label>
              <input
               style={{ textTransform: "uppercase" }}
                placeholder="Escriba el correo del contacto"
                value={correoContacto || ""}
                type="email"
                className="form-control"
                name="input_correo"
                id="input_correo"
                maxLength="100"
                onChange={({ target }) => setcorreoContacto(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_telefono">Teléfono (opcional): </label>

              <input
                placeholder="Escriba el teléfono"
                value={telefonoContacto || ""}
                type="tel"
                className="form-control"
                name="input_telefono"
                id="input_telefono"
                maxLength="15"
                onChange={({ target }) => settelefonoContacto(target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="input_Servicio">Servicio: </label>
              <select
                required
                value={idServicio || ""}
                className="form-control"
                name="input_Servicio"
                id="input_Servicio"
                placeholder="Seleccione el ervicio"
                onChange={({ target }) => setidServicio(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>                {listServicio.map((valor) => (
                  <option value={valor.idServicio}>{valor.nomServicio}</option>
                ))}
              </select>
            </div>
            
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
export default InsertarContacto;


