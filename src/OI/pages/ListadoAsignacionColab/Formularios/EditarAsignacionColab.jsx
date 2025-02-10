import React, { useState, useEffect } from "react";
import "../ListadoAsignacionColab.css";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarAsignacionColab({
  isActive,
  cambiarEstado,
  datosFila,
}) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveEditar: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idAsignacion: "",
    idEmpleado: "",
    idMotivo: "",
    fechaIni: "",
    fechaFin: "",
    idUltimoLider: "",
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

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/oi_editarAsignacionColab.php";
    const operationUrl = "oi_editarAsignacionColab";
    var data = {
      idEmpleado: datos.idEmpleado,
      idMotivo: datos.idMotivo,
      fechaIni: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      idUltimoLider: datos.idUltimoLider,
      observaciones: datos.observaciones,
      isActive: datos.isActive,
      usuarioCreacion: userData.usuario,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };
  useEffect(
    function () {
      obtenerEmpleados();
      obtenerMotivos();
      if (datosFila) {
        console.log("datosFila", datosFila);
        setDatos({
          idAsignacion: datosFila.idAsignacion,
          idEmpleado: datosFila.idEmpleado,
          idMotivo: datosFila.idMotivo,
          idUltimoLider: datosFila.idUltimoLider,
          fechaFin: formatDate(datosFila.fechaFin),
          fechaIni: formatDate(datosFila.fechaIni),
          observaciones: datosFila.observaciones,
        });
      }
    },
    [isActive, datosFila]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar asignación colaborador</Modal.Title>
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
                value={datos.idEmpleado || ""}
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
                  <option
                    selected={datos.idEmpleado === valor.idEmpleado}
                    value={valor.idEmpleado}
                  >
                    {valor.nomEmpleado}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_Proyecto">
                Seleccione un motivo de asignación:{" "}
              </label>
              <select
                required
                className="form-control"
                value={datos.idMotivo || ""}
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
                  <option
                    selected={datos.idMotivo === valor.idMotivo}
                    value={valor.idMotivo}
                  >
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
              <div>
                <label htmlFor="input_nomPeriodo" className="input_type_date">
                  Fecha inicio:
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={datos.fechaIni || ""}
                  onChange={({ target }) =>
                    setDatos((prevDatos) => ({
                      ...prevDatos,
                      fechaInicio: target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="input_nomPeriodo">Fecha fin:</label>
                <input
                  type="date"
                  className="form-control"
                  value={datos.fechaFin || ""}
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
              <label htmlFor="input_Proyecto">
                Seleccione el líder del colaborador:{" "}
              </label>
              <select
                required
                className="form-control"
                value={datos.idUltimoLider || ""}
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idUltimoLider: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.listadoEmpleados.map((valor) => (
                  <option
                    selected={datos.idUltimoLider === valor.idEmpleado}
                    value={valor.idEmpleado}
                  >
                    {valor.nomEmpleado}
                  </option>
                ))}
              </select>
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
                value={datos.observaciones || ""}
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
