import React, { useRef, useEffect, useState } from "react";
import SendDataService from "../../../../services/SendDataService";
import "./css/ExtraGraph.css";
import { Table } from "react-bootstrap";
import Card from "react-bootstrap/Card";

import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import RadialSeparators from "../../home/RadialSeparators";
import ProgressBar from "react-bootstrap/ProgressBar";

export default function ExtraGraph({
  idEDDEvaluacion,
  nomEvaluacion,
  idEDDProyecto,
  cicloEvaluacion,
  setActiveGraph,
}) {

  //Resumen: este muestra toda la info de un ciclo de evaluación en específico, mostrando los "radares" y comentarios
  
  const [listResumenEval, setListResumenEval] = useState("");
  const [listCompetencias, setListCompetencias] = useState("");
  const [listConfigCompColorFlechas, setListConfigCompColorFlechas] =
    useState("");
  const [listConfigCompRangoFlechas, setListConfigCompRangoFlechas] =
    useState("");
  const [listConfigCompRangoLeyenda, setListConfigCompRangoLeyenda] =
    useState("");

  const [listConfigTiempoPromedio, setListConfigTiempoPromedio] = useState("");

  const [loadedDataResumenEval, setLoadedDataResumenEval] = useState(false);
  const [loadedDataCompetencias, setLoadedDataCompetencias] = useState(false);
  const [loadedDataRango, setLoadedDataRango] = useState(false);
  const [loadedDataColor, setLoadedDataColor] = useState(false);
  const [loadedDataLeyenda, setLoadedDataLeyenda] = useState(false);
  const [loadedDataTiempoPromedio, setLoadedDataTiempoPromedio] =
    useState(false);

  const [listComentEval, setListComentEval] = useState("");
  const [loadedDataComentEval, setLoadedDataComentEval] = useState(false);

  // ---------------------- get datos -----------------
  function GetConfigTiempoPromedio() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "EDD",
      subTipoConfDato: "TIEMPO_LIMITE",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigTiempoPromedio(data);

      setLoadedDataTiempoPromedio(true);
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

      setLoadedDataLeyenda(true);
    });
  }
  function GetDataResumenEval() {
    var url = "pages/listados/listadoResumenEval.php";
    var operationUrl = "listadoResumenEval";
    var data = {
      idEvaluacion: idEDDEvaluacion,
      idProyecto: idEDDProyecto,
      cicloEvaluacion: cicloEvaluacion,
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
      idEvaluacion: idEDDEvaluacion,
      idProyecto: idEDDProyecto,
      cicloEvaluacion: cicloEvaluacion,
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
      setLoadedDataColor(true);
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

      setLoadedDataRango(true);
    });
  }

  function GetDataComentEval() {
    var url = "pages/listados/listadoComentariosEval.php";
    var operationUrl = "listadoComentariosEval";
    var data = {
      idEvaluacion: idEDDEvaluacion,
      idProyecto: idEDDProyecto,
      cicloEvaluacion: cicloEvaluacion,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListComentEval(data);
      setLoadedDataComentEval(true);
    });
  }

  // ---------------------- graficos -----------------

  function BodyResumen() {
    if (loadedDataResumenEval && loadedDataTiempoPromedio) {
      const splitReferentes = listResumenEval[0].referentesEvaluados;
      var totalSplit = splitReferentes.split("/");

      var cant = totalSplit[0];
      var totalRef = totalSplit[1];

      return (
        <div className="tableResumen">
          <Table>
            <tr>
              <td>
                <CircularProgressbarWithChildren
                  value={listResumenEval[0].porcSatisfaccion}
                  background
                  strokeWidth={10}
                  styles={buildStyles({
                    strokeLinecap: "butt",
                    pathColor: ProgressBarColor(
                      listResumenEval[0].porcSatisfaccion
                    ),
                    trailColor: "#E5E7E9",
                    backgroundColor: "white",
                  })}
                >
                  <div style={{ fontSize: 20, textAlign: "center" }}>
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
                      height: `${10}%`,
                    }}
                  />
                </CircularProgressbarWithChildren>
              </td>
              <td>
                <CircularProgressbarWithChildren
                  maxValue={eval(totalRef)}
                  value={(cant * 100) / totalRef}
                  background
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: ProgressBarColor((cant * 100) / totalRef),
                    trailColor: "#E5E7E9",
                    strokeLinecap: "butt",
                    backgroundColor: "white",
                  })}
                >
                  <div style={{ fontSize: 20, textAlign: "center" }}>
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
                      height: `${10}%`,
                    }}
                  />
                </CircularProgressbarWithChildren>
              </td>
              <td>
                <CircularProgressbarWithChildren
                  value={100}
                  background
                  strokeWidth={10}
                  styles={buildStyles({
                    strokeLinecap: "butt",
                    pathColor: "#008000",
                    trailColor: "grey",
                    backgroundColor: "white",
                  })}
                >
                  <div style={{ fontSize: 20, textAlign: "center" }}>
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
                      height: `${10}%`,
                    }}
                  />
                </CircularProgressbarWithChildren>
              </td>

              <td>
                <CircularProgressbarWithChildren
                  // Valor maximo del cirucularProgress
                  maxValue={100}
                  // Borde de color (visual)
                  value={
                    (listResumenEval[0].tiempoPromedio * 100) /
                    listConfigTiempoPromedio[0].datoNoVisible
                  }
                  background
                  // Rayas del borde
                  strokeWidth={10}
                  styles={buildStyles({
                    strokeLinecap: "butt",
                    // Color del borde-llenado
                    pathColor: ProgressBarColor(
                      (listResumenEval[0].tiempoPromedio * 100) /
                        listConfigTiempoPromedio[0].datoNoVisible
                    ),
                    trailColor: "#E5E7E9",
                    backgroundColor: "white",
                  })}
                >
                  <div style={{ fontSize: 20, textAlign: "center" }}>
                    <strong>Tiempo</strong>
                    <br></br>
                    {/* Valor que se ve dentro del circulo, en minutos */}
                    {/* <strong><span>{(listResumenEval[0].tiempoPromedio * 100) / listConfigTiempoPromedio[0].datoNoVisible}</span> */}
                    <strong>
                      <span>{listResumenEval[0].tiempoPromedio}</span>
                      <p className="porcentajeCard">min</p>
                    </strong>
                    <br></br>
                    <strong>Promedio</strong>
                  </div>
                  <RadialSeparators
                    count={10}
                    style={{
                      background: "#fff",
                      width: "2px",
                      // This needs to be equal to props.strokeWidth
                      height: `${10}%`,
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

  function ArrowsTemplate({ porcAprobComp }) {
    if (loadedDataColor && loadedDataRango) {
      var auxRango = "0"; //posiciones
      var varRango = ""; //arriba / abajo /dato visible
      let listRango = listConfigCompRangoFlechas
        .map((orden) => orden)
        .reverse();

      listRango.map((rango) => {
        if (auxRango === "0") {
          if (eval(porcAprobComp + rango.datoNoVisible)) {
            // eval(30 + > 80) --> eval 30 >= 80
            varRango = rango.datoVisible;
            auxRango = "1";
          }
        }
      });
      var carita = (
        <img
          id="faceStyleReferenteTodas"
          src={require(`../../Smileys/${varRango}.png`)}
        ></img>
      );

      return (
        <>
          <div>{carita}</div>
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

      uniqueDatoNoVisibleValues.forEach((datoNoVisible) => {
        const matchingLey = listConfigCompRangoLeyenda.find(
          (ley) => ley.datoNoVisible === datoNoVisible
        );
        const matchingRango = listConfigCompRangoFlechas.find(
          (rango) => rango.datoNoVisible === datoNoVisible
        );

        if (matchingLey && matchingRango) {
          var carita_gral =
            matchingRango.datoNoVisible === matchingLey.datoNoVisible ? (
              <img
                id="faceStyleLeyendas"
                src={require(`../../Smileys/${matchingRango.datoVisible}.png`)}
              ></img>
            ) : (
              ""
            );

          tableRows.push(
            <>
            <br></br>
            <td style={{whiteSpace: "nowrap"}} > 
              &nbsp;
              <b>{matchingLey.datoVisible}</b>
              
            </td>
            &nbsp;

            <td className="linea">
              <td>{carita_gral}</td>
            </td>
          </>
          );
        }
      });
      return (
        <div>
          <table
            style={{
              backgroundColor: "white",
              width: "500px",
              borderRadius: "15px",
              margin: "auto",
              marginTop: "20px",
              fontSize: "8pt",
            }}
          >
            {tableRows}
          </table>
          <br></br>
        </div>
      );
    }
  }
  function ProgressBarColor(porcAprobComp) {
    if (loadedDataColor) {
      var auxColor = "0"; //posiciones
      var varColor = ""; //color /dato visible

      // Ordena la lista utilizando la función de comparación
      function compararPorOrden(a, b) {
        return parseInt(b.orden) - parseInt(a.orden);
      }
      var listColor = listConfigCompColorFlechas.sort(compararPorOrden);

      listColor.map((color1) => {
        if (auxColor === "0") {
          if (eval(porcAprobComp + color1.datoNoVisible)) {
            varColor = color1.datoVisible;
            auxColor = "1";
          }
        }
      });
      return varColor;
    }
  }
  function ProgressColorInfo(porcAprobC) {
    if (loadedDataColor) {
      var auxColor = "0"; //posiciones
      var varColor = ""; //color /dato visible

      // Ordena la lista utilizando la función de comparación
      function compararPorOrden(a, b) {
        return parseInt(b.orden) - parseInt(a.orden);
      }
      var listColor = listConfigCompColorFlechas.sort(compararPorOrden);

      listColor.map((color1) => {
        if (auxColor === "0") {
          if (eval(porcAprobC + color1.datoNoVisible)) {
            varColor = color1.datoVisible;
            auxColor = "1";
          }
        }
      });

      return varColor;
    }
  }
  function Porcentajes() {
    var list_eval_comp_porc = {};
    var total_porcentajes = {};
    var cantidad_comp_por_empleado = {};
    var result_list = {};

    // Iterar a través de la listCompetencias array
    for (const item of Object.values(listCompetencias)) {
      if (item.nomEmpleado in list_eval_comp_porc) {
        if (item.nomCompetencia in list_eval_comp_porc[item.nomEmpleado]) {
          list_eval_comp_porc[item.nomEmpleado][item.nomCompetencia].push(
            item.porcAprobComp
          );
        } else {
          list_eval_comp_porc[item.nomEmpleado][item.nomCompetencia] = [
            item.porcAprobComp,
          ];
        }
      } else {
        list_eval_comp_porc[item.nomEmpleado] = {
          [item.nomCompetencia]: [item.porcAprobComp],
        };
      }
    }

    // Crear un array de objetos para ordenar las tablas
    const tableData = [];
    for (const [key, value] of Object.entries(list_eval_comp_porc)) {
      total_porcentajes[key] = 0;
      cantidad_comp_por_empleado[key] = Object.keys(value).length;
      result_list[key] = {};

      const empleadoRows = [];
      const empleadoRows2 = [];
      for (const [key1, value1] of Object.entries(value)) {
        const suma =
          value1.reduce(
            (accumulator, currentValue) =>
              accumulator + parseFloat(currentValue),
            0
          ) / value1.length;

        result_list[key][key1] = suma;
        total_porcentajes[key] += suma;

        const color = ProgressColorInfo(suma);

        // PODER CAMBIAR DE COLOR LA BARRA DINAMICO
        const ref = useRef();

        useEffect(() => {
          if (ref.current) {
            const inner = ref.current.querySelector(".progress-bar");
            if (inner) {
              if (color === "#008000" || color === "#FF0000") {
                inner.style.backgroundColor = color;
                inner.style.fontSize = "11pt";
                inner.style.color = "white";
                inner.style.fontWeight = "700";
              } else {
                inner.style.backgroundColor = color;
                inner.style.fontSize = "11pt";
                inner.style.color = "black";
                inner.style.fontWeight = "700";
              }
            }
          }
        }, [ref]);
        // ----------------------------------------------------

        <ProgressBar ref={ref} now={20} /* other stuff */ />;

        empleadoRows.push(
          <tr style={{ borderTop: "1px #DCDCDC solid" }}>
            <td style={{ paddingLeft: "1em" }}>{key1} </td>
            <td>
              <ProgressBar
                id="infoLinePorcREFERENTE"
                ref={ref}
                now={suma}
                label={`${suma.toFixed(2)}%`}
              />
            </td>
            <td>
              <ArrowsTemplate porcAprobComp={suma} />
            </td>
          </tr>
        );
      }

      const color1 = ProgressColorInfo(
        total_porcentajes[key] / cantidad_comp_por_empleado[key]
      );

      // PODER CAMBIAR DE COLOR LA BARRA DINAMICO
      const ref1 = useRef();

      useEffect(() => {
        if (ref1.current) {
          const inner = ref1.current.querySelector(".progress-bar");

          if (inner) {
            if (color1 === "#008000" || color1 === "#FF0000") {
              inner.style.backgroundColor = color1;
              inner.style.fontSize = "11pt";
              inner.style.color = "white";
              inner.style.fontWeight = "700";
            } else {
              inner.style.backgroundColor = color1;
              inner.style.fontSize = "11pt";
              inner.style.color = "black";
              inner.style.fontWeight = "700";
            }
          }
        }
      }, [ref1]);
      // ----------------------------------------------------

      empleadoRows2.push(
        <tr style={{ borderBottom: "2px #808080 solid" }}>
          <th style={{ paddingLeft: "1em", width: "12em", height: "50px" }}>
            {key.toUpperCase()}{" "}
          </th>
          <td>
            <ProgressBar
              id="infoLinePorcREFERENTE"
              ref={ref1}
              now={total_porcentajes[key] / cantidad_comp_por_empleado[key]}
              label={`${(
                total_porcentajes[key] / cantidad_comp_por_empleado[key]
              ).toFixed(2)}%`}
            />
          </td>
          <td>
            <ArrowsTemplate
              porcAprobComp={
                total_porcentajes[key] / cantidad_comp_por_empleado[key]
              }
            />
          </td>
        </tr>
      );

      tableData.push({ key, content: [empleadoRows2, empleadoRows] });
    }

    // Ordenar el array de objetos alfabéticamente por key
    tableData.sort((a, b) => a.key.localeCompare(b.key));

    // Renderizar las tablas en el orden correcto
    const render = [];
    const maxEvaluadoresPorFila = 3;
    let evaluadoresEnFila = 0;
    let filaEvaluadores = [];

    for (const data of tableData) {
      filaEvaluadores.push(
        <td>
          <table
            style={{
              backgroundColor: "white",
              width: "300px",
              margin: "5px", // Espacio entre tablas
              border: "1px solid lightgray",
              borderRadius: "20px"
            }}
          >
            <thead>
              <tr>
                <th style={{ paddingLeft: "0.8em", fontSize: "15pt" }}>
                  REFERENTE
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <tr>{data.content[0]}</tr>
                <tr>{data.content[1]}</tr>
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

    // Obtener el número total de tablas
    const numTablas = tableData.length;

    // Calcular el número de tablas por fila (máximo 3)
    // const tablasPorFila = Math.min(numTablas, 3);

    // Centrar las tablas en la pantalla si hay menos de 3
    const centrarTablas = numTablas < 3;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: centrarTablas ? "center" : "flex-start",
        }}
      >
        <table responsive>
          <tbody>{render}</tbody>
        </table>
      </div>
    );
  }

  function CompetenciasResumen() {
    if (loadedDataCompetencias) {
      return (
        <table>
          <tr>
            <InfoArrows></InfoArrows>
          </tr>
          <tr>
            <Porcentajes></Porcentajes>
            <br></br>
          </tr>
        </table>
      );
    } else {
      return <h1>Loading</h1>;
    }
  }

  // ---------------------- funciones toggle -----------------

  function toggleInfo() {
    setActiveGraph(false);
  }

  // ---------------------- comentarios -----------------

  function Comentarios() {
    var render = [];
    listComentEval.forEach((item, index) => {
      render.push(
        <Card className="comentariosExtraGraph" key={index}>
          <Card.Body>
            <Card.Title style={{fontSize: "10pt"}}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <strong>{item.nomEvaluado.toUpperCase()}</strong>
                    </td>
                    <td align="justify" valign="top">
                      {item.respuesta}
                    </td>
                  </tr>
                  <tr >
                    <td className="nomEvaluador">{item.nomEvaluador}</td>
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
          <Card className="comentariosExtraGraph">
            <Card.Body>
              <Card.Title>NO HAY COMENTARIOS DISPONIBLES</Card.Title>
            </Card.Body>
          </Card>
        </>
      );
    } else {
      return <div className="containerComentarios">{render}</div>;
    }
  }

  function ComentariosResumen() {
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
      GetDataResumenEval();
      GetDataCompetencias();
      GetConfigCompColorFlechas();
      GetConfigCompRangoFlechas();
      GetConfigCompRangoLeyenda();
      GetConfigTiempoPromedio();
      GetDataComentEval();
    },
    [
      loadedDataCompetencias,
      loadedDataResumenEval,
      loadedDataRango,
      loadedDataColor,
      loadedDataLeyenda,
      idEDDEvaluacion,
      nomEvaluacion,
      idEDDProyecto,
      cicloEvaluacion,
      loadedDataComentEval,
    ]
  );

  return (
    <table style={{ margin: "auto" }} id="AutoScroll_tableExtraGraph">
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          width: "800px",
        }}
      >
        <strong>
          <p style={{ textAlign: "left", paddingLeft: "10px" }}>
            Referentes:<br></br>
            {nomEvaluacion} - CICLO: {cicloEvaluacion}
          </p>
        </strong>
      </div>
      <BodyResumen></BodyResumen>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "2%",
        }}
      >
        <CompetenciasResumen></CompetenciasResumen>
      </div>
      <div>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          width: "800px",
        }}
      >
        <strong>
          <p style={{ textAlign: "left", paddingLeft: "10px" }}>
            COMENTARIOS ADICIONALES
          </p>
        </strong>
      </div>
        <ComentariosResumen />
      </div>
      <button
        onClick={() => toggleInfo()}
        value="Ocultar"
        className="btnOcultar"
        data-html2canvas-ignore="true"
      >
        Ocultar ciclo de evaluación
      </button>
    </table>
  );
}
