import React, { useState, useEffect } from "react";
import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarEmpleados = ({
  isActiveEditEmpleado,
  cambiarEstado,
  idEmpleado,
  empleado,
  setEmpleado,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomEmpleado, setnomEmpleado] = useState("");
  const [correoEmpleado, setcorreoEmpleado] = useState("");
  const [telefonoEmpleado, setTelefonoEmpleado] = useState("");
  const [idPais, setidPais] = useState("");
  const [idArea, setidArea] = useState("");
  const [idCargo, setidCargo] = useState("");
  const [idCliente, setidCliente] = useState("");

  const [listCliente, setlistCliente] = useState([""]);
  const [listPais, setlistPais] = useState([""]);
  const [listCargo, setlistCargo] = useState([""]);
  const [listArea, setlistArea] = useState([""]);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [responseID, setResponseID] = useState([""]);
  const listEmpleados = empleado;

  const show = isActiveEditEmpleado;

  const handleClose = () => {
    cambiarEstado(false);
    setnomEmpleado(responseID[0].nomEmpleado);
    setcorreoEmpleado(responseID[0].correoEmpleado);
    setTelefonoEmpleado(responseID[0].telefonoEmpleado);
    setidPais(responseID[0].idPais);
    setidArea(responseID[0].idArea);
    setidCargo(responseID[0].idCargo);
    setidCliente(responseID[0].idCliente);

  };
  // ----------------------FUNCIONES----------------------------
  function obtenerPais() {
    const url = "pages/auxiliares/listadoPaisForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistPais(response));
  }
  function obtenerCargo() {
    const url = "pages/auxiliares/listadoCargoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCargo(response)
    );
  }
  function obtenerArea() {
    const url = "pages/auxiliares/listadoAreaForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistArea(response));
  }
  function obtenerCliente() {
    const url = "pages/auxiliares/listadoClienteForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCliente(response)
    );
  }
  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEmpleado, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setnomEmpleado(response[0].nomEmpleado);
      setcorreoEmpleado(response[0].correoEmpleado);
      setTelefonoEmpleado(response[0].telefonoEmpleado);
      setidPais(response[0].idPais);
      setidArea(response[0].idArea);
      setidCargo(response[0].idCargo);
      setidCliente(response[0].idCliente);
      
    });
  }, [idEmpleado]);

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/editarEmpleado.php";
    const operationUrl = "editarEmpleado";

    var data = {
      usuarioModificacion: userData.usuario,
      idEmpleado: idEmpleado,
      nomEmpleado: nomEmpleado === "" ? responseID[0].nomEmpleado : nomEmpleado,
      correoEmpleado:
        correoEmpleado === "" ? responseID[0].correoEmpleado : correoEmpleado,
      telefonoEmpleado:
        telefonoEmpleado === ""
          ? responseID[0].telefonoEmpleado
          : telefonoEmpleado,
      idPais: idPais === "" ? responseID[0].idPais : idPais,
      idArea: idArea === "" ? responseID[0].idArea : idArea,
      idCargo: idCargo === "" ? responseID[0].idCargo : idCargo,
      idCliente: idCliente=== "" ? responseID[0].idCliente : idCliente,

    };
    SendDataService(url, operationUrl, data).then((response) => {
      // TopAlerts('successEdited');
      { actualizarEmpleado(empleado); console.log(response); };
    });

    function actualizarEmpleado(empleado) {
      const nuevosEmpleados = listEmpleados.map((c) =>
        c.idEmpleado === empleado.idEmpleado ? empleado : c
      );
      setEmpleado(nuevosEmpleados);
    }
  }

  useEffect(
    function () {
      if (idEmpleado !== null) {
        getData();
        obtenerPais();
        obtenerArea();
        obtenerCargo();
        obtenerCliente();
      }
    },
    [idEmpleado]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Colaborador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelEmpleado">Nombre:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre completo del colaborador"
                value={nomEmpleado || ""}
                type="text"
                className="form-control"
                name="input_nombreEmpleado"
                id="input_nombreEmpleado"
                onChange={({ target }) => setnomEmpleado(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_Correo">Correo:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba el correo del colaborador"
                value={correoEmpleado || ""}
                type="email"
                className="form-control"
                name="input_correo"
                id="input_correo"
                onChange={({ target }) => setcorreoEmpleado(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_telefono">Teléfono (opcional): </label>

              <input
                placeholder="Escriba el teléfono"
                value={telefonoEmpleado || ""}
                type="tel"
                className="form-control"
                name="input_telefono"
                id="input_telefono"
                onChange={({ target }) => setTelefonoEmpleado(target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="input_pais">País: </label>
              <select
                value={idPais || ""}
                required
                className="form-control"
                name="input_pais"
                id="input_pais"
                placeholder="Seleccione el pais"
                onChange={({ target }) => setidPais(target.value)}
              >
                <option selected hidden value="">
                  {idPais}
                </option>
                {listPais.map((valor) => (
                  <option value={valor.idPais}>{valor.nomPais}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input_Cargo">Cargo: </label>
              <select
                required
                value={idCargo || ""}
                className="form-control"
                name="input_Cargo"
                id="input_Cargo"
                placeholder="Seleccione el cargo"
                onChange={({ target }) => setidCargo(target.value)}
              >
                <option selected hidden value="">
                  {idCargo}
                </option>
                {listCargo.map((valor) => (
                  <option value={valor.idCargo}>{valor.nomCargo}</option>
                ))}
                idArea
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input_Area">Área: </label>
              <select
                required
                value={idArea || ""}
                className="form-control"
                name="input_Area"
                id="input_Area"
                placeholder="Seleccione el área"
                onChange={({ target }) => setidArea(target.value)}
              >
                <option selected hidden value="">
                  {idArea}
                </option>
                {listArea.map((valor) => (
                  <option value={valor.idArea}>{valor.nomArea}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input_Area">Cliente: </label>
              <select
                required
                value={idCliente||''}
                className="form-control"
                name="input_Area"
                id="input_Area"
                placeholder="Seleccione el área"
              onChange={({ target }) => setidCliente(target.value)}
              >
              {listCliente.map((valor) => (
                  <option
                    selected={valor.idCliente === idCliente ? false : ""}
                    value={valor.idCliente}
                  >
                    {valor.nomCliente}
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

export default EditarEmpleados;
