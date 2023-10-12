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

export default function DashboardCompProy() {
    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
  
  const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Esto centra verticalmente en la pantalla
  };
  
  const LoadingIcon = () => {
    return (
      <div style={centerStyle}>
        <div className="loading-icon">
          <ClipLoader color={'#000'} loading={true} css={override} size={50} />
        </div>
      </div>
    );
  };
    //PAGINADOR ---------------------

    return userData.statusConected || userData !== null ? (
        <>
            <Header></Header>
            <LoadingIcon></LoadingIcon>
        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );
}
