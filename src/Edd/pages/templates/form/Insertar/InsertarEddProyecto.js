import React, { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import Select from "react-select";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditarPresupuestosMensuales from "../Editar/EditarPresupuestosMensuales";
import TopAlertsError from "../../../../../templates/alerts/TopAlerts";
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
  const [idServicio, setidServicio] = useState("");

  const [listServicio, setlistServicio] = useState([""]);
  const [listTipoProyectos, setlistTipoProyectos] = useState([""]);
  const [datosResumen, setDatosResumen] = useState([""]);
  const [isActiveFormularioPresupuesto, setisActiveFormularioPresupuesto] =
    useState(false);

  const [idAcops, setIdsAcops] = useState("");
  const [opcionesAcops, setOpcionesAcop] = useState([]);

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

  const obtenerAcops = () => {
    var url = "pages/listados/ihh_listadoAcop.php";
    var operationUrl = "ihh_listadoAcop";
    var auxOpciones = [];
    var data = {
      num_boton: 1,
      cantidadPorPagina: 9999999999,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      data.datos.map((item) => {
        auxOpciones.push({
          label: item.nomAcop,
          value: item.idAcop,
        });
      });
      setOpcionesAcop(auxOpciones);
    });
  };

  function validaciones() {
    if (nomProyecto.trim() === "") {
      TopAlertsError("01", "El nombre del proyecto no debe estar vacío");
      return true;
    } else if (new Date(fechaIni) > new Date(fechaFin)) {
      TopAlertsError(
        "02",
        "La fecha inicio no puede ser mayor a la fecha término"
      );
      return true;
    } else if (tipoProyecto.trim() === "") {
      TopAlertsError("03", "El tipo de proyecto no debe estar vacío");
      return true;
    } else if (idServicio < 0) {
      TopAlertsError("04", "El servicio del proyecto no puede estar vacío");
      return true;
    } else if (idAcops.trim() === "") {
      TopAlertsError("05", "Debes seleccionar 1 o más ACOPS");
      return true;
    } else {
      return false;
    }
  }

  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarEddProyecto.php";
      const operationUrl = "insertarEddProyecto";
      var data = {
        usuarioCreacion: userData.usuario,
        nomProyecto: nomProyecto,
        fechaIni: fechaIni,
        fechaFin: fechaFin,
        tipoProyecto: tipoProyecto,
        idServicio: idServicio,
        idAcops: idAcops,
        isActive: true,
      };
      // console.log(data);
      SendDataService(url, operationUrl, data).then((response) => {
        console.log(response);
        const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
        EDDProyecto.unshift(response[0]);
        cambiarEstado(false);
      });
    }
  }

  const handleSelect = (selected) => {
    let auxString = "";
    if (selected && selected.length > 0) {
      selected.forEach((item) => {
        if (auxString === "") {
          auxString = item.value;
        } else {
          auxString = auxString + "," + item.value;
        }
      });
      setIdsAcops(auxString);
    } else {
      auxString = "";
      setIdsAcops("");
    }
  };

  useEffect(
    function () {
      obtenerServicio();
      obtenerTipoProyecto();
      obtenerAcops();
    },
    [isActiveFormularioPresupuesto]
  );
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

            <div className="form-group">
              <label htmlFor="input_serv">Selecciona uno o más ACOPS: </label>
              <Select
                closeMenuOnSelect={false}
                className="form-control"
                isMulti
                placeholder="Desplegar listado"
                options={opcionesAcops}
                onChange={handleSelect}
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
