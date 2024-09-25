import React, { useState, useEffect } from "react";
import SendDataService from "../../../services/SendDataService";
import { Navigate } from "react-router-dom";
import Header from "../../../templates/Header/Header";
import { Button } from "react-bootstrap";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import EstadoGeneralProy from "./EstadoGeneralProy";
import ExportPDF from "../../../templates/exports/exportPDF";
export default function InicioDashboardIHH() {
  const [ListTipoImpugnacion, setListTipoImpugnacion] = useState();
  const [ListEstadoProyecto, setListEstadoProyecto] = useState();
  const [fechaIni, setFechaini] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipoImp, setTipoImp] = useState("OPERATIVO");
  const [estadoProyecto, setEstadoProyecto] = useState("ACTIVO");
  const now = new Date();
  const nomDocPDF = "Dashboard_IHH_";
  const [datosResumenGralProy, setDatosResumenGralProy] = useState([]);
  const [isActiveResumenGralProy, setIsActiveResumenGralProy] = useState(false);

  const [colores, setColores] = useState({
    ppto: "",
    costo: "",
    saldo: "",
  });

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const obtenerConfigIHH = () => {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "IHH",
      subTipoConfDato: "",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const tipoImp = response.filter(
        (item) => item.subTipoConfDato === "TIPO_IMPUGNACION"
      );
      const estadoProyecto = response.filter(
        (item) => item.subTipoConfDato === "ESTADO_PROYECTO"
      );
      setListTipoImpugnacion(tipoImp);
      setListEstadoProyecto(estadoProyecto);
    });
  };

  const obtenerConfigColorIHH = () => {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "IHH",
      subTipoConfDato: "COLOR_DASHBOARD",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const ppto = response.filter((item) => item.datoNoVisible === "PPTO");
      const costo = response.filter((item) => item.datoNoVisible === "COSTO");
      const saldo = response.filter((item) => item.datoNoVisible === "SALDO");

      setColores({
        ppto: ppto,
        costo: costo,
        saldo: saldo,
      });
    });
  };

  function validaciones() {
    if (fechaIni > fechaFin) {
      TopAlertsError(
        "01",
        "La fecha de inicio no puede ser mayor a la de término"
      );
      return true;
    } else {
      return false;
    }
  }

  const obtenerDatosProyectos = (e) => {
    e.preventDefault();

    const errores = validaciones();
    if (!errores) {
      var url = "pages/listados/ihh_listado_resumenGralProy.php";
      var operationUrl = "ihh_listadoResumenGralProy";
      const data = {
        fechaInicio: fechaIni,
        fechaFin: fechaFin,
        tipoImpugnacion: tipoImp,
        estadoProyecto: estadoProyecto,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        if (response.length === 0) {
          TopAlertsError(
            "01",
            "No se han encontrado proyectos con estos parámetros"
          );
        } else {
          // Establecer el conjunto de datos para proyectos
          setDatosResumenGralProy(response);
          setIsActiveResumenGralProy(true);

          // Encontrar la fecha de inicio más antigua del conjunto de datos
          const fechasInicio = response.map((item) => item.fechaInicio);
          const fechaMasAntigua = fechasInicio.sort(
            (a, b) =>
              new Date(a.split("-").reverse().join("-")) -
              new Date(b.split("-").reverse().join("-"))
          )[0];
          setFechaini(fechaMasAntigua.split("-").reverse().join("-"));

          // Obtener la fecha actual
          const fechaHoy = new Date().toISOString().split("T")[0];
          setFechaFin(fechaHoy);
        }
      });
    }
  };

  useEffect(() => {
    obtenerConfigIHH();
    obtenerConfigColorIHH();
    obtenerDatosProyectos({ preventDefault: () => {} });
  }, []);

  return userData.statusConected || userData !== null ? (
    <>
      <Header />

      <section
        style={{
          backgroundColor: "white",
          margin: "auto",
          width: "800px",
          textAlign: "center",
          marginTop: "20px",
          borderRadius: "15px",
          padding: "20px",
        }}
      >
        <form onSubmit={obtenerDatosProyectos}>
          <h3>Generador Dashboard Impugnación de Horas</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: "20px",
            }}
          >
            <div>
              <label htmlFor="input_fechaInicio">Fecha inicio</label>
              <input
                name="input_fechaInicio"
                id="input_fechaInicio"
                type="date"
                className="form-control"
                required
                onChange={({ target }) => {
                  setFechaini(target.value);
                }}
                value={fechaIni || ""}
              />
            </div>
            <div>
              <label htmlFor="input_fechaFin">Fecha fin</label>
              <input
                name="input_fechaFin"
                id="input_fechaFin"
                type="date"
                className="form-control"
                value={fechaFin || ""}
                required
                onChange={({ target }) => {
                  setFechaFin(target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="input_tipoImpugnacion">Tipo de impugnación</label>
              <select
                name="slct_tipoImpugnacion"
                id="slct_tipoImpugnacion"
                className="form-control"
                required
                value={tipoImp || ""}
                onChange={({ target }) => {
                  setTipoImp(target.value);
                }}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {ListTipoImpugnacion &&
                  ListTipoImpugnacion.map((item) => (
                    <option key={item.datoVisible} value={item.datoVisible}>
                      {item.datoVisible}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_estadoProyecto">Estado de proyecto</label>
              <select
                name="slct_estadoProyecto"
                id="slct_estadoProyecto"
                className="form-control"
                required
                value={estadoProyecto || ""}
                onChange={({ target }) => {
                  setEstadoProyecto(target.value);
                }}
              >
                {" "}
                <option hidden value="">
                  Desplegar lista
                </option>
                {ListEstadoProyecto &&
                  ListEstadoProyecto.map((item) => (
                    <option key={item.datoVisible} value={item.datoVisible}>
                      {item.datoVisible}
                    </option>
                  ))}
              </select>
            </div>
            <Button id="btn_registrar" type="submit">
              Buscar
            </Button>
          </div>
        </form>
      </section>
      <br />
      {isActiveResumenGralProy && datosResumenGralProy && (
        <EstadoGeneralProy
          datosProyectos={datosResumenGralProy}
          paramsFechaFin={fechaFin}
          paramsFechaIni={fechaIni}
          tipoImpugnacion={tipoImp}
          estadoProyecto={estadoProyecto}
          colores={colores}
        ></EstadoGeneralProy>
      )}
      <div style={{ float: "right", width: "280px", margin: "10px auto" }}>
        <ExportPDF
          nombreTabla={
            nomDocPDF +
            now
              .toISOString()
              .replace(/[^0-9]/g, "")
              .slice(0, -3)
          }
        />
      </div>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
