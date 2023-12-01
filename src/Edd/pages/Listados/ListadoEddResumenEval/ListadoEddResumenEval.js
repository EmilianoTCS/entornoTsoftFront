import React, { useState, useEffect } from "react";
import Header from "../../../../templates/Header/Header";
import SendDataService from "../../../../services/SendDataService";
import getDataService from "../../../../services/GetDataService";

export default function ListadoEddResumenEval() {

   //Declaración de variables 
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [listEddResumenEval, setListEddResumenEval] = useState()
  const [idCliente, setidCliente] = useState()
  const [idServicio, setidServicio] = useState()
  const [idProyecto, setidProyecto] = useState()
  const [cicloEvaluacion, setcicloEvaluacion] = useState()
  const [fechaIni, setFechaIni] = useState()
  const [fechaFin, setFechaFin] = useState()


  
}
