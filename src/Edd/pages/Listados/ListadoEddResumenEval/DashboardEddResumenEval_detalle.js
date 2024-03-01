import React, { useEffect, useState } from "react";
import "../TablasStyles.css";
import { Table } from "react-bootstrap";
import DashboardCompProy_detalle from "./DashboardCompProy_detalle";
import SendDataService from "../../../../services/SendDataService";
import { Doughnut, Bar } from "react-chartjs-2";
import "./DashboardEddResumenEval.css";
export default function DashboardEddResumenEval_detalle({
  idCliente,
  idServicio,
  idProyecto,
  cicloEvaluacion,
  fechaIni,
  fechaFin,
  tipoCargo,
  setActiveGraph,
  setShowScrollButton,
}) {
  //Declaración de variables

  const [listEddResumenEval, setListEddResumenEval] = useState();
  const [loadedDataResumenEval, setLoadedDataResumenEval] = useState(false);
  const [loadedDataColor, setLoadedDataColor] = useState(false);
  const [listConfigCompColor, setListConfigCompColor] = useState("");
  const [tipoComparacion, setTipoComparacion] = useState("MES");


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
      console.log(response);
      setListEddResumenEval(response);
      setLoadedDataResumenEval(true);
    });
  }
  function GetConfigCompColorFlechas() {
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

  var colores = [
    "#fcb174",
    "#75beeb",
    "#7ddb7d",
    "#e6c563",
    "#dda0dd",
    "#afeeee",
    "#ffcccb",
    "#f0e68c",
    "#d8bfd8",
    "#add8e6",
    "#f08080",
    "#e0ffff",
    "#e38190",
    "#c71585",
    "#87ceeb",
    "#f5deb3",
    "#dda0dd",
    "#7ddb7d",
    "#bc8f8f",
    "#ffecb3",
  ];

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
      cantEvalRespondidas: 3,
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
      cantEvalRespondidas: 2,
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
      cantEvalRespondidas: 3,
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
      cantEvalRespondidas: 3,
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
      cantEvalRespondidas: 3,
      cicloEvaluacion: 4,
    },
  ];

  //UseEffect
  useEffect(() => {
    getListEddResumenEval();
    GetConfigCompColorFlechas();
  }, [
    loadedDataResumenEval,
    loadedDataColor,
    idProyecto,
    idServicio,
    idCliente,
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
      // Crear un array para almacenar los datos de cada semicírculo
      const chartData = data.map((item, index) => {
        const porcentaje =
          (item.cantEvalRespondidas / item.cantEmpleados) * 100;

        return {
          labels: [`${porcentaje.toFixed(2)}%`],
          numCiclo: item.cicloEvaluacion,
          cantEvalRespondidas: item.cantEvalRespondidas,
          cantEmpleados: item.cantEmpleados,
          datasets: [
            {
              data: [porcentaje, 100 - porcentaje],
              backgroundColor: [colores[index % colores.length], "#E7E7E7"],
            },
          ],
        };
      });

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
            Detalle de evaluaciones de desempeño - {data[0].nomProyecto}
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
                  <h5>Ciclo {item.numCiclo}</h5>
                  <h7>
                    {item.cantEvalRespondidas}/{item.cantEmpleados} Eval.
                    Respondidas
                  </h7>
                  <Doughnut
                    data={item}
                    options={{
                      circumference: 180,
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
      // Preparar datos para el gráfico
      const labels = data.map((item) => `Ciclo ${item.cicloEvaluacion}`);
      const percentages = data.map((item) => item.cantEmpleados);

      // Configuración del gráfico
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: tipoCargo === "COLABORADOR" ? "Colaboradores" : "Referentes",
            data: percentages,
            backgroundColor: colores.slice(0, data.length),
            borderColor: colores.slice(0, data.length),
            borderWidth: 1,
          },
        ],
      };

      const chartOptions = {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            min: 0,
            max: 50,
            scaleLabel: {
              display: true,
              labelString: "Porcentaje",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        indexAxis: "y",
      };

      return (
        <div>
          <Bar data={chartData} options={chartOptions} />
        </div>
      );
    }
  };

  //Cartas
  const ColaboradoresCard = ({ data }) => {
    if (loadedDataResumenEval) {
      return (
        <>
          {tipoCargo === "COLABORADOR" ? (
            <h5>Cantidad colaboradores por ciclo</h5>
          ) : (
            <h5>Cantidad referentes por ciclo</h5>
          )}

          <div className="containerCardsResp">
            {data.map((item) => (
              <div key={item.cicloEvaluacion} className="colaboradores-card">
                <h3>Ciclo {item.cicloEvaluacion}</h3>
                {tipoCargo === "COLABORADOR" ? (
                  <>
                    <h3>Cantidad colaboradores: {item.cantEmpleados}</h3>
                  </>
                ) : (
                  <>
                    <h3>Cantidad referentes: {item.cantEmpleados}</h3>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  function toggleInfo() {
    setActiveGraph(false);
    setShowScrollButton(false);
  }

  const Grid = ({ data }) => {
    if (loadedDataResumenEval) {
      // Obtener la lista de proyectos y ciclos únicos
      const proyectos = [...new Set(data.map((item) => item.nomProyecto))];
      const ciclos = [...new Set(data.map((item) => item.cicloEvaluacion))];

      // Crear la estructura de datos para la grilla
      const gridData = ciclos.map((ciclo) => {
        const rowData = {
          ciclo: ciclo,
        };

        proyectos.forEach((proyecto) => {
          const proyectoData = data.find(
            (item) =>
              item.nomProyecto === proyecto && item.cicloEvaluacion === ciclo
          );

          if (proyectoData) {
            rowData[`${proyecto}_cantEmpleados`] = proyectoData.cantEmpleados;
            rowData[`${proyecto}_fechaIniVigencia`] =
              proyectoData.fechaIniVigenciaEvalRef ||
              proyectoData.fechaIniVigenciaEvalColab;
            rowData[`${proyecto}_cantEvalRespondidas`] =
              proyectoData.cantEvalRespondidas;
            rowData[`${proyecto}_fechaIniProyecto`] = proyectoData.proyFechaIni;
            rowData[`${proyecto}_fechaFinProyecto`] = proyectoData.proyFechaFin;
          }
        });

        return rowData;
      });

      return (
        <Table id="mainTable" hover responsive>
          <thead>
            <tr style={{ padding: "20px" }}>
              <th>Ciclo</th>
              <th>Fecha Ciclo</th>
              <th>Cant. Empleados</th>
              <th>Cant. Evaluaciones</th>
              <th>Cant. Eval Respondidas</th>
              <th>% Eval Respondidas</th>
              <th>Fecha Ini Proyecto</th>
              <th>Fecha Fin Proyecto</th>
            </tr>
          </thead>
          <tbody>
            {gridData.map((row) => (
              <tr key={row.ciclo} style={{ padding: "20px" }}>
                <td>{row.ciclo}</td>
                {proyectos.map((proyecto) => (
                  <React.Fragment key={proyecto}>
                    <td>{row[`${proyecto}_fechaIniVigencia`] || "-"}</td>
                    <td>{row[`${proyecto}_cantEmpleados`] || "-"}</td>
                    <td>{row[`${proyecto}_cantEmpleados`] || "-"}</td>
                    <td>{row[`${proyecto}_cantEvalRespondidas`] || "-"}</td>
                    <td>
                      {(
                        (row[`${proyecto}_cantEvalRespondidas`] * 100) /
                        row[`${proyecto}_cantEmpleados`]
                      ).toFixed(2) || "-"}
                    </td>
                    <td>{row[`${proyecto}_fechaIniProyecto`] || "-"}</td>
                    <td>{row[`${proyecto}_fechaFinProyecto`] || "-"}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
  };
  //Main render
  return (
    <>
      <div className="containerChart" id="chartAutoScroll_detalleResEval">
        {loadedDataResumenEval ? (
          <h3>{listEddResumenEval[0].nomProyecto}</h3>
        ) : (
          <></>
        )}

        {tipoCargo === "COLABORADOR" ? (
          <h5>Detalle de colaboradores por ciclo</h5>
        ) : (
          <h5>Detalle de referentes por ciclo</h5>
        )}
        <Grid data={listEddResumenEval} />

        <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", flexDirection: "row", width: "800px" }}>
          <button
            data-title="Desplegar dashboard"
            type="button"
            className="btn-General-Pag"
            data-html2canvas-ignore="true"
            style={{marginLeft: "0"}}
            onClick={() => {
              setTipoComparacion("MES")
            }}
          >
            Desplegar Dashboard Competencias - MENSUAL
          </button>

          <button
            data-title="Desplegar dashboard"
            type="button"
            className="btn-General-Pag"
            data-html2canvas-ignore="true"
            style={{marginLeft: "0"}}
            onClick={() => {
              setTipoComparacion("AÑO")
            }}
          >
            Desplegar Dashboard Competencias - ANUAL
          </button>
        </div>
      </div>

      <div
        style={{
          width: "fit-content",
          marginTop: "5px",
        }}
      >
        <DashboardCompProy_detalle
          idCliente={idCliente}
          idServicio={idServicio}
          idProyecto={idProyecto}
          tipoComparacion={tipoComparacion}
          tipoCargo={tipoCargo}
          fechaIni={fechaIni}
          fechaFin={fechaFin}
          cicloEvaluacion={cicloEvaluacion}
        />
      </div>
      <div
        style={{
          margin: "auto",
          width: "900px",
          marginTop: "5px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => toggleInfo()}
          value="Ocultar"
          className="btnOcultarDetalle"
          data-html2canvas-ignore="true"
        >
          Ocultar detalle
        </button>
      </div>
    </>
  );
}
