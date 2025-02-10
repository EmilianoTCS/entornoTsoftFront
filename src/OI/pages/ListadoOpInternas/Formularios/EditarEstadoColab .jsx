import React, { useState, useEffect } from "react";
import "../ListadoOpInternas.css";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarEstadoColab({
  isActive,
  cambiarEstado,
  datosFila,
}) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveEditarEstado: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idEstadoColaborador: "",
    idColaborador: "",
    idElementoImp: "",
    fechaIni: "",
    fechaFin: "",
    observaciones: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    listadoEmpleados: [""],
    listadoElementoImp: [""],
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
    const url = "pages/editar/oi_editarEstadoColaborador.php";
    const operationUrl = "oi_editarEstadoColaborador";
    var data = {
      idEstadoColab: datos.idEstadoColab,
      idElemento: datos.idElementoImp,
      idEmpleado: datos.idColaborador,
      fechaIni: datos.fechaIni,
      fechaFin: datos.fechaFin,
      observaciones: datos.observaciones,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };

    console.log(data);

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
      obtenerElementos();
      if (datosFila) {
        console.log("datosFila", datosFila);

        setDatos({
          idEstadoColab: datosFila.idEstadoColaborador,
          idColaborador: datosFila.idEmpleado,
          idElementoImp: datosFila.idElementoImp,
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
          <Modal.Title>Editar estado colaborador</Modal.Title>
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
                value={datos.idColaborador || ""}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.listadoEmpleados.map((valor) => (
                  <option
                    selected={
                      valor.idEmpleado === datos.idColaborador ? true : false
                    }
                    value={valor.idEmpleado}
                  >
                    {valor.nomEmpleado}
                  </option>
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
                value={datos.idElementoImp || ""}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.listadoElementoImp.map((valor) => (
                  <option
                    selected={
                      valor.idElementoImp === datos.idElementoImp ? true : false
                    }
                    value={valor.idElementoImp}
                  >
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
              <div>
                <label htmlFor="input_nomPeriodo" className="input_type_date">
                  Fecha inicio:
                </label>
                <input
                  type="date"
                  className="form-control"
                  onChange={({ target }) =>
                    setDatos((prevDatos) => ({
                      ...prevDatos,
                      fechaIni: target.value,
                    }))
                  }
                  value={datos.fechaIni || ""}
                  required
                />
              </div>
              <div>
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
                  value={datos.fechaFin || ""}
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
                value={datos.observaciones || ""}
                style={{fontSize: "10pt"}}
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
