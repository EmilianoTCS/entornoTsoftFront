import React, { useEffect, useState } from "react";
import Header from "../../../templates/Header/Header";
import SendDataService from "../../../services/SendDataService";
import Card from "react-bootstrap/Card";
import { Navigate, useParams } from "react-router-dom";
import "./homeEDD.css";
import "./GraficosDashboard";
// import { useParams } from "wouter";

export default function ComentariosDashboard() {
  // const [, params] = useRoute(
  //     "ComentariosDashboard/:idEvaluacion/:nomEvaluacion/:idEDDProyecto/:cicloEvaluacion"
  //   );
  //   const params = useParams()

//   const idEDDEvaluacion = params.idEvaluacion;
//   const idEDDProyecto = params.idEDDProyecto;

//   const nomEvaluacion = decodeURI(params.nomEvaluacion);

    const {idEvaluacion, idEDDProyecto, nomEvaluacion, cicloEvaluacion} = useParams()


  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [listComentEval, setListComentEval] = useState("");

  const [loadedDataComentEval, setLoadedDataComentEval] = useState(false);


  function GetDataComentEval() {
    var url = "pages/listados/listadoComentariosEval.php";
    var operationUrl = "listadoComentariosEval";
    var data = {
      idEvaluacion: idEvaluacion,
      idProyecto: idEDDProyecto,
      cicloEvaluacion: cicloEvaluacion
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListComentEval(data);
      setLoadedDataComentEval(true);
    });
  }

  function Comentarios() {
    var render = [];

    listComentEval.forEach((item, index) => {
      render.push(
        <Card className="cardColumnComentario" key={index}>
          <Card.Body>
            <Card.Title>
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: "150px" }}>
                      <strong>{item.nomEvaluado.toUpperCase()}</strong>
                    </td>
                    <td align="justify" valign="top">
                      {item.respuesta}
                    </td>
                  </tr>
                  <tr>
                    <td className="nomEvaluadorCell">{item.nomEvaluador}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Title>
          </Card.Body>
        </Card>
      );
    });

    if (listComentEval[0].codResp !== "00") {
      return (
        <>
          <Card className="cardColumnComentario">
            <Card.Body>
              <Card.Title>NO HAY COMENTARIOS DISPONIBLES</Card.Title>
            </Card.Body>
          </Card>
        </>
      );
    } else {
      return <div className="cardContainerComentario">{render}</div>;
    }
  }

  function CompetenciasResumen() {
    if (loadedDataComentEval) {
      return (
        <div>
          <Comentarios></Comentarios>
        </div>
      );
    } else {
      return <h1>Loading</h1>;
    }
  }

  useEffect(
    function () {
      GetDataComentEval();
    },
    [idEvaluacion, nomEvaluacion, idEDDProyecto]
  );

  return userData.statusConected || userData !== null ? (
    <div>
      <Header></Header>
      <a
        type="submit"
        id="btnAtrasEvaluacion"
        value="Registrar"
        href="/listadoEddEvalProyEmp/0"
      >
        Volver
      </a>
      <h4 id="title">COMENTARIOS DESTACADOS EVALUADORES</h4>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "2%",
        }}
      >
        {/* segun cuantos referentes sean mostrar informacion de sus competencias por columna */}
        <CompetenciasResumen></CompetenciasResumen>
      </div>
    </div>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
