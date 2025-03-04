import React, { useState, useEffect } from "react";
import "../ListadoSeniorityColab.css";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function InsertarSeniorityColab({ isActive, cambiarEstado }) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveInsertar: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idEmpleado: "",
    idMotivo: "",
    fechaInicio: "",
    fechaFin: "",
    observaciones: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    listadoEmpleados: [""],
    listadoMotivos: [""],
  });

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

  const obtenerMotivos = () => {
    const url = "pages/listados/oi_listadoMotivosEstandar.php";
    const operationUrl = "oi_listadoMotivosEstandar";
    let data = {
      tipo: "",
      num_boton: 1,
      cantidadPorPagina: "999999999",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoMotivos: response.datos,
      }));
    });
  };

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
        "01",
        "La fecha de inicio no puede ser mayor a la fecha de fin"
      );
      return true;
    } else {
      return false;
    }
  };

  function SendData(e) {
    e.preventDefault();
    if (Validaciones()) {
      return;
    }
    const url = "pages/insertar/oi_insertarSeniority.php";
    const operationUrl = "oi_insertarSeniority";
    var data = {
      idEmpleado: datos.idEmpleado,
      idMotivo: datos.idMotivo,
      fechaIni: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      observaciones: datos.observaciones,
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
      obtenerEmpleados();
      obtenerMotivos();
    },
    [isActive]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear seniority colaborador</Modal.Title>
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
                    idEmpleado: target.value,
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
              <label htmlFor="input_Proyecto">Seleccione un motivo de seniority: </label>
              <select
                required
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idMotivo: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.listadoMotivos.map((valor) => (
                  <option value={valor.idMotivo}>
                    {valor.nombreMotivo}
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
                  required
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
                  required
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
