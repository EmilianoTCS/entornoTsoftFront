import React, { useEffect, useState } from "react";
import Header from "../../../../templates/Header/Header";
import { Navigate, useParams } from "react-router-dom";
import SendDataService from "../../../../services/SendDataService";
import { Doughnut, Bar } from "react-chartjs-2";
import "./DashboardEddResumenEval.css";
import DashboardEddResumenEval_detalle from "./DashboardEddResumenEval_detalle";
import ExportPDF from "../../../../templates/exports/exportPDF";

export default function DashboardEddResumenEval() {
  //Declaración de variables
  const {
    idCliente,
    idServicio,
    idProyecto,
    cicloEvaluacion,
    fechaIni,
    fechaFin,
    tipoCargo,
  } = useParams();

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [listEddResumenEval, setListEddResumenEval] = useState();
  const [loadedDataResumenEval, setLoadedDataResumenEval] = useState(false);
  const [loadedDataColor, setLoadedDataColor] = useState(false);
  const [listConfigCompColor, setListConfigCompColor] = useState("");

  const [loadedDataLeyenda, setLoadedDataLeyenda] = useState(false);
  const [loadedDataRango, setLoadedDataRango] = useState(false);

  const [listConfigCompRangoFlechas, setListConfigCompRangoFlechas] =
    useState("");
  const [listConfigCompRangoLeyenda, setListConfigCompRangoLeyenda] =
    useState("");

  const [activeGraph, setActiveGraph] = useState(null);
  const [paramsExtraGraph, setParams] = useState({
    idCliente: "",
    idServicio: "",
    idProyecto: "",
    cicloEvaluacion: "",
    fechaIni: "",
    fechaFin: "",
    tipoCargo: "",
  });

  const [nombrePDF, setNombrePDF] = useState("");
  var date = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);

  var jsonData = [
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 5,
      nomProyecto: "A - ARG PROY",
      idEDDProyEmp: 30,
      idEDDEvalProyEmp: 103,
      proyFechaIni: "11/2022",
      proyFechaFin: "11/2023",
      estadoProyecto: "Inactivo",
      cantEmpleados: 4,
      cantEvalRespondidas: 0,
      cicloEvaluacion: 1,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 7,
      nomProyecto: "CARMINA",
      idEDDProyEmp: 37,
      idEDDEvalProyEmp: 147,
      proyFechaIni: "05/2022",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 1,
      cantEvalRespondidas: 1,
      cicloEvaluacion: 1,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 7,
      nomProyecto: "CARMINA",
      idEDDProyEmp: 37,
      idEDDEvalProyEmp: 150,
      proyFechaIni: "05/2022",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 1,
      cantEvalRespondidas: 1,
      cicloEvaluacion: 2,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 7,
      nomProyecto: "CARMINA",
      idEDDProyEmp: 37,
      idEDDEvalProyEmp: 151,
      proyFechaIni: "05/2022",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 1,
      cantEvalRespondidas: 1,
      cicloEvaluacion: 3,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 7,
      nomProyecto: "CARMINA",
      idEDDProyEmp: 37,
      idEDDEvalProyEmp: 157,
      proyFechaIni: "05/2022",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 1,
      cantEvalRespondidas: 1,
      cicloEvaluacion: 4,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 9,
      nomProyecto: "GRIDO",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 158,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 3,
      cicloEvaluacion: 1,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 9,
      nomProyecto: "GRIDO",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 164,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 3,
      cicloEvaluacion: 2,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 9,
      nomProyecto: "GRIDO",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 167,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 2,
      cicloEvaluacion: 3,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 9,
      nomProyecto: "GRIDO",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 170,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 3,
      cicloEvaluacion: 4,
    },

    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 10,
      nomProyecto: "BYPASS",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 158,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 3,
      cicloEvaluacion: 1,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 10,
      nomProyecto: "BYPASS",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 164,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 0,
      cicloEvaluacion: 2,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 10,
      nomProyecto: "BYPASS",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 167,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 0,
      cicloEvaluacion: 3,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 10,
      nomProyecto: "BYPASS",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 170,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 1,
      cicloEvaluacion: 4,
    },

    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 11,
      nomProyecto: "HARDVISION",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 158,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 3,
      cicloEvaluacion: 1,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 11,
      nomProyecto: "HARDVISION",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 164,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 1,
      cicloEvaluacion: 2,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 11,
      nomProyecto: "HARDVISION",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 167,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 2,
      cicloEvaluacion: 3,
    },
    {
      idCliente: 5,
      nomCliente: "ARG",
      idServicio: 5,
      nomServicio: "A - ARG",
      idEDDProyecto: 11,
      nomProyecto: "HARDVISION",
      idEDDProyEmp: 39,
      idEDDEvalProyEmp: 170,
      proyFechaIni: "11/2023",
      proyFechaFin: "Indefinida",
      estadoProyecto: "Activo",
      cantEmpleados: 3,
      cantEvalRespondidas: 2,
      cicloEvaluacion: 4,
    },
  ];

  //Obtención de los datos
  function getListEddResumenEval() {
    var url = "pages/listados/listadoEddResumenEval.php";
    var operationUrl = "listadoEddResumenEval";

    var data = {
      idCliente: idCliente,
      idServicio: idServicio,
      idProyecto: idProyecto,
      fechaIni: fechaIni,
      fechaFin: fechaFin,
      cicloEvaluacion: cicloEvaluacion,
      tipoCargo: tipoCargo,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setListEddResumenEval(response);
      setLoadedDataResumenEval(true);
      setNombrePDF("dashResumenEval" + "_" + tipoCargo + "_" + date);
    });
  }
  function GetConfigCompColor() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "competencia",
      subTipoConfDato: "RANGO_COLOR",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigCompColor(data);
      setLoadedDataColor(true);
    });
  }
  function GetConfigCompLeyenda() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "competencia",
      subTipoConfDato: "RANGO_LEYENDA",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigCompRangoLeyenda(data);
      setLoadedDataLeyenda(true);
    });
  }

  function GetConfigCompRangoF() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "competencia",
      subTipoConfDato: "RANGO_FLECHA",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigCompRangoFlechas(data);

      setLoadedDataRango(true);
    });
  }
  //---------------------- MAS INFO ----------------------

  const ActiveExtraGraph = (idProyecto) => {
    setActiveGraph(true);
    setParams({
      idCliente: idCliente,
      idServicio: idServicio,
      idEDDProyecto: idProyecto,
      cicloEvaluacion: cicloEvaluacion,
      fechaIni: fechaIni,
      fechaFin: fechaFin,
      tipoCargo: tipoCargo,
    });
  };

  //UseEffect
  useEffect(() => {
    getListEddResumenEval();
    GetConfigCompColor();
    GetConfigCompLeyenda();
    GetConfigCompRangoF();
  }, [
    loadedDataResumenEval,
    loadedDataColor,
    activeGraph,
    loadedDataLeyenda,
    loadedDataRango,
  ]);

  //Funciones

  //Dependiendo del porcentaje obtenido, se obtiene el color
  function ColorPicker(porc) {
    if (loadedDataColor) {
      var auxColor = "0"; //posiciones
      var varColor = ""; //color /dato visible

      // Ordena la lista utilizando la función de comparación
      function compararPorOrden(a, b) {
        return parseInt(b.orden) - parseInt(a.orden);
      }
      var listColor = listConfigCompColor.sort(compararPorOrden);

      listColor.map((color1) => {
        if (auxColor === "0") {
          if (eval(porc + color1.datoNoVisible)) {
            varColor = color1.datoVisible;
            auxColor = "1";
          }
        }
      });
      return varColor;
    }
  }

  //Semi círculos
  const SemiCirculos = ({ data }) => {
    if (loadedDataResumenEval) {
      // Calcular el promedio de evaluaciones respondidas por ciclo
      const promedioPorProyecto = {};
      data.forEach((item) => {
        if (!promedioPorProyecto[item.idEDDProyecto]) {
          promedioPorProyecto[item.idEDDProyecto] = {
            totalEvalRespondidas: 0,
            totalEmpleados: 0,
            ciclos: 0,
            nomProyecto: item.nomProyecto,
          };
        }
        promedioPorProyecto[item.idEDDProyecto].totalEvalRespondidas +=
          parseInt(item.cantEvalRespondidas);
        promedioPorProyecto[item.idEDDProyecto].totalEmpleados += parseInt(
          item.cantEmpleados
        );
        promedioPorProyecto[item.idEDDProyecto].ciclos += 1;
      });

      // Crear un array para almacenar los datos de cada proyecto
      const chartData = Object.entries(promedioPorProyecto).map(
        ([idProyecto, promedio]) => {
          const porcentaje =
            (promedio.totalEvalRespondidas / promedio.totalEmpleados) * 100;

          return {
            labels: [`${porcentaje.toFixed(2)}%`],
            nomProyecto: promedio.nomProyecto,
            cantEvalRespondidas: promedio.totalEvalRespondidas,
            totalEmpleados: promedio.totalEmpleados,
            idProyecto,
            datasets: [
              {
                data: [porcentaje, 100 - porcentaje],
                backgroundColor: [
                  ColorPicker(porcentaje, 100 - porcentaje),
                  "#E7E7E7",
                ],
              },
            ],
          };
        }
      );

      // Dividir los datos en filas de máximo 4 semicírculos por fila
      const rows = [];
      while (chartData.length) {
        rows.push(chartData.splice(0, 4));
      }

      const doughnutLabel = {
        id: "doughnutLabel",
        beforeDatasetsDraw(chart, args, pluginOptions) {
          const { ctx, data } = chart;
          ctx.save();
          const xCoor = chart.getDatasetMeta(0).data[0].x;
          const yCoor = chart.getDatasetMeta(0).data[0].y;
          ctx.font = "bold 18px sans-serif";
          ctx.fillStyle = `${data.datasets[0].backgroundColor[0]}`;

          ctx.textAlign = "center";
          ctx.fillText(`${data.labels}`, xCoor, yCoor);
        },
      };

      // Renderizar los semicírculos
      return (
        <div>
          <h3
            style={{
              textAlign: "center",
              margin: "auto",
            }}
          >
            Cantidad de evaluaciones respondidas por proyecto en %
          </h3>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: "flex" }}>
              {row.map((item, colIndex) => (
                <div
                  key={colIndex}
                  style={{
                    margin: "auto",
                    textAlign: "center",
                    marginTop: "25px",
                  }}
                >
                  <h5>{item.nomProyecto}</h5>
                  <h7>
                    {item.cantEvalRespondidas}/{item.totalEmpleados} Eval.
                    Respondidas
                  </h7>

                  <Doughnut
                    data={item}
                    options={{
                      circumference: 180,
                      devicePixelRatio: 4,
                      rotation: 270,
                      cutout: "70%",
                      animation: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      aspectRatio: 2,
                    }}
                    plugins={[doughnutLabel]}
                    height={100}
                    width={180}
                  />
                  <button
                    className="btnRedirect"
                    onClick={() => {
                      ActiveExtraGraph(item.idProyecto);
                    }}
                  >
                    Más información
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
  };

  //Barras horizontales
  const BarChart = ({ data }) => {
    if (loadedDataResumenEval) {
      // Calcular el promedio de evaluaciones respondidas por proyecto
      const promedioPorProyecto = {};
      data.forEach((item) => {
        if (!promedioPorProyecto[item.idEDDProyecto]) {
          promedioPorProyecto[item.idEDDProyecto] = {
            totalEvalRespondidas: 0,
            totalEmpleados: 0,
            ciclos: 0,
            nomProyecto: item.nomProyecto,
          };
        }
        promedioPorProyecto[item.idEDDProyecto].totalEvalRespondidas +=
          item.cantEvalRespondidas;
        promedioPorProyecto[item.idEDDProyecto].totalEmpleados +=
          item.cantEmpleados;
        promedioPorProyecto[item.idEDDProyecto].ciclos += 1;
      });

      // Preparar datos para el gráfico
      const labels = Object.values(promedioPorProyecto).map(
        (item) => item.nomProyecto
      );
      const percentages = Object.values(promedioPorProyecto).map(
        (item) => (item.totalEvalRespondidas * 100) / item.totalEmpleados
      );

      // Configuración del gráfico
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "Evaluaciones Respondidas",
            data: percentages,
            backgroundColor: percentages.map((item) => ColorPicker(item)),
            borderColor: percentages.map((item) => ColorPicker(item)),
            borderWidth: 1,
          },
        ],
      };

      const dataLabels = {
        id: "datalabels",
        afterDatasetsDraw(chart, args, pluginOptions) {
          const {
            ctx,
            data,
            chartArea: { left },
            scales: { x, y },
          } = chart;
          ctx.save();

          data.datasets[0].data.forEach((dataPoint, index) => {
            ctx.font = "bold 10px sans-serif";
            ctx.fillStyle = `black`;
            ctx.fillText(
              `${data.labels[index]}: ${dataPoint.toFixed(2)}`,
              left + 10,
              y.getPixelForValue(index)
            );
          });
        },
      };

      const chartOptions = {
        devicePixelRatio: 4,

        scales: {
          x: {
            type: "linear",
            position: "bottom",
            min: 0,
            max: 100,
            scaleLabel: {
              display: true,
              labelString: "Porcentaje",
            },
          },
        },
        indexAxis: "y",
        plugins: {
          legend: {
            display: false,
          },
        },
      };

      return (
        <div>
          <Bar data={chartData} options={chartOptions} plugins={[dataLabels]} />
        </div>
      );
    }
  };

  //Cartas
  const ColaboradoresCard = ({ data }) => {
    if (loadedDataResumenEval) {
      // Calcular la cantidad promedio de empleados por proyecto
      const promedioPorProyecto = {};
      data.forEach((item) => {
        if (!promedioPorProyecto[item.idEDDProyecto]) {
          promedioPorProyecto[item.idEDDProyecto] = {
            totalEmpleados: 0,
            ciclos: 0,
            nomProyecto: item.nomProyecto,
          };
        }
        promedioPorProyecto[item.idEDDProyecto].totalEmpleados += parseInt(
          item.cantEmpleados
        );
        promedioPorProyecto[item.idEDDProyecto].ciclos += 1;
      });

      return (
        <>
          {tipoCargo === "COLABORADOR" ? (
            <h5>Cantidad promedio de colaboradores por proyecto</h5>
          ) : (
            <h5>Cantidad promedio de referentes por proyecto</h5>
          )}

          <div className="containerCardsResp">
            {Object.values(promedioPorProyecto).map((item) => (
              <div key={item.nomProyecto} className="colaboradores-card">
                <table>
                  <tr>
                    <td style={{ width: "150px", textAlign: "left" }}>
                      <h3>{item.nomProyecto}: </h3>
                    </td>
                    <td style={{ width: "50px", textAlign: "center" }}>
                      {tipoCargo === "COLABORADOR" ? (
                        <>
                          <h3>{item.totalEmpleados / item.ciclos}</h3>
                        </>
                      ) : (
                        <>
                          <h3>{item.totalEmpleados / item.ciclos}</h3>
                        </>
                      )}
                    </td>
                  </tr>
                </table>
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  //Caras
  function InfoCaras() {
    if (loadedDataLeyenda && loadedDataRango) {
      const tableRows = [];
      const uniqueDatoNoVisibleValues = new Set();

      listConfigCompRangoLeyenda.forEach((ley) => {
        uniqueDatoNoVisibleValues.add(ley.datoNoVisible);
      });

      listConfigCompRangoFlechas.forEach((rango) => {
        uniqueDatoNoVisibleValues.add(rango.datoNoVisible);
      });

      uniqueDatoNoVisibleValues.forEach((datoNoVisible) => {
        const matchingLey = listConfigCompRangoLeyenda.find(
          (ley) => ley.datoNoVisible === datoNoVisible
        );
        const matchingRango = listConfigCompRangoFlechas.find(
          (rango) => rango.datoNoVisible === datoNoVisible
        );

        if (matchingLey && matchingRango) {
          var carita_gral =
            matchingRango.datoNoVisible === matchingLey.datoNoVisible ? (
              <img
                id="faceStyleLeyendas"
                src={require(`../../Smileys/${matchingRango.datoVisible}.png`)}
              ></img>
            ) : (
              ""
            );

          tableRows.push(
            <>
              <br></br>

              <td id="infoLinePorcLeyendasREFERENTE">
                <b>{matchingLey.datoVisible}</b>
              </td>
              <td className="linea">
                <td>{carita_gral}</td>
              </td>
            </>
          );
        }
      });
      return (
        <div>
          <table
            style={{
              backgroundColor: "white",
              width: "800px",
              borderRadius: "15px",
              margin: "auto",
              marginTop: "20px",
            }}
          >
            {tableRows}
          </table>
          <br></br>
        </div>
      );
    }
  }

  //Main render
  return userData.statusConected === true || userData !== null ? (
    <>
      <Header></Header>
      <h2
        style={{
          background: "white",
          width: "1000px",
          textAlign: "center",
          margin: "auto",
          marginTop: "20px",
          borderRadius: "0.5em",
          padding: "5px",
        }}
      >
        Estado general de evaluaciones de desempeño - {tipoCargo}
      </h2>
      <div className="containerSemiCirculos">
        <SemiCirculos data={jsonData} />
        <InfoCaras></InfoCaras>
      </div>

      <div className="containerBarras">
        <div style={{ width: "60%", textAlign: "center" }}>
          <h5>Promedio de evaluaciones respondidas por proyecto en %</h5>
          <BarChart data={jsonData} />
        </div>
        <div style={{ width: "60%", textAlign: "center" }}>
          <ColaboradoresCard data={jsonData} />
        </div>
      </div>

      {activeGraph ? (
        <DashboardEddResumenEval_detalle
          idCliente={paramsExtraGraph.idCliente}
          idServicio={paramsExtraGraph.idServicio}
          idProyecto={paramsExtraGraph.idEDDProyecto}
          cicloEvaluacion={paramsExtraGraph.cicloEvaluacion}
          fechaIni={paramsExtraGraph.fechaIni}
          fechaFin={paramsExtraGraph.fechaFin}
          tipoCargo={paramsExtraGraph.tipoCargo}
          setActiveGraph={setActiveGraph}
          activeGraph={activeGraph}
        />
      ) : (
        <></>
      )}
      <div style={{ margin: "auto", width: "900px", marginTop: "5px" }}>
        <ExportPDF nombreTabla={nombrePDF} />
      </div>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
