import React, { useState, useEffect } from "react";
import "../ListadoFormProyEmp.css";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function InsertarFormProyEmp({ isActive, cambiarEstado }) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveInsertar: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idFormulario: "",
    idEDDProyEmp: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    listadoFormularios: [""],
    listadoEddProyEmp: [""],
  });
  const obtenerFormularios = () => {
    var url = "pages/listados/oi_listadoFormulario.php";
    var operationUrl = "oi_listadoFormulario";
    var data = {
      num_boton: 1,
      cantidadPorPagina: 99999999999,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setAuxList((prev) => ({
        ...prev,
        listadoFormularios: datos.datos,
      }));
    });
  };
  const obtenerProyEmp = () => {
    var url = "pages/auxiliares/listadoEddProyEmp.php";
    var operationUrl = "listados";
    var data = {
      idProyecto: 0,
    };

    SendDataService(url, operationUrl, data).then((response) => {
      setAuxList((prev) => ({
        ...prev,
        listadoEddProyEmp: response,
      }));
    });
  };

  const Validaciones = () => {
    if (datos.idFormulario < 1 || datos.idFormulario === "") {
      TopAlertsError("01", "El formulario no puede estar vacío");
      return true;
    }

    if (datos.idEDDProyEmp < 1 || datos.idEDDProyEmp === "") {
      TopAlertsError(
        "02",
        "La relación proyecto - colaborador no puede estar vacía"
      );
      return true;
    }

    return false;
  };

  function SendData(e) {
    e.preventDefault();
    if (Validaciones()) {
      return;
    }
    const url = "pages/insertar/oi_insertarFormProyEmp.php";
    const operationUrl = "oi_insertarFormProyEmp";
    var data = {
      idFormulario: datos.idFormulario,
      idEDDProyEmp: datos.idEDDProyEmp,
      isActive: datos.isActive,
      usuarioCreacion: userData.usuario,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      obtenerFormularios();
      obtenerProyEmp();
    },
    [isActive]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear formulario - proyecto - colaborador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Proyecto">Seleccione un formulario: </label>
              <select
                required
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idFormulario: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {auxList.listadoFormularios.map((valor) => (
                  <option value={valor.idFormulario}>
                    {valor.nomFormulario}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_Proyecto">
                Seleccione una relación proyecto - colaborador:{" "}
              </label>
              <select
                required
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idEDDProyEmp: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.listadoEddProyEmp.map((valor) => (
                  <option value={valor.idEDDProyEmp}>{valor.nomProyEmp}</option>
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
}
