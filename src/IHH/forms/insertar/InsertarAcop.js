import React, { useState, useEffect } from "react";
import "./Insertar.css";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function InsertarAcop({ isActive, cambiarEstado }) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idProyecto: "",
    presupuestoTotal: "",
    cantTotalMeses: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    proyecto: [""],
  });

  const obtenerProyecto = () => {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    var data = {
      idServicio: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setAuxList({ proyecto: data });
    });
  };

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/ihh_insertarAcop.php";
    const operationUrl = "ihh_insertarAcop";
    var data = {
      idProyecto: datos.idProyecto,
      presupuestoTotal: datos.presupuestoTotal,
      cantTotalMeses: datos.cantTotalMeses,
      isActive: datos.isActive,
      usuarioCreacion: datos.usuarioCreacion,
    };
    console.log(datos);
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      obtenerProyecto();
    },
    [isActive]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear acop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Proyecto">Nombre del proyecto: </label>
              <select
                required
                className="form-control"
                name="input_Proyecto"
                id="input_Proyecto"
                placeholder="Seleccione el proyecto"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idProyecto: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.proyecto.map((valor) => (
                  <option value={valor.idEDDProyecto}>
                    {valor.nomProyecto}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_presupuestoTotal">Presupuesto total:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Presupuesto total"
                type="text"
                className="form-control"
                name="input_presupuestoTotal"
                id="input_presupuestoTotal"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    presupuestoTotal: target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label htmlFor="input_cantTotalMeses">
                Cantidad total de meses:
              </label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Cantidad total de meses"
                type="text"
                className="form-control"
                name="input_cantTotalMeses"
                id="input_cantTotalMeses"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    cantTotalMeses: target.value,
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
