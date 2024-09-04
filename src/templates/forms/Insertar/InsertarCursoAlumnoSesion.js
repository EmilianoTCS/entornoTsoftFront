import React, { useState, useEffect } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TopAlertsError from "../../alerts/TopAlerts";

const InsertarCursoAlumnoSesion = ({
  isActiveCursoAlumnoSesion,
  cambiarEstado,
  cursoAlumnoSesion,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [fechaIni, setfechaIni] = useState("");
  const [fechaFin, setfechaFin] = useState("");
  const [horaFin, sethoraFin] = useState("");
  const [horaIni, sethoraInicio] = useState("");

  const [asistencia, setasistencia] = useState(0);
  const [participacion, setparticipacion] = useState(0);

  const [idSesion, setidSesion] = useState("");
  const [idCursoAlumno, setidCursoAlumno] = useState("");

  const [listSesion, setlistSesion] = useState([""]);
  const [listCursoAlumno, setlistCursoAlumno] = useState([""]);

  const listCursoAlumnoSesion = cursoAlumnoSesion;

  const show = isActiveCursoAlumnoSesion;
  const now = new Date();
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------
  function obtenerSesion() {
    const url = "pages/auxiliares/listadoSesionForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setlistSesion(response);
      console.log(response);
    });
  }
  function obtenerCursoAlumno() {
    const url = "pages/auxiliares/listadoCursoAlumnoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCursoAlumno(response)
    );
  }

  function validaciones() {
    if (new Date(fechaIni) > new Date(fechaFin)) {
      TopAlertsError(
        "01",
        "La fecha de inicio no puede ser mayor a la fecha de término"
      );
      return true;
    } else if (horaIni > horaFin) {
      TopAlertsError(
        "02",
        "La hora de inicio no puede ser mayor a la hora de término"
      );
      return true;
    } else if (asistencia < 0) {
      TopAlertsError("02", "El % de asistencia no puede ser menor a cero");
      return true;
    } else if (participacion < 0 === "") {
      TopAlertsError("03", "El % de participacion no puede ser mejor a cero");
      return true;
    } else if (idSesion <= 0) {
      TopAlertsError("04", "La sesión no puede estar vacía");
      return true;
    } else if (idCursoAlumno <= 0) {
      TopAlertsError("05", "La relación curso - alumno no puede estar vacía");
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarCursoAlumnoSesion.php";
      const operationUrl = "insertarCursoAlumnoSesion";
      var data = {
        usuarioCreacion: userData.usuario,
        fechaIni: fechaIni,
        fechaFin: fechaFin,
        horaFin: horaFin,
        horaIni: horaIni,
        asistencia: asistencia,
        participacion: participacion,
        idSesion: idSesion,
        idCursoAlumno: idCursoAlumno,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...cursoAlumnoSesion } =
          response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarCursoAlumnoSesion(cursoAlumnoSesion);
        console.log(response);
        cambiarEstado(false);
      });
    }
  }

  function actualizarCursoAlumnoSesion(response) {
    listCursoAlumnoSesion.push(response);
  }
  useEffect(function () {
    obtenerCursoAlumno();
    obtenerSesion();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Curso Alumno Sesion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_fechaI">Fecha inicio:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio"
                type="date"
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
                placeholder="Fecha inicio"
                type="date"
                className="form-control"
                name="input_fechaI"
                id="input_fechaI"
                onChange={({ target }) => setfechaFin(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_horaI">Hora inicio:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio"
                type="time"
                className="form-control"
                name="input_horaI"
                id="input_horaI"
                onChange={({ target }) => sethoraInicio(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_horaF">Hora fin:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio"
                type="time"
                className="form-control"
                name="input_horaF"
                id="input_horaF"
                onChange={({ target }) => sethoraFin(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_PorcA">Asistencia :</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Porcentaje asistencia"
                type="number"
                className="form-control"
                name="input_PorcA"
                id="input_PorcA"
                maxLength="11"
                onChange={({ target }) => setasistencia(target.value)}
              />
            </div>
            <div>
              <label htmlFor="input_PorcP">Participación :</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Porcentaje participación"
                type="number"
                className="form-control"
                name="input_PorcP"
                id="input_PorcP"
                maxLength="11"
                onChange={({ target }) => setparticipacion(target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="input_sesion">Sesión: </label>
              <select
                required
                className="form-control"
                name="input_sesion"
                id="input_sesion"
                placeholder="Seleccione la sesion"
                onChange={({ target }) => setidSesion(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listSesion.map((valor) => (
                  <option value={valor.idSesion}>{valor.nomSesion}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_alumno">Curso Alumno: </label>
              <select
                required
                className="form-control"
                name="input_alumno"
                id="input_alumno"
                placeholder="Seleccione el ervicio"
                onChange={({ target }) => setidCursoAlumno(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listCursoAlumno.map((valor) => (
                  <option value={valor.idCursoAlumno}>
                    {valor.idCursoAlumno}
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
export default InsertarCursoAlumnoSesion;
