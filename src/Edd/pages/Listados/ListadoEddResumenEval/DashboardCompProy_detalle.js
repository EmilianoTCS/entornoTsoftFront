import React, { useState, useEffect } from "react";

import "../TablasStyles.css";
import "../ListadoCompProy/CompProy.css";
import SendDataService from "../../../../services/SendDataService";

import { FaArrowUp, FaArrowDown } from "react-icons/fa";

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
import ExtraGraph from "../ListadoCompProy/ExtraGraph";

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

export default function DashboardCompProy_detalle({
  idCliente,
  idServicio,
  idProyecto,
  tipoComparacion,
  tipoCargo,
  fechaIni,
  fechaFin,
  cicloEvaluacion,
}) {
  const [loadedDataColor, setLoadedDataColor] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [datosLinks, setDatosLinks] = useState("");
  const [DashCompProy, setDashCompProy] = useState([""]);
  const [listConfigCompColorFlechas, setListConfigCompColorFlechas] =
    useState("");
  const nombreTabla = "dashCompProy";

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
      idProyecto: idProyecto,
      cargoEnProy: tipoCargo,
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
    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      setDashCompProy(data);
      console.log("InformaciónReponse", data);
    });
  }
  useEffect(() => {
    if (tipoComparacion === "AÑO") {
      setActiveGraph(false);
    }
    SendData();
    GetConfigCompColorFlechas();
    GetDataLinks();
  }, [activeGraph, idProyecto, idCliente, idServicio, tipoComparacion]);

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

    return (
      <>
        {tableRows}
        <div id="InfoDashCpmpProy">
          <h6>
            (Desde {formatDate(fechaIni)} hasta {formatDate(fechaFin)})
          </h6>
        </div>
      </>
    );
  }

  function LineChartInvertido() {
    if (tipoComparacion === "AÑO") {
      const aniosConDatos = [
        ...new Set(
          DashCompProy.map((item) => new Date(item.epeFechaIni).getFullYear())
        ),
      ];
      const competencias = [
        ...new Set(DashCompProy.map((item) => item.nomCompetencia)),
      ];

      const datasets = aniosConDatos.map((anio, index) => {
        const data = competencias.map((competencia) => {
          let totalCompetenciasOK = 0;
          let totalCompetencias = 0;

          DashCompProy.forEach((item) => {
            if (
              new Date(item.epeFechaIni).getFullYear() === anio &&
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
          label: `Año ${anio}`,
          data: data,
          backgroundColor: predefinedColors[index % predefinedColors.length],
          borderColor: predefinedColors[index % predefinedColors.length],
          pointRadius: 3,
          pointBorderColor: predefinedColors[index % predefinedColors.length],
          pointBackgroundColor:
            predefinedColors[index % predefinedColors.length],
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
    } else {
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
          pointBackgroundColor:
            predefinedColors[index % predefinedColors.length],
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
    var arrayReturn = [];

    if (tipoComparacion === "AÑO") {
      const fechasIni = [];
      for (const ciclo in promediosPorCiclo) {
        const cicloData = promediosPorCiclo[ciclo];
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
        const cicloData = Object.values(promediosPorCiclo).find((ciclo) =>
          ciclo.fechasIni.has(fecha)
        );
        const promedio = cicloData
          ? { promedio: cicloData.promedio, fecha: cicloData.fechasIni }
          : 0;
        return promedio;
      });

      if (promedioGeneralData) {
        const diferencias = calcularDiferencias(promedioGeneralData);

        promedioGeneralData.map((item, index) => {
          arrayReturn.push(
            <div key={index} style={{ marginTop: "10px" }}>
              <div className="ciclo">
                <b>
                  Año: {item.fecha} - {item.promedio}%
                </b>
                &nbsp;
                {diferencias[index] !== undefined && (
                  <span
                    className={`diferencia ${
                      diferencias[index].diferencia > 0 ? "mejora" : "empeora"
                    }`}
                  >
                    {diferencias[index].diferencia}%
                    {diferencias[index].diferencia > 0 ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    )}
                  </span>
                )}
              </div>
              <ProgressBar
                now={item.promedio}
                label={`${item.promedio}%`}
                style={{
                  width: "350px",
                  height: "23px",
                  fontSize: "10pt",
                  verticalAlign: "middle",
                  fontWeight: "600",
                }}
              />
            </div>
          );
        });
      }
    } else {
      const diferencias = calcularDiferencias(promediosPorCiclo);
      Object.entries(promediosPorCiclo).map(([ciclo, promedio], index) => {
        Object.entries(datosLinks).map(([item, data]) => {
          if (
            data.cargoEnProy === tipoCargo &&
            data.cicloEvaluacion === ciclo
          ) {
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
    }

    return (
      <div
        className="progress-bars"
        style={{ textAlign: "left", width: "450px" }}
      >
        {tipoComparacion === "AÑO" ? (
          <h5>
            <b>Promedio general de competencias por año</b>
          </h5>
        ) : (
          <h5>
            <b>Promedio general de competencias por ciclo</b>
          </h5>
        )}
        {arrayReturn}
        &nbsp;
        {tipoComparacion === "AÑO" ? (
          <h5 style={{ fontSize: "12px", color: "gray" }}>
            (Para poder examinar un ciclo en detalle, utilice el tipo de
            comparación mensual)
          </h5>
        ) : null}
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

  const formatDate = (date) => {
    const [anio, mes, dia] = date.split("-");
    const fechaObj = new Date(anio, mes - 1, dia);

    // Obtener día, mes y año
    const nuevoDia = fechaObj.getDate().toString().padStart(2, "0");
    const nuevoMes = (fechaObj.getMonth() + 1).toString().padStart(2, "0"); // Sumamos 1 al mes
    const nuevoAnio = fechaObj.getFullYear();

    // Crear la nueva fecha en formato "dd-mm-yyyy"
    const nuevaFecha = `${nuevoDia}-${nuevoMes}-${nuevoAnio}`;

    return nuevaFecha;
  };

  //---------------------- MAIN RENDER ----------------------

  return (
    <>
      <table style={{ margin: "auto" }}>
        <br></br>
        <tr>
          <br></br>
          <td>
            <div
              className="bg-light mx-auto px-2 border}}"
              style={{ width: "800px", textAlign: "center" }}
            >
              <h5>
                Comparación: {tipoComparacion === "MES" ? "MENSUAL" : "ANUAL"}
              </h5>
              <h6>
                (Desde {formatDate(fechaIni)} hasta {formatDate(fechaFin)})
              </h6>
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
                  {tipoComparacion === "AÑO" ? (
                    <h5
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <b>Tendencia '% de aprobación' por competencia en años</b>
                    </h5>
                  ) : (
                    <h5
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <b>
                        Tendencia '% de aprobación' de ciclos por competencia
                      </b>
                    </h5>
                  )}

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
          </td>
        </tr>
      </table>

      <br></br>
    </>
  );
}
