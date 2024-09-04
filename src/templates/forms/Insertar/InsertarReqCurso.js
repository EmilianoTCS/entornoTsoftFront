import React, { useState, useEffect } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarReqCurso = ({ isActiveReqCurso, cambiarEstado, reqCurso }) => {
  // ----------------------CONSTANTES----------------------------
  const [idCursoRequisito, setidCursoRequisito] = useState("");
  const [idCurso, setidCurso] = useState("");

  const [listCurso, setlistCurso] = useState([""]);

  const listReqCurso = reqCurso;

  const show = isActiveReqCurso;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerCurso() {
    const url = "pages/auxiliares/listadoCursoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCurso(response)
    );
  }

  function validaciones() {
    if (idCurso < 0) {
      TopAlertsError("01", "El nombre del curso no puede estar vacío");
      return true;
    } else if (idCursoRequisito < 0) {
      TopAlertsError("02", "El nombre del curso requisito no debe estar vacío");
      return true;
    } else if (idCurso === idCursoRequisito) {
      TopAlertsError("03", "Un curso no puede ser su propio requisito");
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarReqCurso.php";
      const operationUrl = "insertarReqCurso";
      var data = {
        usuarioCreacion: userData.usuario,
        idCurso: idCurso,
        idCursoRequisito: idCursoRequisito,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...reqCurso } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarReqCurso(reqCurso);
        cambiarEstado(false);
      });
    }
  }

  function actualizarReqCurso(response) {
    listReqCurso.push(response);
  }

  useEffect(function () {
    obtenerCurso();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear ReqCurso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_Pais">Curso:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidCurso(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listCurso.map((valor) => (
                  <option value={valor.idCurso}>{valor.nomCurso}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_Pais">Requerimiento curso:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidCursoRequisito(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listCurso.map((valor) => (
                  <option value={valor.idCurso}>{valor.nomCurso}</option>
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
export default InsertarReqCurso;
