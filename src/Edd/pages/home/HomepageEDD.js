import React, { useEffect, useState } from "react";
import Header from "../../../templates/Header/Header";
import SendDataService from "../../../services/SendDataService";
import Card from "react-bootstrap/Card";
import { Navigate } from "react-router-dom";
import "./homeEDD.css";
import "../DiseñoDashboard/DiseñoDash.css";
import "../Listados/BtnInsertar.css";
import "./GraficosDashboard"
import { Link } from "react-router-dom";
import { ImBook } from "react-icons/im";
import { Container, Table } from 'react-bootstrap';
import { useRoute } from "wouter";
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import RadialSeparators from "./RadialSeparators";
import faceVerde1 from "../Smileys/faceVerde1.png"
import faceVerdeLima2 from "../Smileys/faceVerdeLima2.png"
import faceAmarillo3 from "../Smileys/faceAmarillo3.png"
import faceNaranja4 from "../Smileys/faceNaranja4.png"
import faceRojo5 from "../Smileys/faceRojo5.png"
import ProgressBar from 'react-bootstrap/ProgressBar';

export default function HomePageEDD() {
  const [, params] = useRoute("/homePageEDD/:idEvaluacion/:nomEvaluacion/:idEDDProyecto");

  const idEDDEvaluacion = params.idEvaluacion;
  const nomEvaluacion = decodeURI(params.nomEvaluacion);
  const idEDDProyecto = params.idEDDProyecto;


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
      idProyecto: idEDDProyecto,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      setListResumenEval(data);
      setLoadedDataResumenEval(true);
      console.log('Response', data);
    });
  }

  function GetDataCompetencias() {
    var url = "pages/listados/listadoCompetenciasEval.php";
    var operationUrl = "listadoCompetenciasEval";
    var data = {
      idEvaluacion: idEDDEvaluacion,
      idProyecto: idEDDProyecto,

    };
    // console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      setListCompetencias(data);
      setLoadedDataCompetencias(true);
      // console.log(data);
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
    if (loadedDataColor && loadedDataRango) {


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
          {/* <div
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
          </div> */}
        </>
      );
    }
  }

  function InfoArrows() {
    if (loadedDataLeyenda && loadedDataColor && loadedDataRango) {
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
              <td style={{ fontSize: '13px', padding: '8px' }}>
                {matchingLey.datoVisible}
              </td>
            </tr>
          );
        }
      });

      return (
        <div >
          <div id="container_cardsCompResumen" style={{ width: '13%' }}>
            <Card style={{ marginTop: '2.9em' }}>
              <Card.Body >
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

  // function Porcentajes() {
  //   var list_eval_comp_porc = {};
  //   var total_porcentajes = {};
  //   var cantidad_comp_por_empleado = {};
  //   var result_list = {};
  //   var contador = 0;

  //   // Iterate through the listCompetencias array
  //   for (const item of Object.values(listCompetencias)) {
  //     if (item.nomEmpleado in list_eval_comp_porc) {
  //       if (item.nomCompetencia in list_eval_comp_porc[item.nomEmpleado]) {
  //         list_eval_comp_porc[item.nomEmpleado][item.nomCompetencia].push(item.porcAprobComp);
  //       } else {
  //         list_eval_comp_porc[item.nomEmpleado][item.nomCompetencia] = [item.porcAprobComp];
  //       }
  //     } else {
  //       list_eval_comp_porc[item.nomEmpleado] = {
  //         [item.nomCompetencia]: [item.porcAprobComp]
  //       };
  //     }
  //   }

  //   const render = [];

  //   for (const [key, value] of Object.entries(list_eval_comp_porc)) {
  //     total_porcentajes[key] = 0;
  //     cantidad_comp_por_empleado[key] = Object.keys(value).length;
  //     result_list[key] = {};

  //     const empleadoRows = [];
  //     const empleadoRows2 = [];

  //     for (const [key1, value1] of Object.entries(value)) {
  //       const suma = value1.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0) / value1.length;
  //       result_list[key][key1] = suma;

  //       total_porcentajes[key] += suma;

  //       empleadoRows.push(
  //         <tr key={key1} >

  //           <td style={{
  //             paddingBottom: '1.2em'
  //           }}> {key1}</td>

  //           <td style={{
  //             paddingBottom: '1.2em'
  //           }}>
  //             <ArrowsTemplate porcAprobComp={suma} />
  //             {suma.toFixed(2)} %
  //           </td>
  //         </tr>
  //       );
  //     }

  //     empleadoRows2.push(
  //       <tr key="Total">
  //         <td style={{ fontSize: '30px' }}>REFERENTE: <br></br><strong >{key.toUpperCase()}</strong></td>

  //         <td >
  //           <ArrowsTemplate porcAprobComp={total_porcentajes[key] / cantidad_comp_por_empleado[key]} />
  //           {((total_porcentajes[key] / cantidad_comp_por_empleado[key])).toFixed(2)} %
  //         </td>
  //       </tr>
  //     );

  //     render.push(
  //       <div>
  //         <Card className="cardColumn" >
  //           <Card.Body>
  //             <Card.Title>
  //               <table style={{ width: '20em' }}>
  //                 {empleadoRows2}
  //                 <hr></hr>
  //                 <tbody >{empleadoRows}</tbody>
  //               </table>
  //             </Card.Title>
  //           </Card.Body>
  //         </Card>
  //       </div>
  //     );
  //     contador += 1;
  //   }

  //   if (contador !== 1) {
  //     return (
  //       <div className="cardContainer">
  //         {render}
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div className="cardContainer1Solo">
  //         {render}
  //       </div>
  //     );
  //   }

  // }

  function Porcentajes() {
    var list_eval_comp_porc = {};
    var total_porcentajes = {};
    var cantidad_comp_por_empleado = {};
    var result_list = {};
    var contador = 0;

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
      console.log('InfoList',result_list);

      for (const [key1, value1] of Object.entries(value)) {

        const suma = value1.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0) / value1.length;

        result_list[key][key1] = suma;

        total_porcentajes[key] += suma;

        empleadoRows.push(
          <tr >

            <td style={{ paddingLeft: '1em' }}>{key1} </td>
            <td> <ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={suma} label={`${suma.toFixed(2)}%`} /></td>
            <td ><img id="faceStyleReferenteTodas"></img></td>

            <td>
              <ArrowsTemplate porcAprobComp={suma} />
              <img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
            </td>
          </tr>
        );
      }

      empleadoRows2.push(
        <tr >

          <th style={{ paddingLeft: '1em',width:'12em',height: '50px' }}>{key.toUpperCase()} </th>
          <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={((total_porcentajes[key] / cantidad_comp_por_empleado[key]))} label={`${((total_porcentajes[key] / cantidad_comp_por_empleado[key])).toFixed(2)}%`} /></td>
          <td ><img id="faceStyleReferenteTodas" ></img></td>



          <td >
            <ArrowsTemplate porcAprobComp={total_porcentajes[key] / cantidad_comp_por_empleado[key]} />
            <img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
          </td>


        </tr>
      );

      render.push(
        <table id="table" responsive>
          <tr>
            <td >
              <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                <thead>
                  <tr>

                    <th style={{ paddingLeft: '0.8em', fontSize: '15pt' }} >REFERENTE</th>

                  </tr>
                </thead>
                <tbody >
                  <tr>
                  <tr style={{ borderBottom: '2px #808080 solid' }}>
                      {empleadoRows2}
                    </tr>

                    <tr >
                      {empleadoRows}
                    </tr>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

        </table>



        // <div>
        //   <Card className="cardColumn" >
        //     <Card.Body>
        //       <Card.Title>
        //         <table style={{ width: '20em' }}>
        //           {empleadoRows2}
        //           <hr></hr>
        //           <tbody >{empleadoRows}</tbody>
        //         </table>
        //       </Card.Title>
        //     </Card.Body>
        //   </Card>
        // </div>
        // <td >
        //     <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
        //         <thead>
        //             <tr>
        //                 <th style={{ paddingLeft: '0.8em',fontSize:'15pt' }} >{empleadoRows2}</th>
        //             </tr>
        //         </thead>
        //         <tbody >
        //             <tr style={{ borderBottom: '2px #808080 solid' }}>
        //                 <th style={{ height: '50px', paddingLeft: '1em' }}>MARCELO CORTES ORTEGA </th>
        //                 <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={71} label={`${71}%`} /></td>
        //                 <td ><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>{empleadoRows}</td>
        //             </tr>
        //         </tbody>
        //     </table>
        // </td>
      );
      contador += 1;
    }

    if (contador !== 1) {
      return (
        <div className="cardContainer">
          {render}
        </div>
      );
    } else {
      return (
        <div className="cardContainer1Solo">
          {render}
        </div>
      );
    }

  }

  function CompetenciasResumen() {
    if (loadedDataCompetencias) {
      return (
        <div>
          <div>
            <br></br>

            <table style={{ backgroundColor: 'white', width: '50%', borderRadius: '20px', margin: 'auto' }}>

              <td id="infoLinePorcLeyendasREFERENTE">
                <b>EXCELENTE</b>
              </td>

              <td className="linea">
                <img id="sizeCaritasReferentes" src={faceVerde1}></img>
              </td>

              <td id="infoLinePorcLeyendasREFERENTE">
                <b>OPORTUNIDAD DE MEJORA</b>
              </td>
              <td className="linea">
                <img id="sizeCaritasReferentes" src={faceVerdeLima2}></img>
              </td>

              <td id="infoLinePorcLeyendasREFERENTE">
                <b>REQUIERE ATENCIÓN
                </b>
              </td>
              <td className="linea">
                <img id="sizeCaritasReferentes" src={faceAmarillo3}></img>
              </td>

              <td id="infoLinePorcLeyendasREFERENTE">
                <b>REVISAR SITUACIÓN</b>


              </td>
              <td className="linea">
                <img id="sizeCaritasReferentes" src={faceNaranja4}></img>
              </td>

              <td id="infoLinePorcLeyendasREFERENTE">
                <b>ALERTA</b>
              </td>
              <td >
                <img id="sizeCaritasReferentes" src={faceRojo5}></img>
              </td>

            </table>
            <br></br>
            {/* <InfoArrows></InfoArrows> */}
          </div>
          <div>
            <Porcentajes></Porcentajes>
          </div>
        </div>
      );
    } else {
      return <h1>Loading</h1>;
    }
  }

  function BodyResumen() {

    const tiempProm = 4.83;
    if (loadedDataResumenEval) {
      return (
        <div id="tableResumen">
          <Table>

            <tr >
              <td >
                <CircularProgressbarWithChildren
                  value={listResumenEval[0].porcSatisfaccion}
                  background


                  // text={`${80}%`}
                  strokeWidth={10}
                  styles={buildStyles({
                    strokeLinecap: 'butt',
                    pathColor: "#94FF01",
                    trailColor: "#E5E7E9",
                    backgroundColor: 'white',


                  })}
                >

                  <div style={{ fontSize: 20, textAlign: 'center' }}>
                    <strong>Satisfacción</strong>
                    <br></br>
                    <strong> {listResumenEval[0].porcSatisfaccion}%</strong>
                    <br></br>
                    <strong>General</strong>
                  </div>
                  <RadialSeparators
                    count={10}
                    style={{

                      background: "#fff",
                      width: "2px",
                      // This needs to be equal to props.strokeWidth
                      height: `${10}%`
                    }}
                  />
                </CircularProgressbarWithChildren>
              </td>
              <td>
                <CircularProgressbarWithChildren
                  value={listResumenEval[0].referentesEvaluados}
                  background
                  // text={`${80}%`}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: "#FFE700",
                    trailColor: "#E5E7E9",
                    strokeLinecap: 'butt',
                    backgroundColor: 'white'
                  })}
                >
                  <div style={{ fontSize: 20, textAlign: 'center' }}>
                    <strong>Referentes</strong>
                    <br></br>
                    <strong>{listResumenEval[0].referentesEvaluados}</strong>
                    <br></br>
                    <strong>Evaluadores</strong>
                  </div>
                  <RadialSeparators
                    count={10}
                    style={{
                      background: "#fff",
                      width: "2px",
                      // This needs to be equal to props.strokeWidth
                      height: `${10}%`
                    }}
                  />
                </CircularProgressbarWithChildren>
              </td>
              <td>
                <CircularProgressbarWithChildren
                  value={100}
                  background
                  // text={`${80}%`}
                  strokeWidth={10}
                  styles={buildStyles({
                    strokeLinecap: 'butt',
                    pathColor: "#02C101",
                    trailColor: "grey",
                    backgroundColor: 'white'
                  })}
                >
                  <div style={{ fontSize: 20, textAlign: 'center' }}>
                    <strong>Competencias</strong>
                    <br></br>
                    <strong>{listResumenEval[0].competenciasEvaluadas}</strong>
                    <br></br>
                    <strong>Evaluadas</strong>
                  </div>
                  <RadialSeparators
                    count={10}
                    style={{
                      background: "#fff",
                      width: "2px",
                      // This needs to be equal to props.strokeWidth
                      height: `${10}%`
                    }}
                  />
                </CircularProgressbarWithChildren>
              </td>

              <td>
                <CircularProgressbarWithChildren
                  maxValue={10}
                  value={tiempProm}
                  background
                  // text={`${80}%`}
                  strokeWidth={10}
                  styles={buildStyles({
                    strokeLinecap: 'butt',
                    pathColor: "#FF7300",
                    trailColor: "#E5E7E9",
                    backgroundColor: 'white'
                  })}
                >
                  <div style={{ fontSize: 20, textAlign: 'center' }}>
                    <strong>Tiempo</strong>
                    <br></br>
                    <strong><span>{listResumenEval[0].tiempoPromedio}</span>
                      <p className="porcentajeCard">min</p></strong>
                    <br></br>
                    <strong>Promedio</strong>
                  </div>
                  <RadialSeparators
                    count={10}
                    style={{
                      background: "#fff",
                      width: "2px",
                      // This needs to be equal to props.strokeWidth
                      height: `${10}%`
                    }}
                  />
                </CircularProgressbarWithChildren>
              </td>
            </tr>

          </Table>
        </div>

        // <div id="bodyContainer">
        //   <div id="container_cardsEDD">
        //     <Card>
        //       <Card.Body className="cardBody">
        //         <Card.Text className="cardText">Satisfacción</Card.Text>
        //         <Card.Title className="cardTitle">
        //           {listResumenEval[0].porcSatisfaccion}%

        //         </Card.Title>
        //         <Card.Text className="cardText">General</Card.Text>
        //       </Card.Body>
        //     </Card>
        //     <Card>
        //       <Card.Body className="cardBody">
        //         <Card.Text className="cardText">Colaboradores</Card.Text>
        //         <Card.Title className="cardTitle">
        //           {listResumenEval[0].referentesEvaluados}
        //         </Card.Title>
        //         <Card.Text className="cardText">Evaluadores</Card.Text>
        //       </Card.Body>
        //     </Card>
        //     <Card>
        //       <Card.Body className="cardBody">
        //         <Card.Text className="cardText">Competencias</Card.Text>
        //         <Card.Title className="cardTitle">
        //           {listResumenEval[0].competenciasEvaluadas}
        //         </Card.Title>
        //         <Card.Text className="cardText">Evaluadas</Card.Text>
        //       </Card.Body>
        //     </Card>
        //     <Card>
        //       <Card.Body className="cardBody">
        //         <Card.Text className="cardText">Evaluadores</Card.Text>
        //         <Card.Title className="cardTitle">
        //           {listResumenEval[0].cantEvaluadoresTsoft}
        //         </Card.Title>
        //         <Card.Text className="cardText">Tsoft</Card.Text>
        //       </Card.Body>
        //     </Card>
        //     <Card>
        //       <Card.Body className="cardBody">
        //         <Card.Text className="cardText">Tiempo</Card.Text>
        //         <Card.Title className="cardTitle">
        //           <span>{listResumenEval[0].tiempoPromedio}</span>
        //           <p className="porcentajeCard">min</p>
        //         </Card.Title>
        //         <Card.Text className="cardText">Promedio</Card.Text>
        //       </Card.Body>
        //     </Card>
        //   </div>
        // </div>
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
      GetConfigCompRangoLeyenda();
    },
    [loadedDataCompetencias, loadedDataResumenEval, loadedDataRango, loadedDataColor, loadedDataLeyenda, idEDDEvaluacion, nomEvaluacion, idEDDProyecto]
  );

  return userData.statusConected || userData !== null ? (
    <div>

      <Header></Header>
      <a
        type="submit"
        id="btnAtrasEvaluacion"
        value="Registrar"
        href="/listadoEddEvalProyEmp/0">Volver
      </a>
      <h4>Resumen evaluación : {nomEvaluacion}</h4>


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

    </div>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
