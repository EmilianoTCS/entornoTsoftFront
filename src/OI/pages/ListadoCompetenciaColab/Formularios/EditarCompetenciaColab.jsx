import React, { useState, useEffect } from "react";
import "../ListadoCompetenciaColab.css";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarCompetenciaColab({
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
    idCompetenciaColab: "",
    idEmpleado: "",
    idCompetencia: "",
    porcentaje: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    listadoEmpleados: [""],
    listadoCompetencias: [""],
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

  const obtenerCompetencias = () => {
    const url = "pages/auxiliares/listadoEddEvalCompetencia.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoCompetencias: response,
      }));
    });
  };

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/oi_editarCompetenciasColab.php";
    const operationUrl = "oi_editarCompetenciasColab";
    var data = {
      idCompetenciaColab: datos.idCompetenciaColab,
      idEmpleado: datos.idEmpleado,
      idCompetencia: datos.idCompetencia,
      porcentaje: datos.porcentaje,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };
    console.log(data);
    
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      obtenerEmpleados();
      obtenerCompetencias();
      if (datosFila) {
        setDatos({
          idCompetenciaColab: datosFila.idCompetenciaColab,
          idEmpleado: datosFila.idEmpleado,
          idCompetencia: datosFila.idCompetencia,
          porcentaje: datosFila.porcentaje,
          isActive: datosFila.isActive,
        });
      }
    },
    [isActive, datosFila]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar competencia colaborador</Modal.Title>
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
                value={datos.idEmpleado || ""}
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
                Seleccione una competencia:{" "}
              </label>
              <select
                required
                value={datos.idCompetencia || ""}
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idCompetencia: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.listadoCompetencias.map((valor) => (
                  <option
                    selected={
                      datos.idCompetencia === valor.idEDDEvalCompetencia
                    }
                    value={valor.idEDDEvalCompetencia}
                  >
                    {valor.nomCompetencia}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="input_nomPeriodo">Porcentaje:</label>
              <input
                type="number"
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    porcentaje: target.value,
                  }))
                }
                value={datos.porcentaje || ""}
                max={100}
                min={0}
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
