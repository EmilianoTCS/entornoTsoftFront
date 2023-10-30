import React, { useState, useEffect } from "react";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarEDDProyecto = ({
  isActiveEditEDDProyecto,
  cambiarEstado,
  idEDDProyecto,
  EDDProyecto,
  setEDDProyecto,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomProyecto, setnomProyecto] = useState("");
  const [fechaIni, setfechaIni] = useState("");
  const [fechaFin, setfechaFin] = useState("");

  const [idServicio, setidServicio] = useState("");

  const [listServicio, setlistServicio] = useState([""]);
  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const listEDDProyecto = EDDProyecto;

  const show = isActiveEditEDDProyecto;

  const handleClose = () => {
    cambiarEstado(false);
    setnomProyecto(responseID[0].nomProyecto);
    setfechaIni(responseID[0].fechaIni);
    setfechaFin(responseID[0].fechaFin);
    setidServicio(responseID[0].idServicio);
  };

  // ----------------------FUNCIONES----------------------------
  function obtenerServicio() {
   
    const url = "pages/auxiliares/listadoServicioForms.php";
    const operationUrl = "listados";
    var data = {
        idCliente: '',
    };
    SendDataService(url, operationUrl, data).then((data) => {
        setlistServicio(data);
    });

}

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEDDProyecto, nombreTabla: nombreTabla};
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setnomProyecto(response[0].nomProyecto);
      setfechaIni(response[0].fechaIni);
      setfechaFin(response[0].fechaFin);
      setidServicio(response[0].idServicio);

    });
  }, [idEDDProyecto]);

  function SendData(e) {
    e.preventDefault();
    var url = "pages/editar/editarEddProyecto.php";
    var operationUrl = "editarEddProyecto";
    var data = {
      usuarioModificacion: userData.usuario,
      idEDDProyecto: idEDDProyecto,
      nomProyecto: nomProyecto === "" ? responseID[0].nomProyecto : nomProyecto,
      fechaIni: fechaIni === "" ? responseID[0].fechaIni : fechaIni,
      fechaFin: fechaFin === "" ? responseID[0].fechaFin : fechaFin,
      idServicio: idServicio === "" ? responseID[0].idServicio : idServicio,
      isActive:true,
    };
console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      TopAlerts('successEdited');
      actualizarEDDProyecto(EDDProyecto);
    });

    function actualizarEDDProyecto(EDDProyecto) {
      const nuevosEDDProyecto = listEDDProyecto.map((c) =>
        c.idEDDProyecto === EDDProyecto.idEDDProyecto ? EDDProyecto : c
      );
      setEDDProyecto(nuevosEDDProyecto);
    }
  }

  useEffect(
    function () {
      if (idEDDProyecto !== null) {
        getData();
        obtenerServicio();
      }
    },
    [idEDDProyecto]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
          <div>
              <label htmlFor="input_nombreDelEDDProyecto">Proyecto:</label>
              <input
               style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre proyecto"
                type="text"
                className="form-control"
                name="input_nombreDelEDDProyecto"
                id="input_nombreDelEDDProyecto"
                value={nomProyecto || ""}
                maxLength="50"
                onChange={({ target }) => setnomProyecto(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_fechaI">Fecha inicio:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio"
                type="datetime"
                className="form-control"
                name="input_fechaI"
                id="input_fechaI"
                value={fechaIni || ""}
                onChange={({ target }) => setfechaIni(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_fechaF">Fecha Fin:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha fin"
                type="datetime"
                className="form-control"
                name="input_fechaF"
                id="input_fechaF"
                value={fechaFin || ""}
                onChange={({ target }) => setfechaFin(target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="input_serv">Servicio del cliente: </label>
              <select
                required
                className="form-control"
                name="input_serv"
                id="input_serv"
                placeholder="Seleccione el servicio del cliente"
                onChange={({ target }) => setidServicio(target.value)}
              >
                {listServicio.map((valor) => (
                  <option
                    selected={valor.idServicio === idServicio ? "selected" : ""}
                    value={valor.idServicio}
                  >
                    {valor.nomServicio}
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

export default EditarEDDProyecto;
