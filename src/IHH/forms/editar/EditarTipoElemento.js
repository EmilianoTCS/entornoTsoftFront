import React, { useState, useEffect } from "react";
import "./Editar.css";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarTipoElemento({
  isActive,
  cambiarEstado,
  idRegistro,
  nombreTabla,
}) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    nomTipoElemento: "",
    descripcion: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

 


  const obtenerDatos = () => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idRegistro, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      setDatos((prevDatos) => ({
        ...prevDatos,
        nomTipoElemento: response[0].nomTipoElemento,
        descripcion: response[0].descripcion,
      }));
    });
  };

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarTipoElemento.php";
    const operationUrl = "ihh_editarTipoElemento";
    var data = {
      idTipoElemento: idRegistro,
      nomTipoElemento: datos.nomTipoElemento,
      descripcion: datos.descripcion,
      isActive: datos.isActive,
      usuarioCreacion: datos.usuarioCreacion,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      obtenerDatos();
    },
    [isActive, idRegistro]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar tipo de elemento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nomElemento">Nombre del tipo de elemento:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Nombre del tipo de elemento"
                type="text"
                className="form-control"
                name="input_nomElemento"
                id="input_nomElemento"
                value={datos.nomTipoElemento || ""}
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    nomTipoElemento: target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label htmlFor="input_descripcion">
                Descripción (opcional):
              </label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="descripcion"
                type="text"
                className="form-control"
                name="input_descripcion"
                value={datos.descripcion || ""}
                id="input_descripcion"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    descripcion: target.value,
                  }))
                }
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
}
