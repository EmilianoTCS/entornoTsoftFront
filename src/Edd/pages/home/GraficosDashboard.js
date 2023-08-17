import React, { useEffect, useState } from "react";
import Header from "../../../templates/Header/Header";
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

    function InfoExag2() {
        if (loadedDataResumenEval) {
            return (


                <div id="bodyContainer">
                    <div id="container_cardsCompResumen">
                        {/* {listCompetencias.map((item) => ( */}
                        <Card>
                            <Card.Body className="cardBody">
                                <Card.Title
                                    style={{ display: "flex", justifyContent: "space-between", textTransform: 'uppercase' }}
                                >
                                    {/* {item.nomCompetencia} */}
                                    Nombres

                                </Card.Title>
                            </Card.Body>
                        </Card>
                        {/* ))} */}
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
                                style={{ width: "700px", height: "360px", }}>
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
