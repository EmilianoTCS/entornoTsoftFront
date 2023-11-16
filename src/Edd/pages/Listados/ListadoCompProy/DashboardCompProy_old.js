import React, { useState, useEffect } from "react";

import { Navigate, useParams } from "react-router-dom";
import { useRoute } from "wouter";
import "../TablasStyles.css";
import "../ListadoCompProy/CompProy.css";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import "../BtnInsertar.css";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";

import ProgressBar from "react-bootstrap/ProgressBar";

// GRAFICO LINEAS
import { Bar, Line } from "react-chartjs-2";

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

  const [DashCompProy, setDashCompProy] = useState([""]);
  const [listConfigCompColorFlechas, setListConfigCompColorFlechas] =
    useState("");

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
    console.log("DataSendData", data);
    SendDataService(url, operationUrl, data).then((data) => {
      // comparacionPor = MostrarInfo(idCliente, idServicio, idProyecto);
      setDashCompProy(data);
      console.log("InformaciónReponse", data);
    });
  }
  useEffect(() => {
    SendData();
    GetConfigCompColorFlechas();
  }, []);

  //---------------------

  // var DashCompProy = [
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2022",
  //     epeFechaFin: "2022",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "70.33",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "AUTONOMIA",
  //     cicloEvaluacion: "1"
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2022",
  //     epeFechaFin: "2022",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "50.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "EMPODERAMIENTO",
  //     cicloEvaluacion: "1",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2022",
  //     epeFechaFin: "2022",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "33.33",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "GESTION",
  //     cicloEvaluacion: "1",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2022",
  //     epeFechaFin: "2022",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "50.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "CAPACIDAD ANALÍTICA",
  //     cicloEvaluacion: "1",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2022",
  //     epeFechaFin: "2022",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "70.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "COMUNICACIÓN",
  //     cicloEvaluacion: "1",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2022",
  //     epeFechaFin: "2022",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "25.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "INTELIGENCIA EMOCIONAL",
  //     cicloEvaluacion: "1",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2022",
  //     epeFechaFin: "2022",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "30.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "CONFIANZA",
  //     cicloEvaluacion: "1",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2022",
  //     epeFechaFin: "2022",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "95.33",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "DISPOSICION/ACTITUD",
  //     cicloEvaluacion: "1",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2022",
  //     epeFechaFin: "2022",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "54.33",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "PROACTIVIDAD",
  //     cicloEvaluacion: "1",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2022",
  //     epeFechaFin: "2022",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "45.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "SERVICIO",
  //     cicloEvaluacion: "1",
  //   },

  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "15.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "0",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "AUTONOMIA",
  //     cicloEvaluacion: "2",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "60.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "0",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "EMPODERAMIENTO",
  //     cicloEvaluacion: "2",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "90.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "0",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "GESTION",
  //     cicloEvaluacion: "2",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "60.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "CAPACIDAD ANALÍTICA",
  //     cicloEvaluacion: "2",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "80.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "COMUNICACIÓN",
  //     cicloEvaluacion: "2",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "10.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "INTELIGENCIA EMOCIONAL",
  //     cicloEvaluacion: "2",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "67.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "CONFIANZA",
  //     cicloEvaluacion: "2",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "70.33",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "DISPOSICION/ACTITUD",
  //     cicloEvaluacion: "2",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "100.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "PROACTIVIDAD",
  //     cicloEvaluacion: "2",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "87.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "SERVICIO",
  //     cicloEvaluacion: "2",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "100.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "AUTONOMIA",
  //     cicloEvaluacion: "3",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "5.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "0",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "EMPODERAMIENTO",
  //     cicloEvaluacion: "3",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "5.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "0",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "GESTION",
  //     cicloEvaluacion: "3",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "95.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "CAPACIDAD ANALÍTICA",
  //     cicloEvaluacion: "3",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "25.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "COMUNICACIÓN",
  //     cicloEvaluacion: "3",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "25.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "INTELIGENCIA EMOCIONAL",
  //     cicloEvaluacion: "3",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "97.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "CONFIANZA",
  //     cicloEvaluacion: "3",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "87.33",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "DISPOSICION/ACTITUD",
  //     cicloEvaluacion: "3",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "54.33",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "PROACTIVIDAD",
  //     cicloEvaluacion: "3",
  //   },
  //   {
  //     idCliente: "7",
  //     nomCliente: "PRY JS",
  //     idServicio: "7",
  //     nomServicio: "PRY JS SEV",
  //     idProyecto: "6",
  //     nomProyecto: "PROYECTO JS",
  //     epeFechaIni: "2023",
  //     epeFechaFin: "2023",
  //     cantReferentes: "1",
  //     cantColaboradores: "2",
  //     porcAprobRef: "13.00",
  //     porcAprobColab: "0.00",
  //     cantRespRefOK: "1",
  //     cantRespColabOK: "0",
  //     cantPregComp: "1",
  //     cantResp: "3",
  //     nomCompetencia: "SERVICIO",
  //     cicloEvaluacion: "3",
  //   }
  // ];

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
    const fechasConDatos = [
      ...new Set(DashCompProy.map((item) => item.epeFechaFin)),
    ];
    const competencias = [
      ...new Set(DashCompProy.map((item) => item.nomCompetencia)),
    ];

    // Formatear las fechas según el tipo de comparación
    const formattedFechasConDatos = fechasConDatos.map((fecha) => {
      return fecha;
    });

    // Ordenar las fechas de manera ascendente (esto incluye mes y año)
    formattedFechasConDatos.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    const datasets = competencias.map((competencia, index) => {
      const data = formattedFechasConDatos.map((fecha) => {
        let porcentaje = 0;

        if (tipoCargo === "REFERENTE") {
          const filteredItems = DashCompProy.filter((item) => {
            return (
              item.nomCompetencia === competencia && item.epeFechaIni === fecha
            );
          });

          if (filteredItems.length > 0) {
            // Calcular el promedio de las competencias con el mismo nombre y año
            const competenciasMismoNombreAño = DashCompProy.filter((item) => {
              return (
                item.nomCompetencia === competencia &&
                item.epeFechaIni === fecha
              );
            });

            const totalPorcentajes = competenciasMismoNombreAño.reduce(
              (total, item) => {
                return total + parseFloat(item.porcAprobRef);
              },
              0
            );

            porcentaje =
              totalPorcentajes / competenciasMismoNombreAño.length || 0;
          }
        } else if (tipoCargo === "COLABORADOR") {
          const filteredItems = DashCompProy.filter((item) => {
            return (
              item.nomCompetencia === competencia && item.epeFechaIni === fecha
            );
          });

          if (filteredItems.length > 0) {
            // Calcular el promedio de las competencias con el mismo nombre y año
            const competenciasMismoNombreAño = DashCompProy.filter((item) => {
              return (
                item.nomCompetencia === competencia &&
                item.epeFechaIni === fecha
              );
            });

            const totalPorcentajes = competenciasMismoNombreAño.reduce(
              (total, item) => {
                return total + parseFloat(item.porcAprobColab);
              },
              0
            );

            porcentaje = (
              totalPorcentajes / competenciasMismoNombreAño.length || 0
            ).toFixed(2);
          }
        }

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
      animation: true,
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
                  &nbsp;&nbsp;<b>Proyecto:</b>&nbsp; {item.nomProyecto}
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

  function LineChart() {
    const ciclosConDatos = [
      ...new Set(DashCompProy.map((item) => item.cicloEvaluacion)),
    ];
    const competencias = [
      ...new Set(DashCompProy.map((item) => item.nomCompetencia)),
    ];

    const datasets = competencias.map((competencia, index) => {
      const data = ciclosConDatos.map((ciclo) => {
        let porcentaje = 0;

        if (tipoCargo === "REFERENTE") {
          const filteredItems = DashCompProy.filter((item) => {
            return (
              item.nomCompetencia === competencia &&
              item.cicloEvaluacion === ciclo
            );
          });

          if (filteredItems.length > 0) {
            // Calcular el promedio de las competencias con el mismo nombre y ciclo
            const competenciasMismoNombreCiclo = DashCompProy.filter((item) => {
              return (
                item.nomCompetencia === competencia &&
                item.cicloEvaluacion === ciclo
              );
            });

            const totalPorcentajes = competenciasMismoNombreCiclo.reduce(
              (total, item) => {
                return total + parseFloat(item.porcAprobRef);
              },
              0
            );

            porcentaje =
              totalPorcentajes / competenciasMismoNombreCiclo.length || 0;
          }
        } else if (tipoCargo === "COLABORADOR") {
          const filteredItems = DashCompProy.filter((item) => {
            return (
              item.nomCompetencia === competencia &&
              item.cicloEvaluacion === ciclo
            );
          });

          if (filteredItems.length > 0) {
            // Calcular el promedio de las competencias con el mismo nombre y ciclo
            const competenciasMismoNombreCiclo = DashCompProy.filter((item) => {
              return (
                item.nomCompetencia === competencia &&
                item.cicloEvaluacion === ciclo
              );
            });

            const totalPorcentajes = competenciasMismoNombreCiclo.reduce(
              (total, item) => {
                return total + parseFloat(item.porcAprobColab);
              },
              0
            );

            porcentaje = (
              totalPorcentajes / competenciasMismoNombreCiclo.length || 0
            ).toFixed(2);
          }
        }

        return porcentaje;
      });

      return {
        type: "line",
        label: competencia,
        data: data,
        backgroundColor: predefinedColors[index % predefinedColors.length],
        borderColor: predefinedColors[index % predefinedColors.length],
        pointRadius: 3,
        pointBorderColor: predefinedColors[index % predefinedColors.length],
        pointBackgroundColor: predefinedColors[index % predefinedColors.length],
      };
    });

    const data = {
      labels: ciclosConDatos, // Usar los ciclos en el eje X
      datasets: datasets,
    };

    const options = {
      responsive: true,
      animation: true,
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

    return <Line data={data} options={options} />;
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
        let porcentaje = 0;

        if (tipoCargo === "REFERENTE") {
          const filteredItems = DashCompProy.filter((item) => {
            return (
              item.nomCompetencia === competencia &&
              item.cicloEvaluacion === ciclo
            );
          });

          if (filteredItems.length > 0) {
            const competenciasMismoNombreCiclo = DashCompProy.filter((item) => {
              return (
                item.nomCompetencia === competencia &&
                item.cicloEvaluacion === ciclo
              );
            });

            const totalPorcentajes = competenciasMismoNombreCiclo.reduce(
              (total, item) => {
                return total + parseFloat(item.porcAprobRef);
              },
              0
            );

            porcentaje =
              totalPorcentajes / competenciasMismoNombreCiclo.length || 0;
          }
        } else if (tipoCargo === "COLABORADOR") {
          const filteredItems = DashCompProy.filter((item) => {
            return (
              item.nomCompetencia === competencia &&
              item.cicloEvaluacion === ciclo
            );
          });

          if (filteredItems.length > 0) {
            const competenciasMismoNombreCiclo = DashCompProy.filter((item) => {
              return (
                item.nomCompetencia === competencia &&
                item.cicloEvaluacion === ciclo
              );
            });

            const totalPorcentajes = competenciasMismoNombreCiclo.reduce(
              (total, item) => {
                return total + parseFloat(item.porcAprobColab);
              },
              0
            );

            porcentaje = (
              totalPorcentajes / competenciasMismoNombreCiclo.length || 0
            ).toFixed(2);
          }
        }

        return porcentaje;
      });

      return {
        type: "line",
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
      labels: competencias, // Usar las competencias en el eje X
      datasets: datasets,
    };

    const options = {
      responsive: true,
      animation: true,
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

    return <Line data={data} options={options} />;
  }


  function countCompetenciasPorCiclo() {
    if (cicloEvaluacion === "0") {
      const competenciasPorCiclo = DashCompProy.reduce((result, item) => {
        if (!result[item.cicloEvaluacion]) {
          result[item.cicloEvaluacion] = {
            competencias: new Set(),
            fechas: new Set(),
            referentes: new Set(),
            colaboradores: new Set(),
          };
        }
        result[item.cicloEvaluacion].competencias.add(item.nomCompetencia);
        result[item.cicloEvaluacion].fechas.add(item.epeFechaFin);
        result[item.cicloEvaluacion].referentes.add(item.cantReferentes);
        result[item.cicloEvaluacion].colaboradores.add(item.cantColaboradores);

        return result;
      }, {});

      let lastFormattedFecha = null;

      const infoCiclos = Object.entries(competenciasPorCiclo).map(
        ([cicloEvaluacion, data], index, array) => {
          const competencias = data.competencias.size;
          const fechas = [...data.fechas];
          const formattedFechasPorCiclo = [...new Set(fechas)];

          // Si la fecha es diferente de la fecha en el ciclo anterior, mostrarla, de lo contrario, mostrar un título invisible
          const shouldShowFecha =
            formattedFechasPorCiclo.join(", ") !== lastFormattedFecha;

          lastFormattedFecha = formattedFechasPorCiclo.join(", ");

          const referentes = [...data.referentes];
          const colaboradores = [...data.colaboradores];

          // Agregar <hr> solo si no es el último ciclo
          const separator = index < array.length - 1 ? <hr /> : null;

          return (
            <tr key={cicloEvaluacion} style={{ textAlign: "left" }}>
              <tr>
                {shouldShowFecha ? (
                  <h5>Fecha: {formattedFechasPorCiclo.join(", ")}</h5>
                ) : (
                  <h5 style={{ visibility: "hidden" }}>Fecha: 0000</h5>
                )}
              </tr>

              <tr>
                <div>
                  <td>
                    <h5>Ciclo: {cicloEvaluacion}</h5>
                  </td>
              <td className="linea">&nbsp;&nbsp;</td>

                  <td>
                    <h5>&nbsp;&nbsp;Competencias: {competencias}</h5>
                  </td>
              <td className="linea">&nbsp;&nbsp;</td>

                  <td>
                    {tipoCargo === "REFERENTE" ? (
                      <h5>&nbsp;&nbsp;Referentes: {referentes.join(",")}</h5>
                    ) : (
                      <h5>&nbsp;&nbsp;Colaboradores: {colaboradores.join(",")}</h5>
                    )}
                  </td>
                </div>
              </tr>
              {separator}
            </tr>
          );
        }
      );

      return (
        <table>
          <tbody>{infoCiclos}</tbody>
        </table>
      );
    } else {
      const competenciasPorCiclo = DashCompProy.filter(
        (item) => item.cicloEvaluacion === cicloEvaluacion
      ).map((item) => item.nomCompetencia);

      const competenciasUnicas = [...new Set(competenciasPorCiclo)];

      const fechasPorCiclo = DashCompProy.filter(
        (item) => item.cicloEvaluacion === cicloEvaluacion
      ).map((item) => item.epeFechaFin);

      const formattedFechasPorCiclo = [...new Set(fechasPorCiclo)];
      let referentesSet = new Set();
      let colaboradoresSet = new Set();

      DashCompProy.forEach((item) => {
        referentesSet.add(item.cantReferentes);
        colaboradoresSet.add(item.cantColaboradores);
      });

      let referentesArray = [...referentesSet];
      let colaboradoresArray = [...colaboradoresSet];

      return (
        <tr key={cicloEvaluacion}>
          <tr>
            <h5>Fecha: {formattedFechasPorCiclo.join(", ")}</h5>
          </tr>
          <tr>
            <td></td>
            <td>
              {" "}
              <h5>Ciclo: {cicloEvaluacion}&nbsp;&nbsp; </h5>
            </td>
            <td>
              <h5>Competencias: {competenciasUnicas.length}&nbsp;&nbsp;</h5>
            </td>
            <td>
              {tipoCargo === "REFERENTE" ? (
                <h5>Referentes: {referentesArray.join(", ")}&nbsp;&nbsp;</h5>
              ) : (
                <h5>Colaboradores: {colaboradoresArray.join(", ")}</h5>
              )}
            </td>
          </tr>
        </tr>
      );
    }
  }

  // ---------------------------------------------


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
      const totalCompetencias = competenciasPorCiclo.length;
      let sumaPorcAprob = 0;

      competenciasPorCiclo.forEach((competencia) => {
        const porcentajeAprobacion =
          tipoCargo === "REFERENTE"
            ? parseFloat(competencia.porcAprobRef)
            : tipoCargo === "COLABORADOR"
            ? parseFloat(competencia.porcAprobColab)
            : parseFloat(competencia.porcAprobComp);

        sumaPorcAprob += porcentajeAprobacion;
      });

      const promedioPorCiclo = sumaPorcAprob / totalCompetencias;
      promediosPorCiclo[ciclo] = promedioPorCiclo.toFixed(2);
    }

    return promediosPorCiclo;
  }

  function calcularDiferencias(promedios) {
    const diferencias = {};

    const ciclos = Object.keys(promedios);
    for (let i = 1; i < ciclos.length; i++) {
      const cicloActual = ciclos[i];
      const cicloAnterior = ciclos[i - 1];

      const promedioActual = parseFloat(promedios[cicloActual]);
      const promedioAnterior = parseFloat(promedios[cicloAnterior]);

      const diferencia = (promedioActual - promedioAnterior).toFixed(2);

      diferencias[cicloActual] = diferencia;
    }

    return diferencias;
  }

  function PromedioCompetenciasTabla({ datos }) {
    const promediosPorCiclo = calcularPromedioCompetencias(datos);
    const diferencias = calcularDiferencias(promediosPorCiclo);

    // const ref = useRef();

    return (
      <div
        className="progress-bars"
        style={{ textAlign: "left", width: "500px" }}
      >
        <h5>Promedio general de competencias por ciclo</h5>
        {Object.entries(promediosPorCiclo).map(([ciclo, promedio], index) => (
          
          <div key={index} style={{ marginTop: "10px" }}>
            <div className="ciclo">
              Ciclo: {ciclo}{" "}
              {diferencias[ciclo] !== undefined && (
                <span
                  className={`diferencia ${
                    diferencias[ciclo] > 0 ? "mejora" : "empeora"
                  }`}
                >
                  {diferencias[ciclo]}%{" "}
                  {diferencias[ciclo] > 0 ? <FaArrowUp /> : <FaArrowDown />}
                </span>
              )}
            </div>
            <ProgressBar now={promedio} label={`${promedio}%`} />
          </div>
        ))}
      </div>
    );
  }

  // ----------------------------------------

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <h2
        style={{
          background: "white",
          textAlign: "center",
          marginLeft: "10em",
          marginRight: "10em",
          borderRadius: "1em"
        }}
      >
        Dashboard Comparación ciclos de proyectos
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
              <tr>{countCompetenciasPorCiclo()}</tr>
              <tr>
                <PromedioCompetenciasTabla datos={DashCompProy} />
              </tr>
            </table>

            <table>
              <th>
                <div
                  className="bg-light mx-auto px-2 border "
                  style={{
                    width: "550px",
                    height: "370px",
                    marginTop: "10px",
                    alignItems: "center",
                    alignContent: "center",
                    borderRadius: "0px 0px 0px 30px"

                  }}
                >
                  <h4
                    style={{
                      textAlign: "center",
                    }}
                  >
                    Tendencia '% de aprobación' de competencias por ciclo
                  </h4>
                  {LineChart()}
                </div>
              </th>
              <th>
                <div
                  className="bg-light mx-auto px-2 border "
                  style={{
                    width: "550px",
                    height: "370px",
                    marginTop: "10px",
                    alignItems: "center",
                    alignContent: "center",
                    borderRadius: "0px 0px 30px 0px"
                  }}
                >
                  <h4
                    style={{
                      textAlign: "center",
                    }}
                  >
                    Tendencia '% de aprobación' de ciclos por competencia
                  </h4>
                  {LineChartInvertido()}
                </div>
              </th>
            </table>
          </td>
        </tr>
      </table>

      <br></br>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
