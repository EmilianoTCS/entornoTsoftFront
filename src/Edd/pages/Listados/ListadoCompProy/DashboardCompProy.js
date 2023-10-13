import React, { useState, useEffect } from "react";
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import { Container, Table } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import "../TablasStyles.css";
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
  const [, params] = useRoute("/DashboardCompProy/:selectedClients/:selectedServicio/:selectedProyecto/:tipoComparacion/:tipoCargo/:fechaIni/:fechaFin");

  const idCliente = params.selectedClients;
  const idServicio = params.selectedServicio;
  const idProyecto = params.selectedProyecto;
  const tipoComparacion = decodeURIComponent(params.tipoComparacion);
  const tipoCargo = params.tipoCargo;
  const fechaIni = params.fechaIni;
  const fechaFin = params.fechaFin;



  const [DashCompProy, setDashCompProy] = useState([""]);

  function MostrarInfo(idClientes, idServicios, idProyectos) {
    if (idClientes && idServicios && idProyectos) {
      // Caso 1: Cuando tienes datos en los tres parámetros, retornar proyectos
      return 'nomProyecto';
    } else if (idClientes && idServicios && !idProyectos) {
      // Caso 2: Cuando tienes idClientes y idServicios, pero idProyectos está vacío, retornar servicios
      return 'nomServicio';
    } else if (idClientes && !idServicios && !idProyectos) {
      // Caso 3: Cuando solo tienes idClientes, y idServicios e idProyectos están vacíos, retornar idClientes
      return 'nomCliente';
    } else {
      return "No se cumple ninguna condición";
    }
  }

  const comparacionPor = '';

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
    };
    console.log('DataSendData', data);
    SendDataService(url, operationUrl, data).then((data) => {
      comparacionPor = MostrarInfo(idCliente, idServicio, idProyecto);
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
  ];

  function LineasChart() {

    var General = [15, 30, 55, 50, 55, 60, 20, 45, 15, 55, 40, 40];

    var Joaquín = [10, 50, 20, 30, 80, 40, 30, 20, 20, 30, 10, 60];
    var Marco = [20, 10, 90, 70, 30, 80, 10, 70, 10, 80, 70, 20];
    var meses = ["AUTONOMIA", "CAPACIDAD ANALITICA", "CAPACIDAD DE APRENDIZAJE", "COMUNICACIÓN", "CONFIANZA", "DESEMPEÑO", "DISPOSICION/ACTITUD", "EMPODERAMIENTO"];

    var midata = {
      labels: meses,
      datasets: [ // Cada una de las líneas del gráfico
        {
          label: 'Joaquín Aguirre',
          data: Joaquín,
          borderColor: 'green',
          backgroundColor: 'green',
          pointRadius: 5,
          pointBorderColor: 'green',
          pointBackgroundColor: 'green',
        },
        {
          label: 'Marco Díaz',
          data: Marco,
          borderColor: 'red',
          backgroundColor: 'red',
          pointRadius: 5,
          pointBorderColor: 'red',
          pointBackgroundColor: 'red',
        },
        {
          label: 'General',
          data: General,
          borderColor: 'blue',
          backgroundColor: 'blue',
          pointRadius: 5,
          pointBorderColor: 'blue',
          pointBackgroundColor: 'blue',
        },

      ],
    };

    var misoptions = {
      responsive: true,
      scales: {
        y: {
          min: 0
        },
        x: {
          ticks: { color: 'black' }
        }
      }
    };
    return <Line data={midata} options={misoptions} />
  }

  function BarrasChart() {

    var beneficios = [22, 57, 26, 15, 10, 90, 60, -50, 95, 50, 72, 10];
    var beneficios2 = [20, 10, 90, 70, 30, 80, 10, 70, 10, 80, 70, 20];
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    var misoptions = {
      responsive: true,
      animation: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          min: -25,
          max: 100
        },
        x: {
          ticks: { color: 'rgba(0, 220, 195)' }
        }
      }
    };

    var midata = {
      labels: meses,
      datasets: [
        {
          label: 'Beneficios',
          data: beneficios,
          backgroundColor: 'orange'
        },
        {
          label: 'Beneficios2',
          data: beneficios2,
          backgroundColor: 'green'
        }
      ]
    };
    return <Bar data={midata} options={misoptions} />
  }

  function DonutChart() {
    const data = {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };


    return <Doughnut data={data} />;
  }
  // FIN GRAFICOS





  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>

      <table style={{ margin: 'auto' }}>
        <tr>
          <br></br>
          <div className="bg-light mx-auto px-2 border " style={{ width: "800px", height: "400px" }}>
            {BarrasChart()}
          </div>
        </tr>

        <tr>
          <br></br>
          <div className="bg-light mx-auto px-2 border " style={{ width: "800px", height: "400px" }}>
            {LineasChart()}
          </div>
        </tr>


        <tr>
          <br></br>
          <div className="bg-light mx-auto px-2 border " style={{ width: "400px", height: "400px" }}>
            {DonutChart()}
          </div>
        </tr>
      </table>





    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
