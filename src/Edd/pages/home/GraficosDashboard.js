import React, { useEffect, useState } from "react";
import Header from "../../../templates/Header/Header";
import getDataService from "../../../services/GetDataService"
import SendDataService from "../../../services/SendDataService";
import Card from "react-bootstrap/Card";
import { Navigate } from "react-router-dom";
import "./homeEDD.css";
import GrafChart from "./GrafChart";
import { useRoute } from "wouter";
import { Container, Table } from "react-bootstrap";


export default function GraficosDashboard() {
    const [, params] = useRoute("/GraficosDashboard/:idEvaluacion/:nomEvaluacion/:idEDDProyecto");

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

    const [loadedDataLeyenda, setLoadedDataLeyenda] = useState(false);

    const [loadedDataResumenEval, setLoadedDataResumenEval] = useState(false);
    const [loadedDataCompetencias, setLoadedDataCompetencias] = useState(false);
    const [loadedDataRango, setLoadedDataRango] = useState(false);
    const [loadedDataColor, setLoadedDataColor] = useState(false);



    function GetDataResumenEval() {
        var url = "pages/listados/listadoResumenEval.php";
        var operationUrl = "listadoResumenEval";
        var data = {
            idEvaluacion: idEDDEvaluacion,
            idProyecto:idEDDProyecto,
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
            idProyecto:idEDDProyecto,
        };
        SendDataService(url, operationUrl, data).then((data) => {
            setListCompetencias(data);
            setLoadedDataCompetencias(true);
            console.log(data);
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

    function BodyResumen2() {
        if (loadedDataResumenEval) {
            return (
                <div id="bodyContainer">
                    <div id="container_cardsEDD">
                        <Card >
                            <Card.Body className="cardBody">
                                <Card.Text className="cardText">Satisfacción </Card.Text>
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
                                <Card.Text className="cardText">Evaluadores</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className="cardBody">
                                <Card.Text className="cardText">Competencias </Card.Text>
                                <Card.Title className="cardTitle">
                                    {listResumenEval[0].competenciasEvaluadas}
                                </Card.Title>
                                <Card.Text className="cardText">Evaluadas</Card.Text>
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
                        
                        {/* <Card>
                            <Card.Body className="cardBody">
                                <Card.Text className="cardText">Satisfacción </Card.Text>
                                <Card.Title className="cardTitle">
                                    {listResumenEval[0].referentesEvaluados}
                                </Card.Title>
                                <Card.Text className="cardText">inge</Card.Text>
                            </Card.Body>
                        </Card> */}

                    </div>
                   
                </div>
                
            );
        } else {
            return <h1>Loading</h1>;
        }
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
    }}
    function InfoArrows() {
        if (loadedDataLeyenda && loadedDataRango && loadedDataColor) {
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
                    <div id="container_cardsCompResumen" style={{ width: '45%',marginRight :'-2.3em',marginTop:'-8.2em' }}>
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

    function InfoExag2() {
        var list_proc_emp = {};
        var contador = 0;
        var render = [];

        if (loadedDataCompetencias) {
            listCompetencias.forEach((item) => {
                contador++;

                if (item.nomEvaluador in list_proc_emp) {
                    if (item.nomEmpleado in list_proc_emp[item.nomEvaluador]) {
                        list_proc_emp[item.nomEvaluador][item.nomEmpleado].push(item.porcAprobComp);
                    } else {
                        list_proc_emp[item.nomEvaluador][item.nomEmpleado] = [item.porcAprobComp];
                    }
                } else {
                    list_proc_emp[item.nomEvaluador] = {
                        [item.nomEmpleado]: [item.porcAprobComp],
                    };
                }
                // console.log(list_proc_emp);

                if (Object.keys(listCompetencias).length === contador) {
                    render.push(
                        <div id="bodyContainer">
                            <div id="container_cardsCompResumen">
                                {Object.keys(list_proc_emp).reduce((rows, evaluador, index) => {
                                    if (index % 2 === 0) rows.push([]);
                                    rows[rows.length - 1].push(evaluador);
                                    return rows;
                                }, []).map((row, rowIndex) => (
                                    <div key={rowIndex} className="row">
                                        {row.map((evaluador) => (
                                            <div key={evaluador} className="col-md-7       ">
                                                <h2 style={{ color: 'white', fontSize: '25px' }}>
                                                    Evaluador:<br /> {evaluador}
                                                </h2>
                                                {Object.keys(list_proc_emp[evaluador]).map((empleado) => {
                                                    const porcentajes = list_proc_emp[evaluador][empleado];
                                                    const suma = porcentajes.reduce((total, porcentaje) => total + parseFloat(porcentaje), 0);
                                                    const promedio = suma / porcentajes.length;

                                                    return (
                                                        <Card key={empleado} style={{ width: '247px' }}>
                                                            <Card.Body className="cardBody1">
                                                                <Card.Title
                                                                    
                                                                >
                                                                    <div className="container">
                                                                        <div className="row">
                                                                            <div className="col cardBody1">
                                                                                {empleado}
                                                                            </div>

                                                                            <div className="col-4">
                                                                                <div>
                                                                                    <div style={{ fontSize: "12pt", alignItems: "center", marginLeft: '-14px' }}>
                                                                                        <ArrowsTemplate porcAprobComp={promedio} />
                                                                                        {promedio.toFixed(2)} %
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                </Card.Title>
                                                            </Card.Body>
                                                            
                                                        </Card>
                                                        
                                                    );
                                                })}
                                            </div>
                                            
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }
            });
        } return render;
    }

    useEffect(
        function () {
            GetDataResumenEval();
            GetDataCompetencias();

            GetConfigCompColorFlechas();
            GetConfigCompRangoFlechas();
            GetConfigCompRangoLeyenda()

        },
        [loadedDataCompetencias, loadedDataResumenEval, loadedDataRango, loadedDataColor, loadedDataLeyenda, idEDDEvaluacion, nomEvaluacion,idEDDProyecto]
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
            <h4 style={{ color: 'white' }}>Resumen evaluación : {nomEvaluacion}</h4>
            <BodyResumen2></BodyResumen2>
            <Table >
                <td id="mainTableGrafDash">
                    <th><div><InfoExag2></InfoExag2></div><InfoArrows></InfoArrows></th>
                    <th><div></div></th>
                    <th><div></div></th>

                    <th>
                        <div class="bg-light mx-auto px-2 border border-2 border-secondary"
                            style = {{ width: "670px", height: "350px" }}>
                            <GrafChart idEDDEvaluacion={idEDDEvaluacion} idEDDProyecto={idEDDProyecto} />
                        </div>
                    </th>
                </td>
                
            </Table>
            
        </div>

    ) : (
        <Navigate to="/login"></Navigate>

    );
}

