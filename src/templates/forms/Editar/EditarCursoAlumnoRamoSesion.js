import React, { useState, useEffect } from "react";
import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";
import TopAlertsError from "../../alerts/TopAlerts";

const EditarCursoAlumnoRamoSesion = ({
  isActiveEditCursoAlumnoSesion,
  cambiarEstado,
  idCursoAlumnoSesion,
  cursoAlumnoSesion,
  setCursoAlumnoSesion,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [fechaIni, setfechaIni] = useState("");
  const [fechaFin, setfechaFin] = useState("");
  const [horaFin, sethoraFin] = useState("");
  const [horaIni, sethoraInicio] = useState("");

  const [asistencia, setasistencia] = useState("");
  const [participacion, setparticipacion] = useState("");

  const [idCursoAlumnoRamo, setidCursoAlumnoRamo] = useState("");
  const [idSesion, setidSesion] = useState("");

  const [listSesion, setlistSesion] = useState([""]);
  const [listCursoAlumno, setlistCursoAlumno] = useState([""]);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [responseID, setResponseID] = useState([""]);
  const listCursoAlumnoSesion = cursoAlumnoSesion;

  const show = isActiveEditCursoAlumnoSesion;

  const handleClose = () => {
    cambiarEstado(false);
    setfechaIni(responseID[0].fechaIni);
    setfechaFin(responseID[0].fechaFin);
    sethoraFin(responseID[0].horaFin);
    sethoraInicio(responseID[0].horaIni);

    setasistencia(responseID[0].asistencia);
    setparticipacion(responseID[0].participacion);
    setidSesion(responseID[0].idSesion);
    setidCursoAlumnoRamo(responseID[0].idCursoAlumnoRamo);
  };
  // ----------------------FUNCIONES----------------------------
  function obtenerSesion() {
    const url = "pages/auxiliares/listadoSesionForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistSesion(response)
    );
  }
  function obtenerCursoAlumno() {
    const url = "pages/auxiliares/listadoCursoAlumnoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      console.log(response);
      
      setlistCursoAlumno(response);
    });
  }

  const getData = () => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idCursoAlumnoSesion, nombreTabla: nombreTabla };
    console.log(data);

    SendDataService(url, operationUrl, data).then((response) => {
      setResponseID(response);
      setfechaIni(response[0].fechaIni);
      setfechaFin(response[0].fechaFin);
      sethoraInicio(response[0].horaIni);
      sethoraFin(response[0].horaFin);
      setasistencia(response[0].asistencia);
      setparticipacion(response[0].participacion);
      setidCursoAlumnoRamo(response[0].idCursoAlumnoRamo);
      setidSesion(response[0].idSesion);
    });
  };

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
    } else if (idCursoAlumnoRamo <= 0) {
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
      const url = "pages/editar/editarCursoAlumnoRamoSesion.php";
      const operationUrl = "editarCursoAlumnoRamoSesion";

      var data = {
        usuarioModificacion: userData.usuario,
        idCursoAlumnoRamoSesion: idCursoAlumnoSesion,

        fechaIni: fechaIni === "" ? responseID[0].fechaIni : fechaIni,
        fechaFin: fechaFin === "" ? responseID[0].fechaFin : fechaFin,
        horaFin: horaFin === "" ? responseID[0].horaFin : horaFin,
        horaIni: horaIni === "" ? responseID[0].horaIni : horaIni,

        asistencia: asistencia === "" ? responseID[0].asistencia : asistencia,
        participacion:
          participacion === "" ? responseID[0].participacion : participacion,
        idCursoAlumnoRamo:
          idCursoAlumnoRamo === "" ? responseID[0].idCursoAlumnoRamo : idCursoAlumnoRamo,
        idSesion: idSesion === "" ? responseID[0].idSesion : idSesion,
        isActive: true,
      };
      console.log(data);

      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...cursoAlumnoSesion } =
          response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarCursoAlumnoSesion(cursoAlumnoSesion);
        cambiarEstado(false);
      });
    }
  }
  function actualizarCursoAlumnoSesion(cursoAlumnoSesion) {
    const nuevosCursoAlumnoSesion = listCursoAlumnoSesion.map((c) =>
      c.idCursoAlumnoSesion === cursoAlumnoSesion.idCursoAlumnoSesion
        ? cursoAlumnoSesion
        : c
    );
    setCursoAlumnoSesion(nuevosCursoAlumnoSesion);
  }
  useEffect(
    function () {
      if (idCursoAlumnoSesion !== null) {
        getData();
        obtenerCursoAlumno();
        obtenerSesion();
      }
    },
    [idCursoAlumnoSesion]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Curso Alumno Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
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
            <div>
              <label htmlFor="input_fechaI">Fecha Fin:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio"
                value={fechaFin || ""}
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
                value={horaIni || ""}
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
                value={horaFin || ""}
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
                placeholder="Asistencia"
                value={asistencia || ""}
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
                value={participacion || ""}
                type="number"
                className="form-control"
                name="input_PorcP"
                id="input_PorcP"
                maxLength="11"
                onChange={({ target }) => setparticipacion(target.value)}
              />
            </div>
            <div>
              <label htmlFor="input_Pais">Sesión:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidSesion(target.value)}
              >
                {listSesion.map((valor) => (
                  <option
                    selected={valor.idSesion === idSesion ? "selected" : ""}
                    value={valor.idSesion}
                  >
                    {valor.nomSesion}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_Pais">Curso alumno:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidCursoAlumnoRamo(target.value)}
              >
                {listCursoAlumno.map((valor) => (
                  <option
                    selected={
                      valor.idCursoAlumnoRamo === idCursoAlumnoRamo ? "selected" : ""
                    }
                    value={valor.idCursoAlumnoRamo}
                  >
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

export default EditarCursoAlumnoRamoSesion;
