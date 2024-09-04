import React, { useState, useEffect } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TopAlertsError from "../../alerts/TopAlerts";

const InsertarNotaExamen = ({
  isActiveNotaExamen,
  cambiarEstado,
  notaDeExamen,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [notaExamen, setnotaExamen] = useState("");
  const [apruebaExamen, setapruebaExamen] = useState("");

  const [idCursoAlumno, setidCursoAlumno] = useState("");
  const [idRamoExamen, setidRamoExamen] = useState("");

  const [listRamoExamen, setlistRamoExamen] = useState([""]);
  const [listCursoAlumno, setlistCursoAlumno] = useState([""]);

  const listNotaExamen = notaDeExamen;

  const show = isActiveNotaExamen;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerRamoExamen() {
    const url = "pages/auxiliares/listadoRamoExamenForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistRamoExamen(response)
    );
  }

  function obtenerCursoAlumno() {
    const url = "pages/auxiliares/listadoCursoAlumnoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCursoAlumno(response)
    );
  }

  function validaciones() {
    if (notaExamen < 0 || notaExamen > 10) {
      TopAlertsError(
        "01",
        "La nota del examen debe ser mayor a cero y menor a diez"
      );
      return true;
    } else if (apruebaExamen.trim() === "") {
      TopAlertsError("02", "Indique si el colaborador está aprobado o no");
      return true;
    } else if (idRamoExamen < 0) {
      TopAlertsError("03", "El nombre del examen no puede estar vacío");
      return true;
    } else if (idCursoAlumno < 0) {
      TopAlertsError("04", "La relación curso alumno no debe estar vacía");
      return true;
    } else {
      return false;
    }
  }

  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarNotaExamen.php";
      const operationUrl = "insertarNotaExamen";
      var data = {
        usuarioCreacion: userData.usuario,
        notaExamen: notaExamen,
        apruebaExamen: apruebaExamen,
        idCursoAlumno: idCursoAlumno,
        idRamoExamen: idRamoExamen,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...notaExamen } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarNotaExamen(notaExamen);
        cambiarEstado(false);
      });
    }
  }

  function actualizarNotaExamen(response) {
    listNotaExamen.push(response);
  }

  useEffect(function () {
    obtenerRamoExamen();
    obtenerCursoAlumno();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nota Examen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_NotaExamen">Nota examen: (De 0 a 10)</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Nota examen"
                type="int"
                className="form-control"
                name="input_NotaExamen"
                id="input_NotaExamen"
                maxLength="11"
                onChange={({ target }) => setnotaExamen(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_ApruebaExamen">Aprueba examen:</label>
              <select
                style={{ textTransform: "uppercase" }}
                placeholder="Aprueba examen"
                type="text"
                className="form-control"
                name="input_ApruebaExamen"
                id="input_ApruebaExamen"
                maxLength="2"
                onChange={({ target }) => setapruebaExamen(target.value)}
                required
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                <option value="S">Si (Aprobado)</option>
                <option value="N">No (Reprobado)</option>
              </select>
            </div>

            <div>
              <label htmlFor="input_Pais">Nombre examen:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidRamoExamen(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listRamoExamen.map((valor) => (
                  <option value={valor.idRamoExamen}>{valor.nomExamen}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="input_Pais">Curso Alumno:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidCursoAlumno(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listCursoAlumno.map((valor) => (
                  <option value={valor.idCursoAlumno}>
                    {valor.nomCursoAlumno}
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
export default InsertarNotaExamen;
