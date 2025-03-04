import React, { useState, useEffect } from "react";
import "../ListadoOpInternas.css";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function InsertarEstadoColab({ isActive, cambiarEstado }) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveInsertarEstado: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idColaborador: "",
    idElementoImp: "",
    fechaInicio: "",
    fechaFin: "",
    observaciones: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    listadoEmpleados: [""],
    listadoElementoImp: [""],
  });

  const Validaciones = () => {
    if (datos.idColaborador < 1 || datos.idColaborador === "") {
      TopAlertsError("01", "El colaborador no puede estar vacío");
      return true;
    }
    if (
      datos.fechaFin &&
      new Date(datos.fechaInicio).toLocaleString("es-CL") >
        new Date(datos.fechaFin).toLocaleString("es-CL")
    ) {
      TopAlertsError(
        "02",
        "La fecha de inicio no puede ser mayor a la fecha de fin"
      );
      return true;
    } else {
      return false;
    }
  };

  const obtenerEmpleados = () => {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoEmpleados: data,
      }));
    });
  };

  const obtenerElementos = () => {
    var url = "pages/auxiliares/ihh_listadoElementoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoElementoImp: data,
      }));
    });
  };

  function SendData(e) {
    e.preventDefault();

    if (Validaciones()) {
      return;
    }

    const url = "pages/insertar/oi_insertarEstadoColaborador.php";
    const operationUrl = "oi_insertarEstadoColaborador";
    var data = {
      idElemento: datos.idElementoImp,
      idEmpleado: datos.idColaborador,
      fechaIni: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      observaciones: datos.observaciones,
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
      obtenerEmpleados();
      obtenerElementos();
    },
    [isActive]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear estado colaborador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Proyecto">
                Seleccione un colaborador:{" "}
              </label>
              <select
                required
                className="form-control"
                placeholder="Seleccione un colaborador"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idColaborador: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.listadoEmpleados.map((valor) => (
                  <option value={valor.idEmpleado}>{valor.nomEmpleado}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_Proyecto">Seleccione la licencia: </label>
              <select
                required
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idElementoImp: target.value,
                  }))
                }
              >
                <option hidden value={null}>
                  Desplegar lista
                </option>
                <option value={""}>SIN LICENCIA</option>
                {auxList.listadoElementoImp.map((valor) => (
                  <option value={valor.idElementoImp}>
                    {valor.nomElemento}
                  </option>
                ))}
              </select>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "10px",
                margin: "auto",
              }}
            >
              <div style={{width:"50%"}}>
                <label htmlFor="input_nomPeriodo" className="input_type_date">
                  Fecha inicio:
                </label>
                <input
                  type="date"
                  className="form-control"
                  onChange={({ target }) =>
                    setDatos((prevDatos) => ({
                      ...prevDatos,
                      fechaInicio: target.value,
                    }))
                  }
                  // required
                />
              </div>
              <div style={{width:"50%"}}>
                <label htmlFor="input_nomPeriodo">Fecha fin:</label>
                <input
                  type="date"
                  className="form-control"
                  onChange={({ target }) =>
                    setDatos((prevDatos) => ({
                      ...prevDatos,
                      fechaFin: target.value,
                    }))
                  }
                  // required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="input_Proyecto">Observaciones (opcional): </label>
              <textarea
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    observaciones: target.value,
                  }))
                }
                maxLength={400}
                rows={5}
                style={{ fontSize: "10pt" }}
              ></textarea>
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
