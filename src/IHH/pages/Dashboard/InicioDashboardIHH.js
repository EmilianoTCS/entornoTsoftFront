import React, { useState, useEffect, useRef } from "react";
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [preCarga, setPreCarga] = useState(false); // booleano que permite detectar cuando se realiza una búsqueda por primera vez

  const [colores, setColores] = useState({
    ppto: "",
    ppto_acu: "",
    costo: "",
    saldo: "",
  });

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const componenteRef = useRef(null); // Ref para el componente

  useEffect(() => {
    if (isActiveResumenGralProy) {
      componenteRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isActiveResumenGralProy]);

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
      const ppto_acu = response.filter(
        (item) => item.datoNoVisible === "PPTO_ACU"
      );
      const costo = response.filter((item) => item.datoNoVisible === "COSTO");
      const saldo = response.filter((item) => item.datoNoVisible === "SALDO");

      setColores({
        ppto: ppto,
        ppto_acu: ppto_acu,
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
    setIsActiveResumenGralProy(false);
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
          setDatosResumenGralProy(response);
          setIsActiveResumenGralProy(true);

          if (fechaIni === "" && fechaFin === "") {
            // Obtener el primer día del mes actual
            const fechaHoy = new Date();
            const primerDiaMes = new Date(
              fechaHoy.getFullYear(),
              fechaHoy.getMonth(),
              1
            )
              .toISOString()
              .split("T")[0];

            setFechaini(primerDiaMes);

            // Obtener la fecha actual
            const fechaActual = fechaHoy.toISOString().split("T")[0];
            setFechaFin(fechaActual);
          }
          setPreCarga(true);
        }
      });
    }
  };

  useEffect(() => {
    if (preCarga) {
      setIsActiveResumenGralProy(false);
    }
  }, [fechaIni, fechaFin, tipoImp, estadoProyecto, preCarga]);

  useEffect(() => {
    obtenerConfigIHH();
    obtenerConfigColorIHH();
    obtenerDatosProyectos({ preventDefault: () => {} });

    // Agrega un listener de scroll para mostrar u ocultar el botón
    window.addEventListener("scroll", toggleScrollButton);
    return () => {
      window.removeEventListener("scroll", toggleScrollButton);
    };
  }, [preCarga]);

  // Muestra u oculta el botón basado en la posición del usuario en la página
  const toggleScrollButton = () => {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const scrollToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return userData.statusConected || userData !== null ? (
    <>
      <Header />
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          id="scrollBtn"
          title="Ir arriba"
          data-html2canvas-ignore="true"
          style={{ float: "right" }}
        >
          ↑
        </button>
      )}
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
        <div ref={componenteRef}>
          <EstadoGeneralProy
            datosProyectos={datosResumenGralProy}
            paramsFechaFin={fechaFin}
            paramsFechaIni={fechaIni}
            tipoImpugnacion={tipoImp}
            estadoProyecto={estadoProyecto}
            colores={colores}
          ></EstadoGeneralProy>
        </div>
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
