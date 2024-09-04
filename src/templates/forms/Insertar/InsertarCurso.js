import React, { useState } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarCurso = ({ isActiveCurso, cambiarEstado, curso }) => {
  // ----------------------CONSTANTES----------------------------
  const [codCurso, setcodCurso] = useState([""]);
  const [nomCurso, setnomCurso] = useState([""]);
  const [tipoHH, settipoHH] = useState([""]);
  const [duracionCursoHH, setduracionCursoHH] = useState([""]);
  const [cantSesionesCurso, setcantSesionesCurso] = useState([""]);

  const listCurso = curso;

  const show = isActiveCurso;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------
  function validaciones() {
    if (codCurso.trim() === "") {
      TopAlertsError("01", "El código del curso no debe estar vacío");
      return true;
    } else if (nomCurso.trim() === "") {
      TopAlertsError("02", "El nombre del curso no debe estar vacío");
      return true;
    } else if (tipoHH <= 0) {
      TopAlertsError("03", "El tipo de HH mayor a cero");
      return true;
    } else if (duracionCursoHH <= 0) {
      TopAlertsError("04", "La duración del curso debe ser mayor a cero");
      return true;
    } else if (cantSesionesCurso <= 0) {
      TopAlertsError(
        "05",
        "La cantidad de sesiones del curso debe ser mayor a cero"
      );
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarCurso.php";
      const operationUrl = "insertarCurso";
      var data = {
        usuarioCreacion: userData.usuario,
        codCurso: codCurso,
        nomCurso: nomCurso,
        tipoHH: tipoHH,
        duracionCursoHH: duracionCursoHH,
        cantSesionesCurso: cantSesionesCurso,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarCurso(curso);
        cambiarEstado(false)
      });
    }
  }

  function actualizarCurso(response) {
    listCurso.push(response);
  }

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Insertar curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelCodigo">Código del curso:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba el código del curso"
                type="text"
                className="form-control"
                name="input_nombreDelCodigo"
                id="input_nombreDelCodigo"
                maxLength="20"
                onChange={({ target }) => setcodCurso(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_nombreDelCurso">Nombre del curso:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre del curso"
                type="text"
                className="form-control"
                name="input_nombreDelCurso"
                id="input_nombreDelCurso"
                maxLength="200"
                onChange={({ target }) => setnomCurso(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_tipoDelRamohh">Tipo ramo HH:</label>
              <select
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba tipo del ramo HH"
                className="form-control"
                name="input_tipoDelRamohh"
                id="input_tipoDelRamohh"
                onChange={({ target }) => settipoHH(target.value)}
                required
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                <option value="ACADEMICAS">ACADEMICAS</option>
                <option value="CRONOLOGICAS">CRONOLOGICAS</option>
                <option value="MIXTO">MIXTO</option>
              </select>
            </div>
            <div>
              <label htmlFor="input_DuracionHH">Duración curso HH:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba duración del curso HH"
                type="number"
                className="form-control"
                name="input_DuracionHH"
                id="input_DuracionHH"
                onChange={({ target }) => setduracionCursoHH(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_cantSesionesCurso">Cant sesiones:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba la cantidad de sesiones"
                type="number"
                className="form-control"
                name="input_cantSesionesCurso"
                id="input_cantSesionesCurso"
                maxLength="11"
                onChange={({ target }) => setcantSesionesCurso(target.value)}
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
export default InsertarCurso;
