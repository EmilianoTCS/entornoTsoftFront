import React, { useState, useEffect } from "react";

import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import TopAlertsError from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const EditarCursoAlumnoRamo = ({
  isActiveCursoAlumno,
  cambiarEstado,
  cursoAlumnoRamo,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [datosCursoAlumnoRamo, setCursoAlumnoRamo] = useState([]);

  const show = isActiveCursoAlumno;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [listCursosAlumnos, setlistCursosAlumnos] = useState([]);
  const [listRamos, setlistRamos] = useState([]);

  const handleClose = () => cambiarEstado(false);

  function transformarFecha(fecha) {
    if (fecha) {
      const [dia, mes, year] = fecha.split("/");

      // Retornar la fecha en el formato yyyy-mm-dd
      return `${year}-${mes}-${dia}`;
    }
  }

  // ----------------------FUNCIONES----------------------------

  function validaciones() {
    if (datosCursoAlumnoRamo.idCursoAlumno < 0) {
      TopAlertsError("01", "El nombre del curso-alumno no puede estar vacío");
      return true;
    } else if (datosCursoAlumnoRamo.fechaIni > datosCursoAlumnoRamo.fechaFin) {
      TopAlertsError(
        "03",
        "La fecha de inicio no puede ser mayor a la de término"
      );
      return true;
    } else if (datosCursoAlumnoRamo.horaIni > datosCursoAlumnoRamo.horaFin) {
      TopAlertsError(
        "04",
        "La hora de inicio no puede ser mayor a la de término"
      );
      return true;
    } else if (
      datosCursoAlumnoRamo.porcAsistencia < 0 ||
      datosCursoAlumnoRamo.porcAsistencia > 100
    ) {
      TopAlertsError(
        "05",
        "El % de asistencia debe ser mayor o igual a cero y menor o igual a 100"
      );
      return true;
    } else if (
      datosCursoAlumnoRamo.porcParticipacion < 0 ||
      datosCursoAlumnoRamo.porcParticipacion > 100
    ) {
      TopAlertsError(
        "06",
        "El % de participación debe ser mayor o igual a cero y menor o igual a 100"
      );
      return true;
    } else if (
      datosCursoAlumnoRamo.porcAprobacion < 0 ||
      datosCursoAlumnoRamo.porcAprobacion > 100
    ) {
      TopAlertsError(
        "07",
        "El % de aprobación debe ser mayor o igual a cero y menor o igual a 100"
      );
      return true;
    } else if (datosCursoAlumnoRamo.estadoRamo < 0) {
      TopAlertsError("08", "El estado del ramo no puede estar vacío");
      return true;
    } else if (datosCursoAlumnoRamo.ramoAprobado.trim() === "") {
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
      const url = "pages/editar/editarCursoAlumnoRamo.php";
      const operationUrl = "editarCursoAlumnoRamo";
      var data = {
        usuarioCreacion: userData.usuario,
        idCursoAlumnoRamo: datosCursoAlumnoRamo.idCursoAlumnoRamo,
        idCursoAlumno: datosCursoAlumnoRamo.idCursoAlumno,
        idRamo: datosCursoAlumnoRamo.idRamo,
        fechaIni: transformarFecha(datosCursoAlumnoRamo.fechaIni),
        fechaFin: transformarFecha(datosCursoAlumnoRamo.fechaFin),
        horaIni: datosCursoAlumnoRamo.horaIni,
        horaFin: datosCursoAlumnoRamo.horaFin,
        porcAsistencia: datosCursoAlumnoRamo.porcAsistencia,
        ramoAprobado: datosCursoAlumnoRamo.ramoAprobado,
        porcParticipacion: datosCursoAlumnoRamo.porcParticipacion,
        porcAprobacion: datosCursoAlumnoRamo.porcAprobacion,
        estadoRamo: datosCursoAlumnoRamo.estadoRamo,
        isActive: true,
      };
      
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        cambiarEstado(false);
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
      if (cursoAlumnoRamo) {
        console.log(cursoAlumnoRamo);

        setCursoAlumnoRamo(cursoAlumnoRamo);
      }
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
          <Modal.Title>Editar curso alumno ramo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_NomA">Nombre curso alumno:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    idCursoAlumno: target.value,
                  }))
                }
                value={datosCursoAlumnoRamo.idCursoAlumno || ""}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listCursosAlumnos.map((valor) => (
                  <option
                    value={valor.idCursoAlumno}
                    selected={
                      datosCursoAlumnoRamo.idCursoAlumno === valor.idCursoAlumno
                        ? true
                        : false
                    }
                  >
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
                value={datosCursoAlumnoRamo.idRamo || ""}
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    idRamo: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listRamos.map((valor) => (
                  <option
                    value={valor.idRamo}
                    selected={
                      datosCursoAlumnoRamo.idRamo === valor.idRamo
                        ? true
                        : false
                    }
                  >
                    {valor.nomRamo}
                  </option>
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
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    fechaIni: target.value,
                  }))
                }
                required
                value={
                  transformarFecha(datosCursoAlumnoRamo.fechaIni) ||
                  ""
                }
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
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    fechaFin: target.value,
                  }))
                }
                required
                value={transformarFecha(datosCursoAlumnoRamo.fechaFin) || ""}
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
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    horaIni: target.value,
                  }))
                }
                required
                value={datosCursoAlumnoRamo.horaIni || ""}
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
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    horaFin: target.value,
                  }))
                }
                required
                value={datosCursoAlumnoRamo.horaFin || ""}
              />
            </div>
            <div>
              <label htmlFor="input_PorcA">Porc Asistencia (Máximo 100):</label>
              <input
                placeholder="Porcentaje Asistencia"
                type="number"
                className="form-control"
                name="input_PorcA"
                id="input_PorcA"
                maxLength="3"
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    porcAsistencia: target.value,
                  }))
                }
                value={datosCursoAlumnoRamo.porcAsistencia || ""}
              />
            </div>
            <div>
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
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    porcParticipacion: target.value,
                  }))
                }
                value={datosCursoAlumnoRamo.porcParticipacion || ""}
              />
            </div>
            <div>
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
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    porcAprobacion: target.value,
                  }))
                }
                value={datosCursoAlumnoRamo.porcAprobacion}
              />
            </div>
            <div>
              <label htmlFor="input_EstC">Estado ramo:</label>
              <select
                placeholder="Estado ramo "
                type="text"
                className="form-control"
                name="input_EstC"
                id="input_EstC"
                maxLength="15"
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    estadoRamo: target.value,
                  }))
                }
                value={datosCursoAlumnoRamo.estadoRamo || ""}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                <option value="1">Activado</option>
                <option value="0">Desactivado</option>
              </select>
            </div>
            <div>
              <label htmlFor="input_ClaseA">Ramo aprobado:</label>
              <select
                style={{ textTransform: "uppercase" }}
                placeholder="Ramo aprobado"
                type="text"
                className="form-control"
                name="input_ClaseA"
                id="input_ClaseA"
                maxLength="1"
                onChange={({ target }) =>
                  setCursoAlumnoRamo((prevDatos) => ({
                    ...prevDatos,
                    ramoAprobado: target.value,
                  }))
                }
                value={datosCursoAlumnoRamo.ramoAprobado || ""}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                <option value="S">SÍ (Aprobado)</option>
                <option value="N">NO (Reprobado)</option>
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
export default EditarCursoAlumnoRamo;
