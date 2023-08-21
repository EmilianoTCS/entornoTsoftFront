import React, { useEffect, useState } from "react";
import Header from "../../../templates/Header/Header";
import getDataService from "../../../services/GetDataService"
import SendDataService from "../../../services/SendDataService";
import Card from "react-bootstrap/Card";
import { Navigate } from "react-router-dom";
import "./homeEDD.css";
import GrafChart from "./GrafChart";

export default function GraficosDashboard() {
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
            idEvaluacion: 2,
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
            idEvaluacion: 2,
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

    function BodyResumen2() {
        if (loadedDataResumenEval) {
            return (
                <div id="bodyContainer">
                    <div id="container_cardsEDD">
                        <Card>
                            <Card.Body className="cardBody">
                                <Card.Text className="cardText">Satisfacción </Card.Text>
                                <Card.Title className="cardTitle">
                                    {listResumenEval[0].cantEvaluadoresTsoft}
                                </Card.Title>
                                <Card.Text className="cardText">general</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className="cardBody">
                                <Card.Text className="cardText">Analistas </Card.Text>
                                <Card.Title className="cardTitle">
                                    {listResumenEval[0].competenciasEvaluadas}
                                </Card.Title>
                                <Card.Text className="cardText">evaluados</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className="cardBody">
                                <Card.Text className="cardText">Competencias </Card.Text>
                                <Card.Title className="cardTitle">
                                    {listResumenEval[0].porcSatisfaccion}
                                </Card.Title>
                                <Card.Text className="cardText">evaluadas</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className="cardBody">
                                <Card.Text className="cardText">Satisfacción </Card.Text>
                                <Card.Title className="cardTitle">
                                    {listResumenEval[0].referentesEvaluados}
                                </Card.Title>
                                <Card.Text className="cardText">inge</Card.Text>
                            </Card.Body>
                        </Card>

                    </div>
                </div>
            );
        } else {
            return <h1>Loading</h1>;
        }
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

    function InfoExag2() {
        var list_proc_emp = {};
        var contador = 0
        var list_nombre_porcentaje = {}

        // var porc = []
        if (loadedDataCompetencias) {
            return (
                <div id="bodyContainer">
                    <div id="container_cardsCompResumen">
                        {listCompetencias.map((item) => {

                            contador++
                            // console.log('contador:', contador, 'array', Object.keys(listCompetencias).length);
                            if (item.nomEmpleado in list_proc_emp) {
                                list_proc_emp[item.nomEmpleado].push(item.porcAprobComp)


                            } else {
                                list_nombre_porcentaje
                                list_proc_emp[item.nomEmpleado] = []
                                list_proc_emp[item.nomEmpleado].push(item.porcAprobComp)

                            }

                            if (Object.keys(listCompetencias).length === contador) {
                                Object.keys(list_proc_emp).forEach(key => {

                                    var suma = list_proc_emp[key].reduce((v, v1) => {

                                        return parseFloat(v) + parseFloat(v1) / list_proc_emp[key].length;

                                    }, 0);

                                    list_nombre_porcentaje[key] = suma


                                    // console.log('Nombre:', key, '-', 'Suma:', suma, '%'); console.log(list_proc_emp[key]);

                                });
                                return (
                                    <div id="bodyContainer">
                                        <div id="container_cardsCompResumen">
                                            {Object.keys(list_nombre_porcentaje).map((key, index) => (
                                                <Card>
                                                    <Card.Body className="cardBody">
                                                        <Card.Title
                                                            style={{ display: "flex", justifyContent: "space-between", textTransform: 'uppercase' }}
                                                        >
                                                            {
                                                                Object.values(list_nombre_porcentaje).map((value, ind) => (
                                                                    ind === index ? (<><div>

                                                                        <div style={{ fontSize: "15pt", alignItems: "center" }}>
                                                                            {key}
                                                                            <ArrowsTemplate porcAprobComp={value} />
                                                                            {value.toFixed(2)} %

                                                                        </div></div></>) : (<></>)
                                                                ))
                                                            }

                                                        </Card.Title>
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                );

                            }
                        })
                        }
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
            <BodyResumen2></BodyResumen2>
            <div class="container">
                <div class="row">
                    <div class="col-sm-4">
                        <InfoExag2></InfoExag2>
                    </div>
                    <div class="col-sm-8">
                        <div className="bg-light mx-auto px-2 border border-2 border-secondary"
                            style={{ width: "690px", height: "360px", }}>
                            <GrafChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    ) : (
        <Navigate to="/login"></Navigate>
    );
}
