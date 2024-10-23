import React, { useState, useEffect } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import TopAlertsError from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarCursoAlumnoRamo = ({ isActiveCursoAlumno, cambiarEstado }) => {
  // ----------------------CONSTANTES----------------------------
  const [idCursoAlumno, setidCursoAlumno] = useState("");
  const [idRamo, setIdRamo] = useState("");
  const [fechaIni, setfechaIni] = useState("");
  const [fechaFin, setfechaFin] = useState("");
  const [horaIni, sethoraIni] = useState("");
  const [horaFin, sethoraFin] = useState("");
  const [porcAsistencia, setporcAsistencia] = useState(0);
  const [porcParticipacion, setporcParticipacion] = useState(0);
  const [ramoAprobado, setRamoAprobado] = useState("N");
  const [porcAprobacion, setporcAprobacion] = useState(0);
  const [estadoRamo, setEstadoRamo] = useState(1);

  const show = isActiveCursoAlumno;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [listCursosAlumnos, setlistCursosAlumnos] = useState([]);
  const [listRamos, setlistRamos] = useState([]);

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function validaciones() {
    if (idCursoAlumno < 0) {
      TopAlertsError("01", "El nombre del curso-alumno no puede estar vacío");
      return true;
    } else if (fechaIni > fechaFin) {
      TopAlertsError(
        "03",
        "La fecha de inicio no puede ser mayor a la de término"
      );
      return true;
    } else if (horaIni > horaFin) {
      TopAlertsError(
        "04",
        "La hora de inicio no puede ser mayor a la de término"
      );
      return true;
    } else if (porcAsistencia < 0 || porcAsistencia > 100) {
      TopAlertsError(
        "05",
        "El % de asistencia debe ser mayor o igual a cero y menor o igual a 100"
      );
      return true;
    } else if (porcParticipacion < 0 || porcParticipacion > 100) {
      TopAlertsError(
        "06",
        "El % de participación debe ser mayor o igual a cero y menor o igual a 100"
      );
      return true;
    } else if (porcAprobacion < 0 || porcAprobacion > 100) {
      TopAlertsError(
        "07",
        "El % de aprobación debe ser mayor o igual a cero y menor o igual a 100"
      );
      return true;
    } else if (estadoRamo < 0) {
      TopAlertsError("08", "El estado del ramo no puede estar vacío");
      return true;
    } else if (ramoAprobado.trim() === "") {
      TopAlertsError("09", "Indique si el ramo está aprobado o no");
      return true;
    } else {
      return false;
    }
  }

  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarCursoAlumnoRamo.php";
      const operationUrl = "insertarCursoAlumnoRamo";
      var data = {
        usuarioCreacion: userData.usuario,
        idCursoAlumno: idCursoAlumno,
        idRamo: idRamo,
        fechaIni: fechaIni,
        fechaFin: fechaFin,
        horaIni: horaIni,
        horaFin: horaFin,
        porcAsistencia: porcAsistencia,
        ramoAprobado: ramoAprobado,
        porcParticipacion: porcParticipacion,
        porcAprobacion: porcAprobacion,
        estadoRamo: estadoRamo,
        isActive: true,
      };
      console.log(data);

      SendDataService(url, operationUrl, data).then((response) => {
        console.log(response);

        const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        // cambiarEstado(false);
      });
    }
  }

  function obtenerCursoAlumno() {
    const url = "pages/auxiliares/listadoCursoAlumnoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCursosAlumnos(response)
    );
  }
  function obtenerRamo() {
    const url = "pages/auxiliares/listadoRamoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setlistRamos(response);
    });
  }
  useEffect(
    function () {
      obtenerCursoAlumno();
      obtenerRamo();
    },
    [isActiveCursoAlumno]
  );
  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Insertar curso alumno ramo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_NomA">Nombre curso alumno:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidCursoAlumno(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listCursosAlumnos.map((valor) => (
                  <option value={valor.idCursoAlumno}>
                    {valor.nomCursoAlumno}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_NomA">Nombre ramo:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setIdRamo(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listRamos.map((valor) => (
                  <option value={valor.idRamo}>{valor.nomRamo}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_fechaI">Fecha inicio:</label>
              <input
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
              <label htmlFor="input_HoraI">Hora inicio:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Hora inicio"
                type="time"
                className="form-control"
                name="input_HoraI"
                id="input_HoraI"
                onChange={({ target }) => sethoraIni(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_HoraF">Hora fin:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Hora fin"
                type="time"
                className="form-control"
                name="input_HoraF"
                id="input_HoraF"
                onChange={({ target }) => sethoraFin(target.value)}
                required
              />
            </div>
            {/* <div>
              <label htmlFor="input_PorcA">Porc Asistencia (Máximo 100):</label>
              <input
                placeholder="Porcentaje Asistencia"
                type="number"
                className="form-control"
                name="input_PorcA"
                id="input_PorcA"
                maxLength="3"
                onChange={({ target }) => setporcAsistencia(target.value)}
              />
            </div> */}
            {/* <div>
              <label htmlFor="input_PorcP">
                Porc Participación (Máximo 100):
              </label>
              <input
                placeholder="Porcentaje participación"
                type="number"
                className="form-control"
                name="input_PorcP"
                id="input_PorcP"
                maxLength="3"
                onChange={({ target }) => setporcParticipacion(target.value)}
              />
            </div> */}
            {/* <div>
              <label htmlFor="input_PorcAP">
                Porc Aprobación (Máximo 100):
              </label>
              <input
                placeholder="Porcentaje aprobación"
                type="number"
                className="form-control"
                name="input_PorcAP"
                id="input_PorcAP"
                maxLength="3"
                onChange={({ target }) => setporcAprobacion(target.value)}
              />
            </div> */}
            {/* <div>
              <label htmlFor="input_EstC">Estado ramo:</label>
              <select
                placeholder="Estado ramo "
                type="text"
                className="form-control"
                name="input_EstC"
                id="input_EstC"
                maxLength="15"
                onChange={({ target }) => setEstadoRamo(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                <option value="1">Activado</option>
                <option value="0">Desactivado</option>
              </select>
            </div> */}
            {/* <div>
              <label htmlFor="input_ClaseA">Ramo aprobado:</label>
              <select
                style={{ textTransform: "uppercase" }}
                placeholder="Ramo aprobado"
                type="text"
                className="form-control"
                name="input_ClaseA"
                id="input_ClaseA"
                maxLength="1"
                onChange={({ target }) => setRamoAprobado(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                <option value="S">SÍ (Aprobado)</option>
                <option value="N">NO (Reprobado)</option>
              </select>
            </div> */}

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
export default InsertarCursoAlumnoRamo;
