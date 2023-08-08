import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useRoute } from "wouter";

import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import "../TablasStyles.css";
import "./formStyle.css";
import "../BtnInsertar.css";

export default function FormularioEvaluacionRespondida() {
    const [, params] = useRoute("/listadoEvalResp/:idEvaluacion/:idEDDProyEmpEvaluado");

    const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState([""]); //Recibe la respuesta del backend y la almacena en raw, sin procesar
    const [loadedData, setLoadedData] = useState(false); //Bool que determina el recibimiento correcto de los datos
    const idEDDEvaluacion = params.idEvaluacion;
    const idEDDProyEmpEvaluado = params.idEDDProyEmpEvaluado;
    const [fechaInicioExamen, setfechaInicioExamen] = useState("");
    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

    function GetData() {
        var url = "pages/listados/listadoProyRespFinales.php";
        var operationUrl = "listadoProyRespFinales";
        var data = {
            idEvaluacion: idEDDEvaluacion,
            idEmpleado: userData.idEmpleado,
            idEDDProyEmpEvaluado: idEDDProyEmpEvaluado
        };
        SendDataService(url, operationUrl, data).then((data) => {
            setidEDDEvalPregunta(data);
            setLoadedData(true); //Cambio el estado del booleano
            console.log(data);
        });
    }

    useEffect(
        function () {
            GetData();
        },
        [idEDDEvaluacion, loadedData]
    );




    return userData.statusConected || userData !== null ? (
        <>
            <Header></Header>
            <form> <a
                style={{ margin: '10px' }}
                type="submit"
                id="btnAtras"
                value="Registrar"
                href="javascript: history.go(-1)">Volver
            </a>
                <Container id="textStyle">

                    <h2>Resultados de la evaluación</h2>
                </Container>
                <Container id="fondoTabla1">
                    <br></br>
                    {idEDDEvalPregunta.map((idEDDEvalPregunta) => (
                        <Table>
                            <tr>
                                <td id="pregunta">
                                    {idEDDEvalPregunta.ordenPregunta}. &nbsp;
                                    {idEDDEvalPregunta.pregunta} &nbsp;
                                    {idEDDEvalPregunta.nomCompetencia}
                                </td>
                            </tr>

                            <tr key={idEDDEvalPregunta.idEDDEvalRespPreg}>
                                <td id="respuesta">
                                    {idEDDEvalPregunta.respuesta == '' ? (
                                        <h1>Pregunta no respondida</h1>
                                    ) : (
                                        idEDDEvalPregunta.respuesta
                                    )}&nbsp;

                                </td>
                            </tr>
                            <br></br>
                        </Table>
                    ))}

                </Container>
            </form>
        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );

}
