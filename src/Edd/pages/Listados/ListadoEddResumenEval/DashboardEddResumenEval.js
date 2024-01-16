import React, { useEffect, useState } from "react";
import Header from "../../../../templates/Header/Header";
import { Navigate, useParams } from "react-router-dom";
import SendDataService from "../../../../services/SendDataService";
import { Bar } from "react-chartjs-2";
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
  const [showScrollButton, setShowScrollButton] = useState(false);
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
      cantEmpleados: 5,
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
    // Agrega un listener de scroll para mostrar u ocultar el botón
    window.addEventListener("scroll", toggleScrollButton);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("scroll", toggleScrollButton);
    };
  }, [
    loadedDataResumenEval,
    loadedDataColor,
    activeGraph,
    loadedDataLeyenda,
    loadedDataRango,
  ]);

  //Funciones

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

  // Desplázate hacia arriba cuando se hace clic en el botón
  const scrollToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

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
            idProyecto: item.idEDDProyecto,
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
      const idProyecto = Object.values(promedioPorProyecto).map(
        (item) => item.idProyecto
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
            idProyecto: idProyecto,
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
            ctx.font = "bold 13px sans-serif";
            ctx.fillStyle = `black`;
            ctx.fillText(
              `${dataPoint.toFixed(2)}%`,
              left + 10,
              y.getPixelForValue(index) + 5
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
        onClick: (event, elements) => {
          if (elements.length > 0) {
            ActiveExtraGraph(
              chartData.datasets[0].idProyecto[elements[0].index]
            );
          }
        },
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement[0]
            ? "pointer"
            : "default";
        },
        elements: {
          bar: {
            hover: {
              mode: "nearest",
              axis: "xy",
            },
            // cursor: "pointer", // Cambia el cursor a "pointer" al pasar sobre las barras
          },
        },
      };

      return (
        <div>
          <Bar
            data={chartData}
            options={chartOptions}
            plugins={[dataLabels]}
            width={850}
            height={220}
          />
        </div>
      );
    }
  };

  // //Cartas
  // const ColaboradoresCard = ({ data }) => {
  //   if (loadedDataResumenEval) {
  //     // Calcular la cantidad promedio de empleados por proyecto
  //     const promedioPorProyecto = {};
  //     data.forEach((item) => {
  //       if (!promedioPorProyecto[item.idEDDProyecto]) {
  //         promedioPorProyecto[item.idEDDProyecto] = {
  //           totalEmpleados: 0,
  //           ciclos: 0,
  //           nomProyecto: item.nomProyecto,
  //         };
  //       }
  //       promedioPorProyecto[item.idEDDProyecto].totalEmpleados += parseInt(
  //         item.cantEmpleados
  //       );
  //       promedioPorProyecto[item.idEDDProyecto].ciclos += 1;
  //     });

  //     return (
  //       <>
  //         {tipoCargo === "COLABORADOR" ? (
  //           <h5>Cantidad promedio de colaboradores por proyecto</h5>
  //         ) : (
  //           <h5>Cantidad promedio de referentes por proyecto</h5>
  //         )}

  //         <div className="containerCardsResp">
  //           {Object.values(promedioPorProyecto).map((item) => (
  //             <div key={item.nomProyecto} className="colaboradores-card">
  //               <table>
  //                 <tr>
  //                   <td style={{ width: "150px", textAlign: "left" }}>
  //                     <h3>{item.nomProyecto}: </h3>
  //                   </td>
  //                   <td style={{ width: "50px", textAlign: "center" }}>
  //                     {tipoCargo === "COLABORADOR" ? (
  //                       <>
  //                         <h3>{item.totalEmpleados / item.ciclos}</h3>
  //                       </>
  //                     ) : (
  //                       <>
  //                         <h3>{item.totalEmpleados / item.ciclos}</h3>
  //                       </>
  //                     )}
  //                   </td>
  //                 </tr>
  //               </table>
  //             </div>
  //           ))}
  //         </div>
  //       </>
  //     );
  //   }
  // };

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
{/* id="infoLinePorcLeyendasREFERENTE" */}
              <td style={{whiteSpace: "nowrap"}} > 
                &nbsp;
                <b>{matchingLey.datoVisible}</b>
                
              </td>
              &nbsp;

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
              width: "500px",
              borderRadius: "15px",
              margin: "auto",
              marginTop: "20px",
              fontSize: "8pt",
            }}
          >
            {tableRows}
          </table>
          <br></br>
        </div>
      );
    }
  }


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
      <div className="containerBarras">
        <h5>Promedio de evaluaciones respondidas por proyecto en %</h5>
        
        <h6>(Desde {formatDate(fechaIni)} hasta {formatDate(fechaFin)})</h6>
        &nbsp;
        <h2
          data-html2canvas-ignore="true"
          style={{
            textAlign: "center",
            margin: "auto",
            marginTop: "5px",
            fontSize: "10pt",
          }}
        >
          (Click en cada barra para más información)
        </h2>
        <BarChart data={jsonData} />

        <InfoCaras></InfoCaras>
      </div>

      <div
        style={{
          margin: "auto",
          width: "1000px",
          marginTop: "5px",
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "column",
        }}
      >
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
            setShowScrollButton={setShowScrollButton}
          />
        ) : (
          <></>
        )}
        {/* Botón de AutoScroll */}
        <ExportPDF nombreTabla={nombrePDF} />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          id="scrollBtn"
          title="Ir arriba"
          data-html2canvas-ignore="true"
        >
          ↑
        </button>
      )}
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
