import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillKeyFill, BsFillTrashFill } from "react-icons/bs";
import { AiFillBook } from "react-icons/ai";

import "../TablasStyles.css";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function FormularioEvaluacion() {
  const [, params] = useRoute("/listadoRespPregEvaluaciones/:params");

  const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState([""]);
  const [idEDDEvalNomPregunta, setidEDDEvalNomPregunta] = useState([""]);

  const [idEDDEvaluacion, setidEDDEvaluacion] = useState(params.params);

  const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  function obtenerEDDEvaluacion() {
    const url = "pages/auxiliares/listadoEddEvaluacion.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvaluacion(response)
    );
  }

  useEffect(
    function () {
      handleChangePaginador();
      obtenerEDDEvaluacion();
    },
    [idEDDEvaluacion]
  );

  //---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoRespPregEvaluaciones.php";
    var operationUrl = "listadoRespPregEvaluaciones";
    var data = {
      idEvaluacion: idEDDEvaluacion,
    };
    console.log(userData.nomRol);
    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      setidEDDEvalPregunta(data);
      // console.log(data);
      //   const result = data.reduce((acc, item)=>{
      //     if(!acc.includes(item.nomPregunta)){
      //     acc.push(item.nomPregunta)
      //     }
      //     return acc;
      // },[])
      // setidEDDEvalNomPregunta(result);
    });
  }

  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <Container id="fondoTabla">
        <h1>Formulario de evaluación</h1>
        <Table>
          {/* <tbody> */}
          {idEDDEvalPregunta.map((idEDDEvalPregunta) => (
            <tr key={idEDDEvalPregunta.idEDDEvalPregunta}>
              <td>
                {idEDDEvalPregunta.ordenPregunta}.
                {idEDDEvalPregunta.nomPregunta}
                {idEDDEvalPregunta.nomCompetencia} -
                {idEDDEvalPregunta.preguntaObligatoria === 1 ? '*' : ''}
              </td>
            </tr>
          ))}
          {/* {idEDDEvalNomPregunta.map((item) =>(
                <tr>
                    <td>{item}</td>
                </tr>
                ))} */}

          {/* <tbody>
                {listEDDEvalPregunta.map((item) => {
                <tr key={item.idEDDevalPregunta}>
                    <td>
                        {item.ordenPregunta}.{item.nomPregunta}{item.nomCompetencia}
                        <table id="respuestas">
                            {
                            if(item.tipoResp === "T"){                            
                            }
                            }
                        </table>
                    </td>
                </tr>
                })}
        </tbody> */}
        </Table>
      </Container>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
