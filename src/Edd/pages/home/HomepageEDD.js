import React, { useEffect, useState } from "react";
import Header from "../../../templates/Header/Header";
import SendDataService from "../../../services/SendDataService";
import Card from "react-bootstrap/Card";
import { Navigate } from "react-router-dom";
import "./homeEDD.css";
import { Button } from "bootstrap";
import "./GraficosDashboard"
import { Link } from "react-router-dom";
import { ImBook } from "react-icons/im";

export default function HomePageEDD() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [listResumenEval, setListResumenEval] = useState("");
  const [listCompetencias, setListCompetencias] = useState("");
  const [listConfigCompColorFlechas, setListConfigCompColorFlechas] =
    useState("");
  const [listConfigCompRangoFlechas, setListConfigCompRangoFlechas] =
    useState("");

  const [loadedDataResumenEval, setLoadedDataResumenEval] = useState(false);
  const [loadedDataCompetencias, setLoadedDataCompetencias] = useState(false);
  const [loadedDataRango, setLoadedDataRango] = useState(false);
  const [loadedDataColor, setLoadedDataColor] = useState(false);

  function GetDataResumenEval() {
    var url = "pages/listados/listadoResumenEval.php";
    var operationUrl = "listadoResumenEval";
    var data = {
      idEvaluacion: 1,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListResumenEval(data);
      setLoadedDataResumenEval(true);
    });
  }

  function GetDataCompetencias() {
    var url = "pages/listados/listadoCompetenciasEval.php";
    var operationUrl = "listadoCompetenciasEval";
    var data = {
      idEvaluacion: 1,
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

  var varRango = "";
  var varColor = "";

  // function test() {
  //   var auxRango = "0";
  //   var auxColor = "0";
  //   var varRango = "";
  //   var varColor = "";
  //   let listColor = listConfigCompColorFlechas.map((orden) => orden).reverse();
  //   let listRango = listConfigCompRangoFlechas.map((orden) => orden).reverse();

  //   listColor.map((color) => {
  //     if (auxRango === "0") {
  //       if (eval(porcAprobComp, color.datoNoVisible)) {
  //         varColor = color.datoVisible;
  //         auxColor = "1";
  //       }
  //     }
  //   });

  //   listRango.map((rango) => {
  //     if (auxRango === "0") {
  //       if (eval(porcAprobComp, rango.datoNoVisible)) {
  //         varRango = rango.datoVisible;
  //         auxRango = "1";
  //       }
  //     }
  //   });
  // }

  function ArrowsTemplate({ porcAprobComp }) {
    var auxRango = "0"; //posiciones
    var auxColor = "0"; //posiciones
    var varRango = ""; //arriba / abajo /dato visible
    var varColor = ""; //color /dato visible
    let listColor = listConfigCompColorFlechas.map((orden) => orden).reverse();
    let listRango = listConfigCompRangoFlechas.map((orden) => orden).reverse();

    listRango.map((rango) => {
      if (auxRango === "0") {
        console.log("result", eval(porcAprobComp + rango.datoNoVisible), porcAprobComp, rango.datoNoVisible);
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

  function CompetenciasResumen() {
    if (loadedDataCompetencias) {
      return (
        <div id="bodyContainer">
          <div id="container_cardsCompResumen">
            {listCompetencias.map((item) => (
              <Card>
                <Card.Body className="cardBody">
                  <Card.Title
                    style={{ display: "flex", justifyContent: "space-between", textTransform: 'uppercase' }}
                  >
                    {item.nomCompetencia}

                    <div style={{ fontSize: "15pt", alignItems: "center" }}>
                      <ArrowsTemplate porcAprobComp={item.porcAprobComp} />
                      {item.porcAprobComp} %
                    </div>
                  </Card.Title>
                </Card.Body>
              </Card>
            ))}
          </div>
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
                <Card.Text className="cardText">Evaluadores</Card.Text>
                <Card.Title className="cardTitle">
                  {listResumenEval[0].cantEvaluadoresTsoft}
                </Card.Title>
                <Card.Text className="cardText">Tsoft</Card.Text>
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
                <Card.Text className="cardText">Satisfacción</Card.Text>
                <Card.Title className="cardTitle">
                  {listResumenEval[0].porcSatisfaccion}
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
                <Card.Text className="cardText">Tiempo</Card.Text>
                <Card.Title className="cardTitle">
                  {listResumenEval[0].tiempoPromedio}
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
    },
    [loadedDataCompetencias, loadedDataResumenEval, loadedDataRango, loadedDataColor]
  );

  return userData.statusConected || userData !== null ? (
    <div>
      <Header></Header>
      <Link to="/GraficosDashboard">
        <button id="submenuSidebar">
          <ImBook id="icons" />
          Gráficos Dashboard
        </button>
      </Link>
      <BodyResumen></BodyResumen>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "2%",
        }}
      >
        <CompetenciasResumen></CompetenciasResumen>
        <CompetenciasResumen></CompetenciasResumen>

        {/* <BodyResumen2 style={{ marginBottom: '100px' }}></BodyResumen2>
          <InfoExag2></InfoExag2> */}

      </div>




    </div>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
