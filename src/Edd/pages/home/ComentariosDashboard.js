import React, { useEffect, useState } from "react";
import Header from "../../../templates/Header/Header";
import SendDataService from "../../../services/SendDataService";
import Card from "react-bootstrap/Card";
import { Navigate } from "react-router-dom";
import "./homeEDD.css";
import "./GraficosDashboard"
import { useRoute } from "wouter";

export default function ComentariosDashboard() {
    const [, params] = useRoute("/ComentariosDashboard/:idEvaluacion/:nomEvaluacion/:idEDDProyecto");

    const idEDDEvaluacion = params.idEvaluacion;
    const idEDDProyecto = params.idEDDProyecto;

    const nomEvaluacion = decodeURI(params.nomEvaluacion);

    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
    const [listComentEval, setListComentEval] = useState("");
    const [listConfigCompColorFlechas, setListConfigCompColorFlechas] =
        useState("");
    const [listConfigCompRangoFlechas, setListConfigCompRangoFlechas] =
        useState("");

    const [loadedDataComentEval, setLoadedDataComentEval] = useState(false);
    const [loadedDataRango, setLoadedDataRango] = useState(false);
    const [loadedDataColor, setLoadedDataColor] = useState(false);



    function GetDataComentEval() {
        var url = "pages/listados/listadoComentariosEval.php";
        var operationUrl = "listadoComentariosEval";
        var data = {
            idEvaluacion: idEDDEvaluacion,
            idProyecto:idEDDProyecto,
        };
        SendDataService(url, operationUrl, data).then((data) => {
            setListComentEval(data);
            setLoadedDataComentEval(true);
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
                                        <td style={{width:'150px'}}><strong>{item.nomEvaluado.toUpperCase()}</strong></td>
                                        <td align="justify" valign="top">{item.respuesta}</td>
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

        if (listComentEval[0].codResp !== '00') {
            return (<>
                <Card className="cardColumnComentario">
                    <Card.Body>
                        <Card.Title>
                            NO HAY COMENTARIOS DISPONIBLES
                        </Card.Title>
                    </Card.Body>
                </Card>
                </>)
        } else {
            return (
                <div className="cardContainerComentario">
                    {render}
                </div>
            );
        }
    }


    function CompetenciasResumen() {
        if (loadedDataComentEval) {
            return (
                <div >

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
            GetConfigCompColorFlechas();
            GetConfigCompRangoFlechas();
        },
        [loadedDataComentEval, loadedDataRango, loadedDataColor, idEDDEvaluacion, nomEvaluacion,idEDDProyecto]
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
