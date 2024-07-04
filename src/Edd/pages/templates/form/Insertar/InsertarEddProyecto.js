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
  const [presupuestoTotal, setPresupuestoTotal] = useState({
    formatted: "",
    parsed: "",
    input: "",
  });

  const [idServicio, setidServicio] = useState("");

  const [listServicio, setlistServicio] = useState([""]);
  const [listTipoProyectos, setlistTipoProyectos] = useState([""]);
  const [datosResumen, setDatosResumen] = useState([""]);
  const [isActiveFormularioPresupuesto, setisActiveFormularioPresupuesto] =
    useState(false);
  const [valorUSD, setValorUSD] = useState({
    formatted: "",
    parsed: "",
    input: "",
  });

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
      presupuestoTotal: presupuestoTotal.parsed, // Enviar el valor sin formatear
      valorUSD: valorUSD.parsed, // Enviar el valor sin formatear
      isActive: true,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
      TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
      actualizarEDDProyecto(datos);
      if (datos.idresumenperproy && !isActiveFormularioPresupuesto) {
        console.log("response", response);
        setisActiveFormularioPresupuesto(true);
        setDatosResumen(response);
        cambiarEstado(false);
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

  const handleChangeValorUSD = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^\d,.]/g, "").replace(",", ".");
    const number = parseFloat(cleanedValue);

    const formattedValue = formatCurrency(number);
    const parsedValue = isNaN(number) ? "" : number;

    setValorUSD((prev) => ({
      ...prev,
      input: value,
      formatted: formattedValue,
      parsed: parsedValue,
    }));
  };

  // Formato de moneda
  const formatCurrency = (value) => {
    if (isNaN(value)) return "";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handlePresupuestoTotalChange = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^\d,.]/g, "").replace(",", ".");
    const number = parseFloat(cleanedValue);

    const formattedValue = formatCurrency(number);
    const parsedValue = isNaN(number) ? "" : number;

    setPresupuestoTotal((prev) => ({
      ...prev,
      input: value,
      formatted: formattedValue,
      parsed: parsedValue,
    }));
    console.log(presupuestoTotal);
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
              <label htmlFor="input_presupuestoTotal">Valor USD ($CLP):</label>
              <input
                placeholder="Escriba presupuesto total del proyecto"
                type="text"
                className="form-control"
                name="input_presupuestoTotal"
                id="input_presupuestoTotal"
                value={valorUSD.input || ""}
                onChange={handleChangeValorUSD}
                required
                maxLength={30}
              />
              {/* <p>Formatted: {valorUSD.formatted}</p>
              <p>Parsed: {valorUSD.parsed}</p> */}
            </div>
            <div>
              <label htmlFor="input_presupuestoTotal">
                Presupuesto total en USD:
              </label>
              <input
                placeholder="Escriba presupuesto total del proyecto"
                type="text"
                className="form-control"
                name="input_presupuestoTotal"
                id="input_presupuestoTotal"
                value={presupuestoTotal.input}
                onChange={handlePresupuestoTotalChange}
                required
              />
              <label>
                (Valor en pesos: {formatCurrency(presupuestoTotal.parsed * valorUSD.parsed)})
              </label>
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
