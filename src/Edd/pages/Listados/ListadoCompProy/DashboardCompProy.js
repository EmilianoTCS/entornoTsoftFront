import React, { useState, useEffect } from "react";
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import { Container, Table, Card } from "react-bootstrap";
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
        const [year, month] = fecha.split('-');
        return `${month}-${year}`; // Formato MM-YYYY
      } else {
        return fecha; // Sin cambios para otros tipos de comparación
      }
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
      labels: formattedFechasConDatos,
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
          <tr key={index} >
            <tr><h5>Cliente:&nbsp; {item.nomCliente}</h5></tr>
            <tr><h5>Servicio:&nbsp; {item.nomServicio}</h5></tr>
            <tr><h5>Proyecto:&nbsp; {item.nomProyecto}</h5></tr>
          </tr>
        );
      }
      return null; // No se agregará a la tabla si es un valor duplicado
    });

    return (
      <table>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    );
  }


  function InfCantRefColab() {
    // Supongo que DashCompProy es un array de objetos que contienen las propiedades "cantColaboradores" y "cantReferentes"
    const uniqueCombinations = new Set();
    const tableRows = DashCompProy.map((item, index) => {
      const combination = `${item.cantColaboradores}-${item.cantReferentes}`;
      if (!uniqueCombinations.has(combination)) {
        uniqueCombinations.add(combination);
        return (
          <tr key={index}>
            <tr><h5>Cantidad de referentes:&nbsp; {item.cantColaboradores}</h5></tr>
            <tr><h5>Cantidad de colaboradores:&nbsp; {item.cantReferentes}</h5></tr>
          </tr>
        );
      }
      return null; // No se agregará a la tabla si es una combinación duplicada
    });

    return (
      <table>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    );
  }


  // En tu componente principal, puedes usar la función Info dentro de tu tabla
  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <table style={{ margin: 'auto' }}>
        <br></br>
        <tr>
          <br></br>
          <td>
            <Card style={{padding:'1em'}}>
              <tbody>
                <Info />
                <br></br>
                <InfCantRefColab></InfCantRefColab>
              </tbody>
            </Card>
          </td>

          <td>
            <div className="bg-light mx-auto px-2 border " style={{ width: "800px", height: "400px" }}>
              {BarrasChart()}
            </div>
          </td>
        </tr>

      </table >
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );

}  