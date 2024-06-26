import React, { useState, useEffect } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditarPresupuestosMensuales from "../Editar/EditarPresupuestosMensuales";

const InsertarEDDProyecto = ({
  isActiveEDDProyecto,
  cambiarEstado,
  EDDProyecto,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomProyecto, setnomProyecto] = useState("");
  const [fechaIni, setfechaIni] = useState("");
  const [fechaFin, setfechaFin] = useState(null);
  const [tipoProyecto, setTipoProyecto] = useState("");
  const [presupuestoTotal, setPresupuestoTotal] = useState({ value: "", formatted: "" });

  const [idServicio, setidServicio] = useState("");

  const [listServicio, setlistServicio] = useState([""]);
  const [listTipoProyectos, setlistTipoProyectos] = useState([""]);
  const [datosResumen, setDatosResumen] = useState([""]);
  const [isActiveFormularioPresupuesto, setisActiveFormularioPresupuesto] =
    useState(false);

  const listEDDProyecto = EDDProyecto;

  const show = isActiveEDDProyecto;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function obtenerServicio() {
    const url = "pages/auxiliares/listadoServicioForms.php";
    const operationUrl = "listados";
    var data = {
      idCliente: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setlistServicio(data);
    });
  }

  function obtenerTipoProyecto() {
    const url = "pages/auxiliares/listadoTipoProyectos.php";
    const operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setlistTipoProyectos(data);
    });
  }

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/insertarEddProyecto.php";
    const operationUrl = "insertarEddProyecto";
    var data = {
      usuarioCreacion: userData.usuario,
      nomProyecto: nomProyecto,
      fechaIni: fechaIni,
      fechaFin: fechaFin,
      tipoProyecto: tipoProyecto,
      idServicio: idServicio,
      presupuestoTotal: presupuestoTotal.value, // Enviar el valor sin formatear
      isActive: true,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
      TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
      actualizarEDDProyecto(datos);
      if (datos.idresumenperproy && !isActiveFormularioPresupuesto) {
        setisActiveFormularioPresupuesto(true);
        setDatosResumen(response);
        cambiarEstado(false)
      }
    });
  }

  function actualizarEDDProyecto(response) {
    listEDDProyecto.push(response);
  }

  useEffect(
    function () {
      obtenerServicio();
      obtenerTipoProyecto();
    },
    [isActiveFormularioPresupuesto]
  );

  const formatCurrency = (value) => {
    // Remover caracteres que no sean dígitos o el signo negativo
    const number = parseInt(value.replace(/[^\d-]/g, ""), 10);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handlePresupuestoTotalChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, ""); // Remover caracteres no numéricos
    setPresupuestoTotal({
      value: numericValue,
      formatted: formatCurrency(value),
    });
  };

  // ----------------------RENDER----------------------------
  return (
    <>
      {isActiveFormularioPresupuesto ? (
        <EditarPresupuestosMensuales
          isActiveFormulario={isActiveFormularioPresupuesto}
          cambiarEstado={setisActiveFormularioPresupuesto}
          resumenProyectos={datosResumen}
        ></EditarPresupuestosMensuales>
      ) : null}

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelEDDProyecto">Proyecto:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre del proyecto"
                type="text"
                className="form-control"
                name="input_nombreDelEDDProyecto"
                id="input_nombreDelEDDProyecto"
                maxLength="100"
                onChange={({ target }) => setnomProyecto(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_fechaI">Fecha inicio:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha inicio"
                type="date"
                className="form-control"
                name="input_fechaI"
                id="input_fechaI"
                onChange={({ target }) => setfechaIni(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_fechaF">Fecha Fin:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Fecha fin"
                type="date"
                className="form-control"
                name="input_fechaF"
                id="input_fechaF"
                onChange={({ target }) => setfechaFin(target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="input_tipoProyecto">Tipo de proyecto: </label>
              <select
                required
                className="form-control"
                name="input_tipoProyecto"
                id="input_tipoProyecto"
                placeholder="Seleccione el Tipo de proyecto"
                onChange={({ target }) => setTipoProyecto(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listTipoProyectos.map((valor) => (
                  <option value={valor.subTipoConfDato}>
                    {valor.subTipoConfDato}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_serv">Servicio del cliente: </label>
              <select
                required
                className="form-control"
                name="input_serv"
                id="input_serv"
                placeholder="Seleccione el servicio"
                onChange={({ target }) => setidServicio(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listServicio.map((valor) => (
                  <option value={valor.idServicio}>{valor.nomServicio}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_presupuestoTotal">Presupuesto total:</label>
              <input
                placeholder="Escriba presupuesto total del proyecto"
                type="text"
                className="form-control"
                name="input_presupuestoTotal"
                id="input_presupuestoTotal"
                value={presupuestoTotal.formatted}
                onChange={handlePresupuestoTotalChange}
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
};
export default InsertarEDDProyecto;
