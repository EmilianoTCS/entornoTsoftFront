import React, { useState, useEffect } from "react";
import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarClientes = ({
  isActiveEditCliente,
  cambiarEstado,
  idCliente,
  cliente,
  setCliente,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomCliente, setNomCliente] = useState("");
  const [direccionCliente, setDireccionCliente] = useState("");
  const [idPais, setidPais] = useState("");

  const [listPais, setlistPais] = useState([""]);

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const listClientes = cliente;

  const show = isActiveEditCliente;

  const handleClose = () => {
    cambiarEstado(false);
    setNomCliente(responseID[0].nomCliente);
    setDireccionCliente(responseID[0].direccionCliente);
    setidPais(responseID[0].idPais);
  };

  // ----------------------FUNCIONES----------------------------
  function obtenerPais() {
    const url = "pages/auxiliares/listadoPaisForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistPais(response));
  }

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idCliente, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setNomCliente(response[0].nomCliente);
      setDireccionCliente(response[0].direccionCliente);
      setidPais(response[0].idPais);
    });
  }, [idCliente]);

  function validaciones() {
    if (nomCliente.trim() === "") {
      TopAlertsError("01", "El nombre del cliente no puede estar vacío");
      return true;
    } else if (idPais < 0) {
      TopAlertsError("02", "El país del cliente no debe estar vacío");
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      var url = "pages/editar/editarCliente.php";
      var operationUrl = "editarCliente";
      var data = {
        usuarioModificacion: userData.usuario,
        idCliente: idCliente,
        nomCliente: nomCliente === "" ? responseID[0].nomCliente : nomCliente,

        direccionCliente:
          direccionCliente === ""
            ? responseID[0].direccionCliente
            : direccionCliente,

        idPais: idPais === "" ? responseID[0].idPais : idPais,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarCliente(cliente);
        cambiarEstado(false);
      });
    }
  }

  function actualizarCliente(cliente) {
    const nuevosClientes = listClientes.map((c) =>
      c.idCliente === cliente.idCliente ? cliente : c
    );
    setCliente(nuevosClientes);
  }
  useEffect(
    function () {
      if (idCliente !== null) {
        getData();
        obtenerPais();
      }
    },
    [idCliente]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelCliente">Nombre:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre completo del cliente"
                value={nomCliente || ""}
                type="text"
                className="form-control"
                name="input_nombreDelCliente"
                id="input_nombreDelCliente"
                maxLength="100"
                onChange={({ target }) => setNomCliente(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_DirecciónDelCliente">Dirección:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre completo del cliente"
                value={direccionCliente || ""}
                type="text"
                className="form-control"
                name="input_DirecciónDelCliente"
                id="input_DirecciónDelCliente"
                maxLength="100"
                onChange={({ target }) => setDireccionCliente(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_Pais">Pais:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidPais(target.value)}
              >
                {listPais.map((valor) => (
                  <option
                    selected={valor.idPais === idPais ? "selected" : ""}
                    value={valor.idPais}
                  >
                    {valor.nomPais}
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

export default EditarClientes;
