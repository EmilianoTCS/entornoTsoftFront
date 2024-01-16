import React, { useState, useEffect } from "react";
import "./Editar.css";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarImpugnacionEmp({
  isActive,
  cambiarEstado,
  idRegistro,
  nombreTabla,
}) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  /* The code is using the `useState` hook from React to define two state variables: `datos` and
`auxList`. */
const [datos, setDatos] = useState({
  idEmpleado: "",
  idElemento: "",
  idPeriodo: "",
  idAcop: "",
  cantHorasPeriodo: "",
  cantHorasExtra: "",
  factor: "",
  isActive: 1,
  usuarioCreacion: userData.usuario,
});

  const [auxList, setAuxList] = useState({
    empleados: [""],
    elementos: [""],
    periodos: [""],
    acops: [""],
  });

  /**
   * The code defines four functions in JavaScript that make API calls to retrieve data for employees,
   * elements, periods, and acops.
   */

  const obtenerEmpleados = () => {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        empleados: data,
      }));
    });
  };
  const obtenerElementos = () => {
    var url = "pages/auxiliares/ihh_listadoElementoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        elementos: data,
      }));
    });
  };
  const obtenerPeriodo = () => {
    var url = "pages/auxiliares/ihh_listadoPeriodoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        periodos: data,
      }));
    });
  };
  const obtenerAcops = () => {
    var url = "pages/auxiliares/ihh_listadoAcopForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        acops: data,
      }));
    });
  };

  const obtenerDatos = () => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idRegistro, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      setDatos((prevDatos) => ({
        ...prevDatos,
        idEmpleado: response[0].idEmpleado,
        idElemento: response[0].idElemento,
        idPeriodo: response[0].idPeriodo,
        idAcop: response[0].idAcop,
        cantHorasPeriodo: response[0].cantHorasPeriodo,
        cantHorasExtra: response[0].cantHorasExtra,
        factor: response[0].factor,
      }));
    });
  };

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarImpugnacionEmp.php";
    const operationUrl = "ihh_editarImpugnacionEmp";
    var data = {
      idImpugnacionEmp: idRegistro,
      idEmpleado: datos.idEmpleado,
      idElemento: datos.idElemento,
      idPeriodo: datos.idPeriodo,
      idAcop: datos.idAcop,
      cantHorasPeriodo: datos.cantHorasPeriodo,
      cantHorasExtra: datos.cantHorasExtra,
      factor: datos.factor,
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
      obtenerPeriodo();
      obtenerAcops();
      obtenerDatos();
    },
    [isActive, idRegistro]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar impugnación de empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Empleado">Seleccione el empleado: </label>
              <select
                required
                className="form-control"
                name="input_Empleado"
                id="input_Empleado"
                placeholder="Seleccione el empleado"
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

                {auxList.empleados.map((valor) => (
                  <option 
                  selected={valor.idEmpleado === datos.idEmpleado ? "selected" : ""}
                  value={valor.idEmpleado}>{valor.nomEmpleado}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_Elemento">Seleccione el elemento: </label>
              <select
                required
                className="form-control"
                name="input_Elemento"
                id="input_Elemento"
                placeholder="Seleccione el elemento"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idElemento: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.elementos.map((valor) => (
                  <option 
                  selected={valor.idElementoImp === datos.idElemento ? "selected" : ""}
                  
                  value={valor.idElementoImp}>
                    {valor.nomElemento}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_Periodo">Seleccione el periodo: </label>
              <select
                required
                className="form-control"
                name="input_Periodo"
                id="input_Periodo"
                placeholder="Seleccione el periodo"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idPeriodo: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.periodos.map((valor) => (
                  <option
                  selected={valor.idPeriodo === datos.idPeriodo ? "selected" : ""}

                  value={valor.idPeriodo}>{valor.nomPeriodo}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_Periodo">Seleccione el acop: </label>
              <select
                required
                className="form-control"
                name="input_Periodo"
                id="input_Periodo"
                placeholder="Seleccione el periodo"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idAcop: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.acops.map((valor) => (
                  <option 
                  selected={valor.idAcop === datos.idAcop ? "selected" : ""}
                  value={valor.idAcop}>{valor.nomProyecto}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_cantHorasPeriodo">Cantidad de horas:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Cantidad de horas del período"
                type="number"
                className="form-control"
                name="input_cantHorasPeriodo"
                id="input_cantHorasPeriodo"
                value={datos.cantHorasPeriodo || ""}
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    cantHorasPeriodo: target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="input_cantHorasExtra">Cantidad de horas extra:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Cantidad de horas extra"
                type="number"
                className="form-control"
                name="input_cantHorasExtra"
                id="input_cantHorasExtra"
                value={datos.cantHorasExtra || ""}

                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    cantHorasExtra: target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="input_factor">Factor:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Factor del empleado"
                type="text"
                className="form-control"
                name="input_factor"
                id="input_factor"
                value={datos.factor || ""}

                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    factor: target.value,
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
