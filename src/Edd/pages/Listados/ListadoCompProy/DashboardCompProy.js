import React, { useState, useEffect } from "react";
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import { Container, Table, Card } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { useRoute } from "wouter";
import "../TablasStyles.css";
import "../ListadoCompProy/CompProy.css"
import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
// GRAFICO LINEAS
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';

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
// 

// GRAFICO BARRA

// 
export default function DashboardCompProy() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [, params] = useRoute("/DashboardCompProy/:selectedClients/:selectedServicio/:selectedProyecto/:tipoComparacion/:tipoCargo/:fechaIni/:fechaFin/:cicloEvaluacion");

  const idCliente = params.selectedClients;
  const idServicio = params.selectedServicio;
  const idProyecto = params.selectedProyecto;
  const tipoComparacion = decodeURIComponent(params.tipoComparacion);
  const tipoCargo = params.tipoCargo;
  const fechaIni = params.fechaIni;
  const fechaFin = params.fechaFin;
  const cicloEvaluacion = params.cicloEvaluacion;

  const [DashCompProy, setDashCompProy] = useState([""]);

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
    console.log('DataSendData', data);
    SendDataService(url, operationUrl, data).then((data) => {
      // comparacionPor = MostrarInfo(idCliente, idServicio, idProyecto);
      setDashCompProy(data)
      console.log('InformaciónReponse', data);
    });
  }
  useEffect(() => {
    SendData();
  }, []);
  //---------------------
  // GRAFICOS
  var predefinedColors = [

    // FUERTE
    "#B71C1C", // Rojo              1
    "#303F9F", // Azul              2
    "#8BC34A", // Verde               3
    "#FDD835", // Amarillo              4
    "#F48FB1", // Rosa              5
    "#00796B", // Cyan                  6
    "#8E24AA", // Violeta              7
    "#EF6C00", // Naranja              8
    "#03A9F4", // Celeste              9
    "#795548", // Verde agua            10

    // CLAROS
    "#EF9A9A", // Rojo              1
    "#9FA8DA", // Azul              2
    "#558B2F", // Verde               3
    "#FFF59D", // Amarillo              4
    "#E91E63", // Rosa              5
    "#80CBC4", // Cyan                   6
    "#CE93D8", // Violeta              7
    "#FFB74D", // Naranja              8
    "#B3E5FC", // Celeste              9
    "#BCAAA4", // Verde agua            10

    // MEDIOS
    "#F44336", // Rojo              1
    "#3F51B5", // Azul              2
    "#C5E1A5", // Verde               3
    "#FFF176", // Amarillo              4
    "#F06292", // Rosa              5
    "#26A69A", // Cyan                  6
    "#AB47BC", // Violeta              7
    "#FF9800", // Naranja              8
    "#4FC3F7", // Celeste              9
    "#795548", // Verde agua            10

    // Agrega más colores según sea necesario
  ];
  function BarrasChart() {
    const fechasConDatos = [...new Set(DashCompProy.map(item => item.epeFechaFin))];
    const competencias = [...new Set(DashCompProy.map(item => item.nomCompetencia))];
    const tipoComparacion = [...new Set(DashCompProy.map(item => item.tipoComparacion))];
    console.log(tipoComparacion);


    // Formatear las fechas según el tipo de comparación
    const formattedFechasConDatos = fechasConDatos.map(fecha => {
      if (tipoComparacion === 'AÑO') {
        return fecha.substring(0, 4); // Obtener solo el año (YYYY)
      } else if (tipoComparacion === 'MES') {
        return fecha; // Mantener el formato completo (YYYY-MM)
      } else {
        return fecha; // Sin cambios para otros tipos de comparación
      }
    });

    // Ordenar las fechas de manera ascendente (esto incluye mes y año)
    formattedFechasConDatos.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    const datasets = competencias.map((competencia, index) => {
      const data = formattedFechasConDatos.map(fecha => {
        const porcentaje = DashCompProy
          .filter(item => item.nomCompetencia === competencia && item.epeFechaFin === fecha)
          .map(item => item.porcAprobComp)[0] || 0;
        return porcentaje;
      });
      return {
        label: competencia,
        data: data,
        backgroundColor: predefinedColors[index % predefinedColors.length],
      };
    });

    const data = {
      labels: formattedFechasConDatos, // Usar las fechas ordenadas
      datasets: datasets,
    };

    const options = {
      responsive: true,
      animation: false,
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
          ticks: { color: 'black' },
        },
      }
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
          <table key={index} style={{ width: '100%' }}>

            <td><h5>Cliente:&nbsp; {item.nomCliente}</h5></td>
            <td><h5>Servicio:&nbsp; {item.nomServicio}</h5></td>
            <td><h5>Proyecto:&nbsp; {item.nomProyecto}</h5></td>

          </table>
        );
      }
      return null; // No se agregará a la tabla si es un valor duplicado
    });

    return (

      <>
        {tableRows}

      </>
    );
  }

  function InfCantRefColab() {
    // Crea un conjunto de ciclos únicos
    const uniqueCiclos = new Set(DashCompProy.map(item => item.cicloEvaluacion));

    return (
      <div>
        {[...uniqueCiclos].map(ciclo => {
          // Filtra los elementos correspondientes a un ciclo específico
          const cicloData = DashCompProy.filter(item => item.cicloEvaluacion === ciclo);

          // Usa un conjunto para evitar la repetición de información
          const uniqueInfo = new Set();

          return (
            <div key={ciclo}>
              <h5>Ciclo: {ciclo}</h5>
              {cicloData.map((item, index) => {
                // Crea una cadena única para evitar repeticiones
                const infoString = `${item.cantReferentes}-${item.cantColaboradores}`;

                if (!uniqueInfo.has(infoString)) {
                  uniqueInfo.add(infoString);
                  return (
                    <div key={index}>
                      <h5>Cantidad de referentes: {item.cantReferentes}</h5>
                      <h5>Cantidad de colaboradores: {item.cantColaboradores}</h5>
                    </div>
                  );
                }
                return null; // No mostrar información repetida
              })}
            </div>
          );
        })}
      </div>
    );
  }



  // Función para contar las competencias según el ciclo de evaluación
  function countCompetenciasPorCiclo() {
    if (cicloEvaluacion === "0") {
      const competenciasPorCiclo = DashCompProy.reduce((result, item) => {
        if (!result[item.cicloEvaluacion]) {
          result[item.cicloEvaluacion] = {
            competencias: new Set(),
            fechas: new Set(),
          };
        }
        result[item.cicloEvaluacion].competencias.add(item.nomCompetencia);
        result[item.cicloEvaluacion].fechas.add(item.epeFechaFin);
        return result;
      }, {});

      const infoCiclos = Object.entries(competenciasPorCiclo).map(([cicloEvaluacion, data]) => {
        const competencias = data.competencias.size;
        const fechas = [...data.fechas];
        const formattedFechasPorCiclo = [...new Set(fechas)]; // Eliminar fechas duplicadas

        return (
          <tr key={cicloEvaluacion}>
            <tr>
              <h5>Ciclo: {cicloEvaluacion} </h5>
            </tr>
            <tr>
              <h5>Competencias: {competencias}</h5>
            </tr>
            <tr>
              <h5>Fecha: {formattedFechasPorCiclo.join(", ")}</h5>
            </tr>
          </tr>
        );
      });

      return (
        <table>
          <tbody>{infoCiclos}</tbody>
        </table>
      );
    } else {
      // En otros casos, mostrar la cantidad de competencias únicas sin repetir en el ciclo actual
      const competenciasPorCiclo = DashCompProy
        .filter((item) => item.cicloEvaluacion === cicloEvaluacion)
        .map((item) => item.nomCompetencia);

      const competenciasUnicas = [...new Set(competenciasPorCiclo)];

      // Filtrar las fechas correspondientes al ciclo actual
      const fechasPorCiclo = DashCompProy
        .filter((item) => item.cicloEvaluacion === cicloEvaluacion)
        .map((item) => item.epeFechaFin);

      const formattedFechasPorCiclo = [...new Set(fechasPorCiclo)]; // Eliminar fechas duplicadas

      return (
        <table>
          <tbody>
            <tr>
              <tr>
                <h5>Ciclo: {cicloEvaluacion}</h5>
              </tr>
              <tr>
                <h5>Competencias: {competenciasUnicas.length}
                </h5>
              </tr>
              <tr>
                <h5>Fecha: {formattedFechasPorCiclo.join(", ")}</h5>
              </tr>
            </tr>
          </tbody>
        </table>
      );
    }
  }










  // Llama a la función y muestra el resultado donde sea necesario

  // En tu componente principal, puedes usar la función Info dentro de tu tabla
  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <table style={{ margin: 'auto' }}>
        <br></br>
        <tr>
          <br></br>
          <td>
            <div className="bg-light mx-auto px-2 border " style={{ width: "1200px", height: "600px" }}>
              {BarrasChart()}
            </div>
            <br></br>




            <div id="fondoTablaDashCompProy">
              <div id="containerTablasDashCompProy">

                <table style={{ backgroundColor: 'white', width: '100%', margin: 'auto' }}>
                  {Info()}
                  <table style={{ width: '100%', margin: 'auto' }}>
                    <td><p>Cantidad de competencias: {countCompetenciasPorCiclo()}</p></td>
                    <td><p>Cantidad de ref y colab: {InfCantRefColab()}</p></td>
                  </table>
                </table>

              </div>
            </div>



          </td>
        </tr>

      </table >
      <br></br>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );

}  