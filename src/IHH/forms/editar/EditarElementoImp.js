import React, { useState, useEffect } from "react";
import "./Editar.css";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarElementoImp({
  isActive,
  cambiarEstado,
  idRegistro,
  nombreTabla,
}) {
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

  const obtenerDatos = () => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idRegistro, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      setDatos((prevDatos) => ({
        ...prevDatos,
        idTipoElemento: response[0].idTipoElemento,
        nomElemento: response[0].nomElemento,
        descripcion: response[0].descripcion,
      }));
    });
  };

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarElementoImp.php";
    const operationUrl = "ihh_editarElementoImp";
    var data = {
      idElementoImp: idRegistro,
      idTipoElemento: datos.idTipoElemento,
      nomElemento: datos.nomElemento,
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
      obtenerTipoElementos();
      obtenerDatos();
    },
    [isActive, idRegistro]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar elemento de impugnación</Modal.Title>
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
                  <option
                    value={valor.idTipoElemento}
                    selected={
                      valor.idTipoElemento === datos.idTipoElemento
                        ? "selected"
                        : ""
                    }
                  >
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
                value={datos.nomElemento || ""}

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
                value={datos.descripcion || ""}

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
