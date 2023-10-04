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
import carita_excelente from "../Smileys/carita_excelente.png"
import carita_mejora from "../Smileys/carita_mejora.png"
import carita_atencion from "../Smileys/carita_atencion.png"
import carita_situacion from "../Smileys/carita_situacion.png"
import carita_alerta from "../Smileys/carita_alerta.png"
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

  const [listConfigTiempoPromedio, setListConfigTiempoPromedio] =
    useState("");


  const [loadedDataResumenEval, setLoadedDataResumenEval] = useState(false);
  const [loadedDataCompetencias, setLoadedDataCompetencias] = useState(false);
  const [loadedDataRango, setLoadedDataRango] = useState(false);
  const [loadedDataColor, setLoadedDataColor] = useState(false);
  const [loadedDataLeyenda, setLoadedDataLeyenda] = useState(false);
  const [loadedDataTiempoPromedio, setLoadedDataTiempoPromedio] = useState(false);


  function GetConfigTiempoPromedio() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "EDD",
      subTipoConfDato: "TIEMPO_LIMITE",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      // console.log(data);
      setListConfigTiempoPromedio(data);

      setLoadedDataTiempoPromedio(true)

    });
  }

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
    // console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      setListResumenEval(data);
      setLoadedDataResumenEval(true);

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
      // console.log('DATA', data);
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
      var varRango = ""; //arriba / abajo /dato visible
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


      const carita_exc1 = varRango === 'carita_excelente' ? <img id="faceStyleReferenteTodas" src={carita_excelente}></img> : '';
      const carita_mej1 = varRango === 'carita_mejora' ? <img id="faceStyleReferenteTodas" src={carita_mejora}></img> : '';
      const carita_atenc1 = varRango === 'carita_atencion' ? <img id="faceStyleReferenteTodas" src={carita_atencion}></img> : '';
      const carita_sit1 = varRango === 'carita_situacion' ? <img id="faceStyleReferenteTodas" src={carita_situacion}></img> : '';
      const carita_aler1 = varRango === 'carita_alerta' ? <img id="faceStyleReferenteTodas" src={carita_alerta}></img> : '';


      return (
        <>
          <div>
            {carita_exc1}
            {carita_mej1}
            {carita_atenc1}
            {carita_sit1}
            {carita_aler1}
          </div>
        </>
      );

    }
  }

  function InfoArrows() {
    if (loadedDataLeyenda && loadedDataRango) {
      const tableRows = [];
      const uniqueDatoNoVisibleValues = new Set();

      listConfigCompRangoLeyenda.forEach((ley) => {
        uniqueDatoNoVisibleValues.add(ley.datoNoVisible);
      });

      listConfigCompRangoFlechas.forEach((rango) => {
        uniqueDatoNoVisibleValues.add(rango.datoNoVisible);
      });

      // listConfigCompColorFlechas.forEach((color) => {
      //   uniqueDatoNoVisibleValues.add(color.datoNoVisible);
      // });

      uniqueDatoNoVisibleValues.forEach((datoNoVisible) => {
        const matchingLey = listConfigCompRangoLeyenda.find(ley => ley.datoNoVisible === datoNoVisible);
        const matchingRango = listConfigCompRangoFlechas.find(rango => rango.datoNoVisible === datoNoVisible);
        // const matchingColor = listConfigCompColorFlechas.find(color => color.datoNoVisible === datoNoVisible);

        if (matchingLey && matchingRango) {
          const carita_exc = matchingRango.datoVisible === 'carita_excelente' ? <img id="faceStyleReferenteTodas" src={carita_excelente}></img> : '';
          const carita_mej = matchingRango.datoVisible === 'carita_mejora' ? <img id="faceStyleReferenteTodas" src={carita_mejora}></img> : '';
          const carita_atenc = matchingRango.datoVisible === 'carita_atencion' ? <img id="faceStyleReferenteTodas" src={carita_atencion}></img> : '';
          const carita_sit = matchingRango.datoVisible === 'carita_situacion' ? <img id="faceStyleReferenteTodas" src={carita_situacion}></img> : '';
          const carita_aler = matchingRango.datoVisible === 'carita_alerta' ? <img id="faceStyleReferenteTodas" src={carita_alerta}></img> : '';


          tableRows.push(
            <>
              <br></br>
              <td id="infoLinePorcLeyendasREFERENTE">
                <b>{matchingLey.datoVisible}</b>
              </td>
              <td className="linea">
                <td>{carita_exc}</td>
                <td> {carita_mej}</td>
                <td> {carita_atenc}</td>
                <td> {carita_sit}</td>
                <td> {carita_aler}</td>
              </td>
            </>
          );
        }
      });

      return (
        <div>

          <table style={{ backgroundColor: 'white', width: '50%', borderRadius: '20px', margin: 'auto' }}>

            {tableRows}

          </table><br></br></div>)
    }
  }

  
  function ProgressBarColor(porcAprobComp) {
    if (loadedDataLeyenda && loadedDataRango) {
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

        if (matchingLey && matchingRango) {
          const carita_exc = matchingRango.datoVisible === 'carita_excelente' ? <img id="faceStyleReferenteTodas" src={carita_excelente}></img> : '';
          const carita_mej = matchingRango.datoVisible === 'carita_mejora' ? <img id="faceStyleReferenteTodas" src={carita_mejora}></img> : '';
          const carita_atenc = matchingRango.datoVisible === 'carita_atencion' ? <img id="faceStyleReferenteTodas" src={carita_atencion}></img> : '';
          const carita_sit = matchingRango.datoVisible === 'carita_situacion' ? <img id="faceStyleReferenteTodas" src={carita_situacion}></img> : '';
          const carita_aler = matchingRango.datoVisible === 'carita_alerta' ? <img id="faceStyleReferenteTodas" src={carita_alerta}></img> : '';


          tableRows.push(
            <>
              <br></br>
              <td id="infoLinePorcLeyendasREFERENTE">
                <b>{matchingLey.datoVisible}</b>
              </td>
              <td className="linea">
                <td>{carita_exc}</td>
                <td> {carita_mej}</td>
                <td> {carita_atenc}</td>
                <td> {carita_sit}</td>
                <td> {carita_aler}</td>
              </td>
            </>
          );
        }
      });

      return (
        <div>

          <table style={{ backgroundColor: 'white', width: '50%', borderRadius: '20px', margin: 'auto' }}>

            {tableRows}

          </table><br></br></div>)
    }
  }


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
    const maxEvaluadoresPorFila = 3;
    let evaluadoresEnFila = 0;
    let filaEvaluadores = [];

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
          <tr style={{ borderTop: '1px #DCDCDC solid' }}>
            <td style={{ paddingLeft: '1em' }}>{key1} </td>
            <td><ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={suma} label={`${suma.toFixed(2)}%`} /></td>
            <td><img id="faceStyleReferenteTodas"></img></td>
            <td>
              <ArrowsTemplate porcAprobComp={suma} />
            </td>
          </tr>
        );
      }


      empleadoRows2.push(
        <tr style={{ borderBottom: '2px #808080 solid' }}>

          <th style={{ paddingLeft: '1em', width: '12em', height: '50px' }}>{key.toUpperCase()} </th>
          <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={((total_porcentajes[key] / cantidad_comp_por_empleado[key]))} label={`${((total_porcentajes[key] / cantidad_comp_por_empleado[key])).toFixed(2)}%`} /></td>
          <td ><img id="faceStyleReferenteTodas" ></img></td>



          <td >
            <ArrowsTemplate porcAprobComp={total_porcentajes[key] / cantidad_comp_por_empleado[key]} />
            {/* <img id="faceStyleReferenteTodas" src={carita_situacion}></img> */}
          </td>


        </tr>);

      filaEvaluadores.push(
        <td>
          <table style={{
            backgroundColor: 'white',
            width: '26em',
            borderRadius: '10px',
            margin: '5px', // Espacio entre tablas
          }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: '0.8em', fontSize: '15pt' }}>REFERENTE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <tr >
                  {empleadoRows2}
                </tr>
                <tr>
                  {empleadoRows}
                </tr>
              </tr>
            </tbody>
          </table>
        </td>
      );

      evaluadoresEnFila++;
      if (evaluadoresEnFila === maxEvaluadoresPorFila) {
        render.push(<tr>{filaEvaluadores}</tr>);
        filaEvaluadores = [];
        evaluadoresEnFila = 0;
      }
    }

    if (evaluadoresEnFila > 0) {
      render.push(<tr>{filaEvaluadores}</tr>);
    }

    return (

      <table responsive>
        <tbody>
          {render}
        </tbody>
      </table>

    );
  }
  function CompetenciasResumen() {
    if (loadedDataCompetencias) {
      return (
        <div>
          <div>

            <InfoArrows></InfoArrows>
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
    if (loadedDataResumenEval && loadedDataTiempoPromedio) {
      const splitReferentes = listResumenEval[0].referentesEvaluados;
      var totalSplit = splitReferentes.split('/');

      var cant = totalSplit[0];
      var totalRef = totalSplit[1];

      console.log('can', cant, 'tot', totalRef);
      return (
        <div id="tableResumen">
          <Table>

            <tr >
              <td >
                <CircularProgressbarWithChildren
                  value={listResumenEval[0].porcSatisfaccion}
                  background
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
                  maxValue={eval(totalRef)}
                  value={cant}
                  background
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
                  maxValue={listConfigTiempoPromedio[0].datoNoVisible}
                  value={(listResumenEval[0].tiempoPromedio * 100) / listConfigTiempoPromedio[0].datoNoVisible}
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
                    <strong><span>{(listResumenEval[0].tiempoPromedio * 100) / listConfigTiempoPromedio[0].datoNoVisible}</span>
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
      GetConfigTiempoPromedio();
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
      <div style={{ backgroundColor: 'white', width: '50%', margin: 'auto',borderRadius:'10px' }}><strong><p style={{textAlign:'center'}}>Resumen evaluación : {nomEvaluacion}</p></strong>
      </div>
      
      {/* <InfoArrows></InfoArrows> */}
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
