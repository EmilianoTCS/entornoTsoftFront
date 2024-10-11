import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import Header from "../../../templates/Header/Header";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import ExportPDF from "../../../templates/exports/exportPDF";
import { Button } from "react-bootstrap";
import ResumenGeneralCursos from "./ResumenGeneralCursos";

export default function InicioDashboardAF() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [ListEstadoCurso, setListEstadoCurso] = useState();
  const [ListDatosCursos, setListDatosCursos] = useState();
  const [fechaIni, setFechaini] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoCurso, setEstadoCurso] = useState("ACTIVO");
  const [isActiveResumenGralCursos, setIsActiveResumenGralCursos] =
    useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const now = new Date();
  const nomDocPDF = "Dashboard_AF_";

  const [colores, setColores] = useState({
    aprobados: "",
    desaprobados: "",
    aprobGral: "",
    coloresGral: "",
  });

  const componenteRef = useRef(null); // Ref para el componente

  useEffect(() => {
    if (isActiveResumenGralCursos) {
      componenteRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isActiveResumenGralCursos]);

  const obtenerConfigColorAF = () => {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "AF",
      subTipoConfDato: "",
    };
    SendDataService(url, operationUrl, data).then((response) => {      
      const aprobados = response.filter(
        (item) =>
          item.datoNoVisible === "aprobados" &&
          item.subTipoConfDato === "COLOR_DASHBOARD"
      );
      const desaprobados = response.filter(
        (item) =>
          item.datoNoVisible === "desaprobados" &&
          item.subTipoConfDato === "COLOR_DASHBOARD"
      );
      const aprobGral = response.filter(
        (item) =>
          item.datoNoVisible === "porc_aprob_general" &&
          item.subTipoConfDato === "COLOR_DASHBOARD"
      );
      const coloresGral = response
        .filter((item) => item.subTipoConfDato === "RANCO_COLOR_CURSOS")
        .sort((a, b) => a.orden - b.orden);

        
      setColores({
        aprobados: aprobados,
        desaprobados: desaprobados,
        aprobGral: aprobGral,
        coloresGral: coloresGral,
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

  function getDataConfig() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "AF",
      subTipoConfDato: "ESTADO_CURSO",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setListEstadoCurso(response);
    });
  }

  const obtenerDatosProyectos = (e) => {
    e.preventDefault();
    // setIsActiveResumenGralProy(false);
    const errores = validaciones();
    if (!errores) {
      var url = "pages/listados/AF_listado_resumenGralCurso.php";
      var operationUrl = "AF_listado_resumenGralCurso";
      const data = {
        fechaInicio: fechaIni,
        fechaFin: fechaFin,
        estadoCurso: estadoCurso,
      };

      SendDataService(url, operationUrl, data).then((response) => {
        if (response.length === 0) {
          TopAlertsError(
            "01",
            "No se han encontrado cursos con estos parámetros"
          );
        } else {
          //   console.log(response);

          setListDatosCursos(response);
          setIsActiveResumenGralCursos(true);

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
        }
      });
    }
  };

  useEffect(() => {
    getDataConfig();
    obtenerConfigColorAF();
    obtenerDatosProyectos({ preventDefault: () => {} });

    // Agrega un listener de scroll para mostrar u ocultar el botón
    window.addEventListener("scroll", toggleScrollButton);
    return () => {
      window.removeEventListener("scroll", toggleScrollButton);
    };
  }, []);

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
          width: "700px",
          textAlign: "center",
          marginTop: "20px",
          borderRadius: "15px",
          padding: "20px",
        }}
      >
        <form onSubmit={obtenerDatosProyectos}>
          <h3>Generador Dashboard Academia de Formación</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: "20px",
            }}
          >
            <div style={{ textAlign: "left" }}>
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
            <div style={{ textAlign: "left" }}>
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
            <div style={{ textAlign: "left" }}>
              <label htmlFor="input_estadoProyecto">Estado de curso</label>
              <select
                name="slct_estadoCurso"
                id="slct_estadoCurso"
                className="form-control"
                required
                value={estadoCurso || ""}
                onChange={({ target }) => {
                  setEstadoCurso(target.value);
                }}
              >
                {" "}
                <option hidden value="">
                  Desplegar lista
                </option>
                {ListEstadoCurso &&
                  ListEstadoCurso.map((item) => (
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
      <br></br>

      <div ref={componenteRef}>
        {isActiveResumenGralCursos && (
          <ResumenGeneralCursos
            datosCursos={ListDatosCursos}
            paramsFechaFin={fechaFin}
            paramsFechaIni={fechaIni}
            colores={colores}
            estadoCurso={estadoCurso}
          ></ResumenGeneralCursos>
        )}
      </div>

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
