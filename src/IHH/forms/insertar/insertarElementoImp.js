import React, { useState, useEffect } from "react";
import "./Insertar.css";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function InsertarElementoImp({ isActive, cambiarEstado }) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idTipoElemento: "",
    nomElemento: "",
    descripcion: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    tipoElementos: [""],
  });

  const obtenerTipoElementos = () => {
    var url = "pages/auxiliares/ihh_listadoTipoElementoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList({ tipoElementos: data });
    });
  };

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/ihh_insertarElementoImp.php";
    const operationUrl = "ihh_insertarElementoImp";
    var data = {
      idTipoElemento: datos.idTipoElemento,
      nomElemento: datos.nomElemento,
      descripcion: datos.descripcion,
      isActive: datos.isActive,
      usuarioCreacion: datos.usuarioCreacion,
    };
    console.log(datos);
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT} = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
        obtenerTipoElementos();
    },
    [isActive]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear elemento de impugnación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_TipoElemento">Tipo de elemento: </label>
              <select
                required
                className="form-control"
                name="input_TipoElemento"
                id="input_TipoElemento"
                placeholder="Seleccione el tipo de elemento"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idTipoElemento: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.tipoElementos.map((valor) => (
                  <option value={valor.idTipoElemento}>
                    {valor.nomTipoElemento}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_nomElemento">Nombre del elemento:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Nombre del elemento"
                type="text"
                className="form-control"
                name="input_nomElemento"
                id="input_nomElemento"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    nomElemento: target.value,
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
