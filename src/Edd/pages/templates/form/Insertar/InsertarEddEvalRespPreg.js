import React, { useState,useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarEDDEvalRespPreg = ({ isActiveEDDEvalRespPreg, cambiarEstado, EDDEvalRespPreg }) => {
  // ----------------------CONSTANTES----------------------------
  const [nomRespPreg, setnomRespPreg] = useState("");
  const [ordenRespPreg, setordenRespPreg] = useState("");

  const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState("");

  const [listEDDEvalPregunta, setlistEDDEvalPregunta] = useState([""]);

  const listEDDEvalRespPreg = EDDEvalRespPreg;

  const show = isActiveEDDEvalRespPreg;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerEvalPreg() {
    const url = "pages/auxiliares/listadoEddEvalPregunta.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
    setlistEDDEvalPregunta(response)
    );
  }

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/insertarEddEvalRespPreg.php";
    const operationUrl = "insertarEddEvalRespPreg";
    var data = {
      usuarioCreacion: userData.usuario,
      nomRespPreg: nomRespPreg,
      ordenRespPreg: ordenRespPreg,
      idEDDEvalPregunta: idEDDEvalPregunta,
      isActive:true
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
    //   TopAlerts('successCreated');
      actualizarEDDEvalRespPreg(EDDEvalRespPreg);console.log(response);
    });
  }

  function actualizarEDDEvalRespPreg(response) {
    listEDDEvalRespPreg.push(response);
  }

  useEffect(function () {
    obtenerEvalPreg();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear RespPreg</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
          <div>
              <label htmlFor="input_nombreDelEDDEvalRespPreg">RespPreg:</label>
              <input
               style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre RespPreg"
                type="text"
                className="form-control"
                name="input_nombreDelEDDEvalRespPreg"
                id="input_nombreDelEDDEvalRespPreg"
                value={nomRespPreg || ""}
                maxLength="50"
                onChange={({ target }) => setnomRespPreg(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_Orden">Orden:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Orden"
                type="number"
                className="form-control"
                name="input_Orden"
                id="input_Orden"
                value={ordenRespPreg || ""}
                maxLength="11"
                onChange={({ target }) => setordenRespPreg(target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="input_EvalPregunta">EvalPregunta: </label>
              <select
                required
                className="form-control"
                name="input_EvalPregunta"
                id="input_EvalPregunta"
                placeholder="Seleccione la EvalPreg"
                onChange={({ target }) => setidEDDEvalPregunta(target.value)}
              >
                 <option hidden value="">
                  Desplegar lista
                </option>

                {listEDDEvalPregunta.map((valor) => (
                  <option value={valor.idEDDEvalPregunta}>{valor.nomPregunta}</option>
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
export default InsertarEDDEvalRespPreg;
