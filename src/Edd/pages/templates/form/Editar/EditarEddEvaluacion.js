import React, { useState, useEffect } from "react";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarEDDEvaluacion = ({
  isActiveEditEDDEvaluacion,
  cambiarEstado,
  idEDDEvaluacion,
  EDDEvaluacion,
  setEDDEvaluacion,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomEvaluacion, setnomEvaluacion] = useState("");
  const [fechaIni, setfechaIni] = useState("");
  const [fechaFin, setfechaFin] = useState("");
  const [tipoEvaluacion, settipoEvaluacion] = useState("");
  const [reset, setReset] = useState(false);

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const listEDDEvaluacion = EDDEvaluacion;
  var idEDDEvaluacion = idEDDEvaluacion

  const show = isActiveEditEDDEvaluacion;

  const handleClose = () => {
    cambiarEstado(false);
    setfechaIni(responseID[0].fechaIni);
    setfechaFin(responseID[0].fechaFin);
    settipoEvaluacion(responseID[0].tipoEvaluacion);
    setnomEvaluacion(responseID[0].nomEvaluacion);
    setReset(true)

  };

  // ----------------------FUNCIONES----------------------------
  const getData = () => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEDDEvaluacion, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      setResponseID(response);
      setReset(false)
      settipoEvaluacion(response[0].tipoEvaluacion);
      setfechaIni(response[0].fechaIni);
      setfechaFin(response[0].fechaFin);
      setnomEvaluacion(response[0].nomEvaluacion);


    });
  };

  function SendData(e) {
    e.preventDefault();
    var url = "pages/editar/editarEddEvaluacion.php";
    var operationUrl = "editarEddEvaluacion";
    var data = {
      usuarioModificacion: userData.usuario,
      idEDDEvaluacion: idEDDEvaluacion,
      nomEvaluacion: nomEvaluacion === "" ? responseID[0].nomEvaluacion : nomEvaluacion,
      tipoEvaluacion: tipoEvaluacion === "" ? responseID[0].tipoEvaluacion : tipoEvaluacion,
      fechaIni: fechaIni === "" ? responseID[0].fechaIni : fechaIni,
      fechaFin: fechaFin === "" ? responseID[0].fechaFin : fechaFin,
      isActive: true,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      TopAlerts('successEdited');
      actualizarEDDEvaluacion(EDDEvaluacion); console.log(response);
    });

    function actualizarEDDEvaluacion(EDDEvaluacion) {
      const nuevosEDDEvaluacion = listEDDEvaluacion.map((c) =>
        c.idEDDEvaluacion === EDDEvaluacion.idEDDEvaluacion ? EDDEvaluacion : c
      );
      setEDDEvaluacion(nuevosEDDEvaluacion);
    }
  }

  useEffect(
    function () {
      if (idEDDEvaluacion !== null) {
        getData();
      }
    },
    [idEDDEvaluacion, reset]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar evaluación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelEDDEvaluacion">Evaluación:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre de la evaluación"
                type="text"
                className="form-control"
                name="input_nombreDelEDDEvaluacion"
                id="input_nombreDelEDDEvaluacion"
                value={nomEvaluacion || ""}
                maxLength="50"
                onChange={({ target }) => setnomEvaluacion(target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="input_nombreDelTipoEvaluacion">Tipo evaluación:</label>
              <select
                required
                className="form-control"
                name="input_nombreDelTipoEvaluacion"
                id="input_nombreDelTipoEvaluacion"


                onChange={({ target }) => settipoEvaluacion(target.value)}
              >
                <option value="Referente" selected={tipoEvaluacion.toUpperCase() === 'REFERENTE' ? true : ""}>
                  REFERENTE
                </option>
                <option value="Colaborador" selected={tipoEvaluacion.toUpperCase() === 'COLABORADOR' ? true : ""}>
                  COLABORADOR
                </option>

              </select>
            </div>

            <div>
              <label htmlFor="input_fechaI">Fecha inicio vigencia:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio vigencia"
                type="datetime-local"
                className="form-control"
                name="input_fechaI"
                id="input_fechaI"
                value={fechaIni || ""}
                onChange={({ target }) => setfechaIni(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_fechaF">Fecha fin vigencia:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha fin vigencia"
                type="datetime-local"
                className="form-control"
                name="input_fechaF"
                id="input_fechaF"
                value={fechaFin || ""}
                onChange={({ target }) => setfechaFin(target.value)}
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

export default EditarEDDEvaluacion;
