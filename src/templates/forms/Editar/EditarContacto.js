import React, { useState, useEffect } from "react";
import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import TopAlerts from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarContacto = ({
  isActiveEditContacto,
  cambiarEstado,
  idContacto,
  contacto,
  setContacto,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomContacto, setnomContacto] = useState("");
  const [correoContacto, setcorreoContacto] = useState("");
  const [telefonoContacto, settelefonoContacto] = useState("");
  const [fechaIni, setfechaIni] = useState("");

  const [idServicio, setidServicio] = useState("");
  
  const [listServicio, setlistServicio] = useState([""]);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [responseID, setResponseID] = useState([""]);
  const listContacto = contacto;

  const show = isActiveEditContacto;

  const handleClose = () => {
    cambiarEstado(false);
    setnomContacto(responseID[0].nomContacto);
    setcorreoContacto(responseID[0].correoContacto);
    settelefonoContacto(responseID[0].telefonoContacto);
    setfechaIni(responseID[0].fechaIni);
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
    var data = { idRegistro: idContacto, nombreTabla: nombreTabla};
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setnomContacto(response[0].nomContacto);
      setcorreoContacto(response[0].correoContacto);
      settelefonoContacto(response[0].telefonoContacto);
      setfechaIni(response[0].fechaIni);
      setidServicio(response[0].idServicio);
    });
  }, [idContacto]);

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/editarContacto.php";
    const operationUrl = "editarContacto";

    var data = {
      usuarioModificacion: userData.usuario,
      idContacto: idContacto,
      nomContacto: nomContacto === "" ? responseID[0].nomContacto : nomContacto,
      correoContacto: correoContacto === "" ? responseID[0].correoContacto : correoContacto,
      telefonoContacto: telefonoContacto === "" ? responseID[0].telefonoContacto : telefonoContacto,
      fechaIni: fechaIni === "" ? responseID[0].fechaIni : fechaIni,

      idServicio: idServicio === "" ? responseID[0].idServicio : idServicio,

    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      TopAlerts('successEdited');
      {actualizarContacto(contacto);console.log(response);};
    });

    function actualizarContacto(contacto) {
      const nuevosContactos = listContacto.map((c) =>
        c.idContacto === contacto.idContacto ? contacto : c
      );
      setContacto(nuevosContactos);
    }
  }

  useEffect(
    function () {
      if (idContacto !== null) {
        getData();
        obtenerServicio();
      }
    },
    [idContacto]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelContacto">Nombre:</label>
              <input
               style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre completo del contacto"
                value={nomContacto || ""}
                type="text"
                className="form-control"
                name="input_nombreDelContacto"
                id="input_nombreDelContacto"
                maxLength="50"
                onChange={({ target }) => setnomContacto(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_Correo">Correo:</label>
              <input
               style={{ textTransform: "uppercase" }}
                placeholder="Escriba el correo del contacto"
                value={correoContacto || ""}
                type="email"
                className="form-control"
                name="input_correo"
                id="input_correo"
                maxLength="100"
                onChange={({ target }) => setcorreoContacto(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_telefono">Teléfono: </label>

              <input
                placeholder="Escriba el teléfono"
                value={telefonoContacto || ""}
                type="tel"
                className="form-control"
                name="input_telefono"
                id="input_telefono"
                maxLength="15"
                required
                onChange={({ target }) => settelefonoContacto(target.value)}
              />
            </div>

            <div>
              <label htmlFor="input_Pais">Servicio:</label>
              <select
                required
                type="text"
                className="form-control"
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
            
            <div>
              <label htmlFor="input_fechaI">Fecha inicio:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio"
                value={fechaIni || ""}
                type="datetime"
                className="form-control"
                name="input_fechaI"
                id="input_fechaI"
                onChange={({ target }) => setfechaIni(target.value)}
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

export default EditarContacto;
