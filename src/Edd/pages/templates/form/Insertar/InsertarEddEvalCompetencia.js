import React, { useState, useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarEddEvalCompetencia = ({
  isActiveEddEvalCompetencia,
  cambiarEstado,
  EddEvalCompetencia,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomCompetencia, setnomCompetencia] = useState("");

  const listEddEvalCompetencia = EddEvalCompetencia;

  const show = isActiveEddEvalCompetencia;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/insertarEddEvalCompetencia.php";
    const operationUrl = "insertarEddEvalCompetencia";
    var data = {
      usuarioCreacion: userData.usuario,
      nomCompetencia: nomCompetencia,
      isActive: true,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
      TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
      actualizarEddEvalCompetencia(datos);
    });
  }

  function actualizarEddEvalCompetencia(response) {
    listEddEvalCompetencia.push(response);
  }

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear competencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelEddEvalCompetencia">
                Competencia:
              </label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre"
                type="text"
                className="form-control"
                name="input_nombreDelEddEvalCompetencia"
                id="input_nombreDelEddEvalCompetencia"
                maxLength="50"
                onChange={({ target }) => setnomCompetencia(target.value)}
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
export default InsertarEddEvalCompetencia;
