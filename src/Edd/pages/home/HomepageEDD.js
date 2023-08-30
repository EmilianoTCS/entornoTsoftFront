import React, { useEffect, useState } from "react";
import Header from "../../../templates/Header/Header";
import SendDataService from "../../../services/SendDataService";
import Card from "react-bootstrap/Card";
import { Navigate } from "react-router-dom";
import "./homeEDD.css";
import "./GraficosDashboard"
import { Link } from "react-router-dom";
import { ImBook } from "react-icons/im";
import { Container } from 'react-bootstrap';
import { useRoute } from "wouter";

export default function HomePageEDD() {
  const [, params] = useRoute("/homePageEDD/:idEvaluacion/:nomEvaluacion");

  const idEDDEvaluacion = params.idEvaluacion;
  const nomEvaluacion = decodeURI(params.nomEvaluacion);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [listResumenEval, setListResumenEval] = useState("");
  const [listCompetencias, setListCompetencias] = useState("");
  const [listConfigCompColorFlechas, setListConfigCompColorFlechas] =
    useState("");
  const [listConfigCompRangoFlechas, setListConfigCompRangoFlechas] =
    useState("");
  const [listConfigCompRangoLeyenda, setListConfigCompRangoLeyenda] =
    useState("");

  const [loadedDataResumenEval, setLoadedDataResumenEval] = useState(false);
  const [loadedDataCompetencias, setLoadedDataCompetencias] = useState(false);
  const [loadedDataRango, setLoadedDataRango] = useState(false);
  const [loadedDataColor, setLoadedDataColor] = useState(false);
  const [loadedDataLeyenda, setLoadedDataLeyenda] = useState(false);

  function GetConfigCompRangoLeyenda() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "competencia",
      subTipoConfDato: "RANGO_LEYENDA",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigCompRangoLeyenda(data);
      // console.log("configRango", data);
      setLoadedDataLeyenda(true)
    });
  }
  function GetDataResumenEval() {
    var url = "pages/listados/listadoResumenEval.php";
    var operationUrl = "listadoResumenEval";
    var data = {
      idEvaluacion: idEDDEvaluacion,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListResumenEval(data);
      setLoadedDataResumenEval(true);
      // console.log(data);
    });
  }

  function GetDataCompetencias() {
    var url = "pages/listados/listadoCompetenciasEval.php";
    var operationUrl = "listadoCompetenciasEval";
    var data = {
      idEvaluacion: idEDDEvaluacion,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListCompetencias(data);
      setLoadedDataCompetencias(true);
    });
  }

  function GetConfigCompColorFlechas() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "competencia",
      subTipoConfDato: "RANGO_COLOR",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigCompColorFlechas(data);
      setLoadedDataColor(true)
      // console.log("configColor", data);
    });
  }

  function GetConfigCompRangoFlechas() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "competencia",
      subTipoConfDato: "RANGO_FLECHA",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigCompRangoFlechas(data);
      // console.log("configRango", data);
      setLoadedDataRango(true)
    });
  }


  function ArrowsTemplate({ porcAprobComp }) {
    var auxRango = "0"; //posiciones
    var auxColor = "0"; //posiciones
    var varRango = ""; //arriba / abajo /dato visible
    var varColor = ""; //color /dato visible
    let listColor = listConfigCompColorFlechas.map((orden) => orden).reverse();
    let listRango = listConfigCompRangoFlechas.map((orden) => orden).reverse();

    listRango.map((rango) => {
      if (auxRango === "0") {
        // console.log("result", eval(porcAprobComp + rango.datoNoVisible), porcAprobComp, rango.datoNoVisible);
        if (eval(porcAprobComp + rango.datoNoVisible)) {  // eval(30 + > 80) --> eval 30 >= 80
          varRango = rango.datoVisible;
          auxRango = "1";
        }
      }
    });

    listColor.map((color1) => {
      if (auxColor === "0") {
        if (eval(porcAprobComp + color1.datoNoVisible)) {
          varColor = color1.datoVisible;
          auxColor = "1";
        }
      };
    });



    return (
      <>
        <div
          style={
            varRango === "ARRIBA"
              ? {
                borderColor: `transparent transparent ${varColor} transparent`,
              }
              : {
                borderColor: `${varColor} transparent transparent  transparent`,
              }
          }
          className={varRango === "ARRIBA" ? "flechaArriba" : "flechaAbajo"}
        >
        </div>
      </>
    );
  }

  function InfoArrows() {
    if (loadedDataLeyenda) {
      const tableRows = [];
      const uniqueDatoNoVisibleValues = new Set();
  
      listConfigCompRangoLeyenda.forEach((ley) => {
        uniqueDatoNoVisibleValues.add(ley.datoNoVisible);
      });
  
      listConfigCompRangoFlechas.forEach((rango) => {
        uniqueDatoNoVisibleValues.add(rango.datoNoVisible);
      });
  
      listConfigCompColorFlechas.forEach((color) => {
        uniqueDatoNoVisibleValues.add(color.datoNoVisible);
      });
  
      uniqueDatoNoVisibleValues.forEach((datoNoVisible) => {
        const matchingLey = listConfigCompRangoLeyenda.find(ley => ley.datoNoVisible === datoNoVisible);
        const matchingRango = listConfigCompRangoFlechas.find(rango => rango.datoNoVisible === datoNoVisible);
        const matchingColor = listConfigCompColorFlechas.find(color => color.datoNoVisible === datoNoVisible);
  
        if (matchingLey && matchingRango && matchingColor) {
          tableRows.push(
            <tr>
              <td>
                <div
                  style={
                    matchingRango.datoVisible === "ARRIBA"
                      ? {
                        borderColor: `transparent transparent ${matchingColor.datoVisible} transparent`,
                      }
                      : {
                        borderColor: `${matchingColor.datoVisible} transparent transparent transparent`,
                      }
                  }
                  className={matchingRango.datoVisible === "ARRIBA" ? "flechaArriba" : "flechaAbajo"}
                />
              </td>
              <td style={{ fontSize: '13px', padding: '7px' }}>
                {matchingLey.datoVisible}
              </td>
            </tr>
          );
        }
      });
  
      return (
        <div id="bodyContainer">
          <div id="container_cardsCompResumen" style={{ width: '13%' }}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <table>
                    <tbody>
                      {tableRows}
                    </tbody>
                  </table>
                </Card.Title>
              </Card.Body>
            </Card>
          </div>
        </div>
      );
    }
  }

  function Porcentajes() {
    var list_eval_comp_porc = {};
    var total_porcentajes = {};
    var cantidad_comp_por_empleado = {};
    var result_list = {}

    // Iterate through the listCompetencias array
    for (const item of Object.values(listCompetencias)) {
      if (item.nomEmpleado in list_eval_comp_porc) {
        if (item.nomCompetencia in list_eval_comp_porc[item.nomEmpleado]) {
          list_eval_comp_porc[item.nomEmpleado][item.nomCompetencia].push(item.porcAprobComp);
        } else {
          list_eval_comp_porc[item.nomEmpleado][item.nomCompetencia] = [item.porcAprobComp];
        }
      } else {
        list_eval_comp_porc[item.nomEmpleado] = {
          [item.nomCompetencia]: [item.porcAprobComp]
        };
      }
    }

    const render = [];

    for (const [key, value] of Object.entries(list_eval_comp_porc)) {
      total_porcentajes[key] = 0;
      cantidad_comp_por_empleado[key] = Object.keys(value).length;
      result_list[key] = {};

      const empleadoRows = [];
      const empleadoRows2 = [];


      for (const [key1, value1] of Object.entries(value)) {
        const suma = value1.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0) / value1.length;
        result_list[key][key1] = suma;

        total_porcentajes[key] += suma;

        empleadoRows.push(
          <tr key={key1} >

            <td style={{
              paddingBottom: '1.2em'
            }}> {key1}</td>

            <td style={{
              paddingBottom: '1.2em'
            }}>
              <ArrowsTemplate porcAprobComp={suma} />
              {suma.toFixed(2)} %
            </td>
          </tr>
        );
      }

      empleadoRows2.push(
        <tr key="Total">
          <td style={{ fontSize: '30px' }}>REFERENTE: <br></br><strong >{key.toUpperCase()}</strong></td>

          <td >
            <ArrowsTemplate porcAprobComp={total_porcentajes[key] / cantidad_comp_por_empleado[key]} />
            {((total_porcentajes[key] / cantidad_comp_por_empleado[key])).toFixed(2)} %
          </td>
        </tr>
      );

      render.push(

        <Card className="cardColumn" >
          <Card.Body>
            <Card.Title>
              <table style={{ width: '25em' }}>
                {empleadoRows2}
                <hr></hr>
                <tbody >{empleadoRows}</tbody>
              </table>
            </Card.Title>
          </Card.Body>
        </Card>
      );
    }

    return (
      <div className="cardContainer">
        {render}
      </div>
    );
  }

  function CompetenciasResumen() {
    if (loadedDataCompetencias) {
      return (
        <div >

          <Porcentajes></Porcentajes>
          {/* {listCompetencias.map((item) => (
              <Card>
                <Card.Body className="cardBody1">
                  <Card.Title
                    style={{ display: "flex", justifyContent: "space-between", textTransform: 'uppercase' }}
                  >
                    <div class="container">
                      <div class="row">
                        <div class="col cardBody1">
                          
                          {item.nomCompetencia}
                        </div>

                        <div class="col-4">
                          <div style={{ fontSize: "15pt", alignItems: "left" }}>
                            <ArrowsTemplate porcAprobComp={item.porcAprobComp} />
                            {item.porcAprobComp} %
                          </div>
                        </div>
                      </div>
                    </div>

                  </Card.Title>
                </Card.Body>
              </Card>
            ))} */}

        </div>
      );
    } else {
      return <h1>Loading</h1>;
    }
  }

  function BodyResumen() {
    if (loadedDataResumenEval) {
      return (
        <div id="bodyContainer">
          <div id="container_cardsEDD">
            <Card>
              <Card.Body className="cardBody">
                <Card.Text className="cardText">Satisfacción</Card.Text>
                <Card.Title className="cardTitle">
                  {listResumenEval[0].porcSatisfaccion}%
                </Card.Title>
                <Card.Text className="cardText">General</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="cardBody">
                <Card.Text className="cardText">Referentes</Card.Text>
                <Card.Title className="cardTitle">
                  {listResumenEval[0].referentesEvaluados}
                </Card.Title>
                <Card.Text className="cardText">Evaluados</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="cardBody">
                <Card.Text className="cardText">Competencias</Card.Text>
                <Card.Title className="cardTitle">
                  {listResumenEval[0].competenciasEvaluadas}
                </Card.Title>
                <Card.Text className="cardText">Evaluadas</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="cardBody">
                <Card.Text className="cardText">Evaluadores</Card.Text>
                <Card.Title className="cardTitle">
                  {listResumenEval[0].cantEvaluadoresTsoft}
                </Card.Title>
                <Card.Text className="cardText">Tsoft</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="cardBody">
                <Card.Text className="cardText">Tiempo</Card.Text>
                <Card.Title className="cardTitle">
                  <span>{listResumenEval[0].tiempoPromedio}</span>
                  <p className="porcentajeCard">min</p>
                </Card.Title>
                <Card.Text className="cardText">Promedio</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      );
    } else {
      return <h1>Loading</h1>;
    }
  }


  useEffect(
    function () {
      GetDataResumenEval();
      GetDataCompetencias();
      GetConfigCompColorFlechas();
      GetConfigCompRangoFlechas();
      GetConfigCompRangoLeyenda()
    },
    [loadedDataCompetencias, loadedDataResumenEval, loadedDataRango, loadedDataColor, loadedDataLeyenda,idEDDEvaluacion,nomEvaluacion]
  );

  return userData.statusConected || userData !== null ? (
    <div>

      <Header></Header>
      <h4 style={{ color: 'white' }}>Resumen evaluación : {nomEvaluacion}</h4>


      <BodyResumen></BodyResumen>
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

      <InfoArrows></InfoArrows>
    </div>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
