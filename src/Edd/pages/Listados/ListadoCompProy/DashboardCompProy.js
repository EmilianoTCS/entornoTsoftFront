import React, { useState, useEffect } from "react";

import { Navigate } from "react-router-dom";
import { useRoute } from "wouter";
import "../TablasStyles.css";
import "../ListadoCompProy/CompProy.css";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";

import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import ExportPDF from "../../../../templates/exports/exportPDF";
import "../BtnInsertar.css";

import ProgressBar from "react-bootstrap/ProgressBar";

// GRAFICO LINEAS
import { Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import ExtraGraph from "./ExtraGraph";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardCompProy() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [, params] = useRoute(
    "/DashboardCompProy/:selectedClients/:selectedServicio/:selectedProyecto/:tipoComparacion/:tipoCargo/:fechaIni/:fechaFin/:cicloEvaluacion"
  );

  const idCliente = params.selectedClients;
  const idServicio = params.selectedServicio;
  const idProyecto = params.selectedProyecto;
  const tipoComparacion = decodeURIComponent(params.tipoComparacion);
  const tipoCargo = params.tipoCargo;
  const fechaIni = params.fechaIni;
  const fechaFin = params.fechaFin;
  const cicloEvaluacion = params.cicloEvaluacion;
  const [loadedDataColor, setLoadedDataColor] = useState(false);
  const [datosLinks, setDatosLinks] = useState("");
  const [DashCompProy, setDashCompProy] = useState([""]);
  const [listConfigCompColorFlechas, setListConfigCompColorFlechas] =
    useState("");
  const nombreTabla = "dashCompProy";
  const [nombrePDF, setNombrePDF] = useState("");
  var date = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);

  const [activeGraph, setActiveGraph] = useState(null);

  const [paramsExtraGraph, setParams] = useState({
    idEDDEvaluacion: "",
    nomEvaluacion: "",
    idEDDProyecto: "",
    cicloEvaluacion: "",
  });
  //---------------------- CONFIGS ----------------------

  function GetConfigCompColorFlechas() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "competencia",
      subTipoConfDato: "RANGO_COLOR",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigCompColorFlechas(data);
      setLoadedDataColor(true);
    });
  }

  function GetDataLinks() {
    var url = "pages/auxiliares/listadoLinksEvaluacionDashboard.php";
    var operationUrl = "listadoLinksEvaluacionDashboard";
    var data = {
      idProyecto: params.selectedProyecto,
      cargoEnProy: params.tipoCargo,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setDatosLinks(data);
    });
  }

  function SendData() {
    var url = "pages/listados/listadoCompetenciasGeneralEval.php";
    var operationUrl = "listadoCompetenciasGeneralEval";

    const data = {
      idCliente: idCliente,
      idServicio: idServicio,
      idProyecto: idProyecto,
      tipoComparacion: tipoComparacion,
      tipoCargo: tipoCargo,
      fechaIni: fechaIni,
      fechaFin: fechaFin,
      cicloEvaluacion: cicloEvaluacion,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setDashCompProy(data);
      // console.log("InformaciónReponse", data);
      setNombrePDF(
        "Dash_comp_proy_" + tipoCargo + "_" + data[0].nomProyecto + "_" + date
      );

      
    });
  }
  useEffect(() => {
    SendData();
    GetConfigCompColorFlechas();
    GetDataLinks();
  }, [activeGraph]);

  //---------------------- GRAFICOS ----------------------

  var predefinedColors = [
    // FUERTE
    // "#B71C1C", // Rojo              1
    // "#303F9F", // Azul              2
    // "#8BC34A", // Verde               3
    "#828282", // GRIS               3
    // "#FDD835", // Amarillo              4
    "#F48FB1", // Rosa              5
    // "#00796B", // Cyan                  6
    // "#8E24AA", // Violeta              7
    // "#EF6C00", // Naranja              8
    "#03A9F4", // Celeste              9
    // "#795548", // Verde agua            10
    "#c24be3", // Verde agua            10

    // CLAROS
    // "#EF9A9A", // Rojo              1
    // "#9FA8DA", // Azul              2
    // "#558B2F", // Verde               3
    // "#FFF59D", // Amarillo              4
    // "#E91E63", // Rosa              5
    // "#80CBC4", // Cyan                   6
    // "#CE93D8", // Violeta              7
    // "#FFB74D", // Naranja              8
    // "#B3E5FC", // Celeste              9
    // "#BCAAA4", // Verde agua            10

    // MEDIOS
    // "#F44336", // Rojo              1
    // "#3F51B5", // Azul              2
    // "#C5E1A5", // Verde               3
    // "#FFF176", // Amarillo              4
    // "#F06292", // Rosa              5
    // "#26A69A", // Cyan                  6
    // "#AB47BC", // Violeta              7
    // "#FF9800", // Naranja              8
    // "#4FC3F7", // Celeste              9
    // "#795548", // Verde agua            10

    // Agrega más colores según sea necesario
  ];

  function BarrasChart() {
    // Calcular el promedio general de los porcentajes
    const promediosGenerales = calcularPromedioCompetencias(DashCompProy);

    // Extraer las fechas de inicio de los datos
    const fechasIni = [];
    for (const ciclo in promediosGenerales) {
      const cicloData = promediosGenerales[ciclo];
      fechasIni.push(...cicloData.fechasIni);
    }

    // Eliminar duplicados y ordenar las fechas de inicio
    const formattedFechasConDatos = [...new Set(fechasIni)].sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    // Datos del promedio general
    const promedioGeneralData = formattedFechasConDatos.map((fecha) => {
      const cicloData = Object.values(promediosGenerales).find((ciclo) =>
        ciclo.fechasIni.has(fecha)
      );
      const promedio = cicloData ? cicloData.promedio : 0;
      return promedio;
    });

    const data = {
      labels: formattedFechasConDatos, // Usar las fechasIni para el eje X
      datasets: [
        {
          label: "Promedio General",
          data: promedioGeneralData,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 3,
        },
        {
          label: "Promedio General",
          data: promedioGeneralData,
          backgroundColor: "rgba(227, 18, 18, 0.2)",
          borderColor: "rgba(227, 18, 18, 0.5)",
          borderWidth: 3,
          type: "line",
        },
      ],
    };

    const options = {
      responsive: true,
      animation: true,
      devicePixelRatio: 4,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
        },
        x: {
          ticks: { color: "black" },
        },
      },
    };

    return <Bar data={data} options={options} />;
  }

  function Info() {
    // Supongo que DashCompProy es un array de objetos que contienen la propiedad "nomCliente"
    const uniqueClientes = new Set();
    const tableRows = DashCompProy.map((item, index) => {
      if (!uniqueClientes.has(item.nomCliente)) {
        uniqueClientes.add(item.nomCliente);
        return (
          <div id="InfoDashCpmpProy">
            <tr>
              <td>
                <h5>
                  <b>Cliente:</b>&nbsp; {item.nomCliente}
                  {/* &nbsp;&nbsp;-&nbsp;&nbsp; */}
                </h5>
              </td>
              <td className="linea">&nbsp;&nbsp;</td>
              <td>
                <h5>
                  &nbsp;&nbsp;<b>Servicio:</b>&nbsp; {item.nomServicio}
                  {/* &nbsp;&nbsp;-&nbsp;&nbsp; */}
                </h5>
              </td>
              <td className="linea">&nbsp;&nbsp;</td>

              <td>
                <h5>
                  &nbsp;&nbsp;<b>Proyecto:</b>&nbsp; {item.nomProyecto}&nbsp;(
                  {item.tipoProyecto})
                </h5>
              </td>
            </tr>
          </div>
        );
      }
      return null; // No se agregará a la tabla si es un valor duplicado
    });

    return <>{tableRows}</>;
  }


  function LineChartInvertido() {
    const ciclosConDatos = [
      ...new Set(DashCompProy.map((item) => item.cicloEvaluacion)),
    ];
    const competencias = [
      ...new Set(DashCompProy.map((item) => item.nomCompetencia)),
    ];

    const datasets = ciclosConDatos.map((ciclo, index) => {
      const data = competencias.map((competencia) => {
        let totalCompetenciasOK = 0;
        let totalCompetencias = 0;

        DashCompProy.forEach((item) => {
          if (
            item.cicloEvaluacion === ciclo &&
            item.nomCompetencia === competencia
          ) {
            totalCompetenciasOK += parseInt(item.cantRespOK);
            totalCompetencias += parseInt(item.cantResp);
          }
        });

        const porcentaje =
          totalCompetencias === 0
            ? 0
            : (totalCompetenciasOK * 100) / totalCompetencias;

        return porcentaje.toFixed(2);
      });

      return {
        // type: "line",
        label: `Ciclo ${ciclo}`,
        data: data,
        backgroundColor: predefinedColors[index % predefinedColors.length],
        borderColor: predefinedColors[index % predefinedColors.length],
        pointRadius: 3,
        pointBorderColor: predefinedColors[index % predefinedColors.length],
        pointBackgroundColor: predefinedColors[index % predefinedColors.length],
      };
    });

    const data = {
      labels: competencias,
      datasets: datasets,
    };

    const options = {
      responsive: true,
      animation: true,
      devicePixelRatio: 4,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
        },
        x: {
          ticks: { color: "black" },
        },
      },
    };

    return <Bar data={data} options={options} />;
  }

  function calcularPromedioCompetencias(datos) {
    // Agrupar los datos por ciclo
    const ciclos = {};
    datos.forEach((item) => {
      if (!ciclos[item.cicloEvaluacion]) {
        ciclos[item.cicloEvaluacion] = [];
      }
      ciclos[item.cicloEvaluacion].push(item);
    });

    // Calcular el promedio de todas las competencias por ciclo
    const promediosPorCiclo = {};
    for (const ciclo in ciclos) {
      const competenciasPorCiclo = ciclos[ciclo];
      var totalCompetencias = 0;
      var totalCompetenciasOK = 0;

      const fechasIni = []; // Array para almacenar las fechasIni

      competenciasPorCiclo.forEach((competencia) => {
        totalCompetencias += parseInt(competencia.cantResp);
        totalCompetenciasOK += parseInt(competencia.cantRespOK);

        // Agregar la fechaIni al array
        fechasIni.push(competencia.epeFechaIni);
      });

      const promedioPorCiclo = (totalCompetenciasOK * 100) / totalCompetencias;
      promediosPorCiclo[ciclo] = {
        promedio: promedioPorCiclo.toFixed(2),
        fechasIni: new Set(fechasIni), // Incluir las fechasIni
      };
    }

    return promediosPorCiclo;
  }

  function calcularDiferencias(promedios) {
    const diferencias = {};

    const ciclos = Object.keys(promedios);
    for (let i = 1; i < ciclos.length; i++) {
      const cicloActual = ciclos[i];
      const cicloAnterior = ciclos[i - 1];

      const promedioActual = parseFloat(promedios[cicloActual].promedio);
      const promedioAnterior = parseFloat(promedios[cicloAnterior].promedio);

      const diferencia = (promedioActual - promedioAnterior).toFixed(2);

      diferencias[cicloActual] = {
        diferencia: diferencia,
        fechasIni: promedios[cicloActual].fechasIni, // Incluir las fechasIni
      };
    }

    return diferencias;
  }

  function PromedioCompetenciasTabla({ datos }) {
    const promediosPorCiclo = calcularPromedioCompetencias(datos);
    const diferencias = calcularDiferencias(promediosPorCiclo);
    var arrayReturn = [];

    Object.entries(promediosPorCiclo).map(([ciclo, promedio], index) => {
      Object.entries(datosLinks).map(([item, data]) => {
        if (data.cargoEnProy === tipoCargo && data.cicloEvaluacion === ciclo) {
          arrayReturn.push(
            <div key={index} style={{ marginTop: "10px" }}>
              <div className="ciclo">
                <b>
                  Ciclo: {ciclo} - {promedio.fechasIni}
                </b>
                &nbsp;
                {diferencias[ciclo] !== undefined && (
                  <span
                    className={`diferencia ${
                      diferencias[ciclo].diferencia > 0 ? "mejora" : "empeora"
                    }`}
                  >
                    {diferencias[ciclo].diferencia}%
                    {diferencias[ciclo].diferencia > 0 ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    )}
                  </span>
                )}
              </div>
              <ProgressBar
                now={promedio.promedio}
                label={`${promedio.promedio}%`}
                style={{
                  width: "350px",
                  height: "23px",
                  fontSize: "10pt",
                  verticalAlign: "middle",
                  fontWeight: "600",
                }}
              />
              <button
                className="btnRedirect"
                onClick={() => {
                  ActiveExtraGraph(
                    data.idEDDEvaluacion,
                    data.nomEvaluacion,
                    data.idProyecto,
                    data.cicloEvaluacion
                  );
                }}
              >
                Más información
              </button>
            </div>
          );
        }
      });
    });

    return (
      <div
        className="progress-bars"
        style={{ textAlign: "left", width: "400px" }}
      >
        <h5>
          <b>Promedio general de competencias por ciclo</b>
        </h5>
        {arrayReturn}
      </div>
    );
  }

  //---------------------- MAS INFO ----------------------

  const ActiveExtraGraph = (
    idEDDEvaluacion,
    nomEvaluacion,
    idProyecto,
    cicloEvaluacion
  ) => {
    setActiveGraph(true);

    setParams({
      idEDDEvaluacion: idEDDEvaluacion,
      nomEvaluacion: nomEvaluacion,
      idEDDProyecto: idProyecto,
      cicloEvaluacion: cicloEvaluacion,
    });

    
  };

  //---------------------- MAIN RENDER ----------------------

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <h2
        style={{
          background: "white",
          width: "1000px",
          textAlign: "center",
          margin: "auto auto",
          borderRadius: "0.5em",
          padding: "5px",
        }}
      >
        Dashboard Comparación ciclos de proyectos - {tipoCargo}
      </h2>
      <table style={{ margin: "auto" }}>
        <br></br>
        <tr>
          <br></br>
          <td>
            <div
              className="bg-light mx-auto px-2 border}}"
              style={{ width: "800px", height: "400px" }}
            >
              {BarrasChart()}
            </div>
            <br></br>
            {Info()}

            <table id="fondoTablaDashCompProy">
              {/* <tr>{countCompetenciasPorCiclo()}</tr> */}
              <tr>
                <PromedioCompetenciasTabla datos={DashCompProy} />
              </tr>
              <tr>
                <div
                  style={{
                    width: "530px",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <h5
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <b>Tendencia '% de aprobación' de ciclos por competencia</b>
                  </h5>
                  {LineChartInvertido()}
                </div>
              </tr>
            </table>
            <div
              style={{
                backgroundColor: "white",
                marginTop: "10px",
                borderRadius: "0 0 30px 30px",
                marginBottom: "10px",
                alignContent: "center",
                justifyContent: "center",
              }}
              className="beforeBreakGraph"
            >
              {activeGraph ? (
                <ExtraGraph
                  idEDDEvaluacion={paramsExtraGraph.idEDDEvaluacion}
                  nomEvaluacion={paramsExtraGraph.nomEvaluacion}
                  idEDDProyecto={paramsExtraGraph.idEDDProyecto}
                  cicloEvaluacion={paramsExtraGraph.cicloEvaluacion}
                  setActiveGraph={setActiveGraph}
                  activeGraph={activeGraph}
                />
              ) : (
                <></>
              )}
            </div>
            <ExportPDF nombreTabla={nombrePDF} />
          </td>
        </tr>
      </table>

      <br></br>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
