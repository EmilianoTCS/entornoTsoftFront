import React, { useState, useEffect } from "react";
import "./Editar.css";

import { NumericFormat } from "react-number-format";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarAcopProy({ isActive, cambiarEstado, Registro }) {
  const handleClose = () => {
    cambiarEstado(false);
  };
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [acopProy, setAcopProy] = useState();

  const [listadosProyectos, setListadosProyectos] = useState([]);
  const [listadosAcops, setListadosAcops] = useState([]);

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarAcopProy.php";    
    const operationUrl = "ihh_editarAcopProy";
    var data = {
      idAcop: acopProy.idAcop,
      idProyecto: acopProy.idProyecto,
      idAcopProy: acopProy.idacopproy,
      usuarioModificacion: userData.usuario,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
      cambiarEstado(false);
    });
  }

  const obtenerAcops = () => {
    var url = "pages/listados/ihh_listadoAcop.php";
    var operationUrl = "ihh_listadoAcop";
    var data = {
      num_boton: 1,
      cantidadPorPagina: 999999999999999,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { paginador, ...datos } = response;
      setListadosAcops(datos.datos);
    });
  };
  function obtenerProyecto() {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    var data = {
      idServicio: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListadosProyectos(data);
    });
  }
  useEffect(
    function () {
      setAcopProy(Registro);
      obtenerAcops();
      obtenerProyecto();
    },
    [Registro]
  );

  return acopProy ? (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar asociación PROYECTO - ACOP </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_Proyecto">Seleccione un proyecto:</label>
              <select
                required
                className="form-control"
                name="input_Proyecto"
                id="input_Proyecto"
                value={acopProy.idProyecto || ""}
                placeholder="Seleccione un proyecto"
                onChange={({ target }) =>
                  setAcopProy((prevDatos) => ({
                    ...prevDatos,
                    idProyecto: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listadosProyectos.map((valor) => (
                  <option key={valor.idEDDProyecto} value={valor.idEDDProyecto}>
                    {valor.nomProyecto}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_nombreAcop">Seleccione un ACOP:</label>
              <select
                required
                className="form-control"
                name="input_Proyecto"
                id="input_Proyecto"
                value={acopProy.idAcop || ""}
                placeholder="Seleccione un ACOP"
                onChange={({ target }) =>
                  setAcopProy((prevDatos) => ({
                    ...prevDatos,
                    idAcop: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listadosAcops.map((valor) => (
                  <option key={valor.idAcop} value={valor.idAcop}>{valor.nomAcop}</option>
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
  ) : (
    <></>
  );
}
