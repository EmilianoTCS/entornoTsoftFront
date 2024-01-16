import React, { useState, useEffect } from "react";
import "./Insertar.css";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function InsertarPeriodo({ isActive, cambiarEstado }) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idTipoPeriodo: "",
    nomPeriodo: "",
    descripcion: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    tipoPeriodo: [""],
  });

  const obtenerTipoPeriodos = () => {
    var url = "pages/auxiliares/ihh_listadoTipoPeriodoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      console.log(data);
      setAuxList({ tipoPeriodo: data });
    });
  };

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/ihh_insertarPeriodo.php";
    const operationUrl = "ihh_insertarPeriodo";
    var data = {
      idTipoPeriodo: datos.idTipoPeriodo,
      nomPeriodo: datos.nomPeriodo,
      descripcion: datos.descripcion,
      isActive: datos.isActive,
      usuarioCreacion: datos.usuarioCreacion,
    };
    console.log(datos);
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      obtenerTipoPeriodos();
    },
    [isActive]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear período</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Proyecto">Tipo de período: </label>
              <select
                required
                className="form-control"
                name="input_Proyecto"
                id="input_Proyecto"
                placeholder="Seleccione el tipo de período"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idTipoPeriodo: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.tipoPeriodo.map((valor) => (
                  <option value={valor.idTipoPeriodo}>
                    {valor.nomTipoPeriodo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_nomPeriodo">Nombre del periodo:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Nombre del periodo"
                type="text"
                className="form-control"
                name="input_nomPeriodo"
                id="input_nomPeriodo"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    nomPeriodo: target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label htmlFor="input_descripcion">Descripción (opcional):</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Descripción del período"
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
}
