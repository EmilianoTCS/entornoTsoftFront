import React, { useState, useEffect } from "react";
import "../ListadoCompetenciaColab.css";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function InsertarCompetenciaColab({ isActive, cambiarEstado }) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveInsertar: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
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
 const Validaciones = () => {
    if (datos.idEmpleado < 1 || datos.idEmpleado === "") {
      TopAlertsError("01", "El colaborador no puede estar vacío");
      return true;
    }
    if (datos.idCompetencia < 1 || datos.idCompetencia === "") {
      TopAlertsError("02", "La competencia no puede estar vacía");
      return true;
    }
    if (
      datos.porcentaje < 0 ||
      datos.porcentaje > 100 ||
      datos.porcentaje === ""
    ) {
      TopAlertsError("03", "El porcentaje debe ser entre cero y cien");
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
    const url = "pages/insertar/oi_insertarCompetenciasColab.php";
    const operationUrl = "oi_insertarCompetenciasColab";
    var data = {
      idEmpleado: datos.idEmpleado,
      idCompetencia: datos.idCompetencia,
      porcentaje: datos.porcentaje,
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
      obtenerCompetencias();
    },
    [isActive]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear competencia colaborador</Modal.Title>
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
              <label htmlFor="input_Proyecto">
                Seleccione una competencia:{" "}
              </label>
              <select
                required
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
                  <option value={valor.idEDDEvalCompetencia}>
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
