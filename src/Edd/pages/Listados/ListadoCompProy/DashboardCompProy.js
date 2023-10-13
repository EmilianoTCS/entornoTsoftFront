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
import queryString from 'query-string';

const DashboardCompProy = ({ location }) => {
  const parsed = queryString.parse(location.search);
  const selectedClients = parsed.selectedClients;
  const selectedServicio = parsed.selectedServicio;
  const selectedProyecto = parsed.selectedProyecto;
  const tipoComparacion = parsed.tipoComparacion;
  const tipoCargo = parsed.tipoCargo;
  const fechaIni = parsed.fechaIni;
  const fechaFin = parsed.fechaFin;

  // Haz lo que necesites con los valores
  console.log("selectedClients:", selectedClients);
  console.log("selectedServicio:", selectedServicio);
  // ...

  return (
    <div>
      {/* Contenido de tu componente */}
    </div>
  );
};

export default DashboardCompProy;





