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
    const [, params] = useRoute("/listadoEvalResp/:idEvaluacion/:idEDDProyEmpEvaluado/:idEDDProyEmpEvaluador");

    const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState([""]); //Recibe la respuesta del backend y la almacena en raw, sin procesar
    const [loadedData, setLoadedData] = useState(false); //Bool que determina el recibimiento correcto de los datos
    const idEDDEvaluacion = params.idEvaluacion;
    const idEDDProyEmpEvaluado = params.idEDDProyEmpEvaluado;
    const idEDDProyEmpEvaluador = params.idEDDProyEmpEvaluador;
    const [idEDDEvalProyResp, setidEDDEvalProyResp] = useState("");
    const [ordenDashboard, setordenDashboard] = useState("");

    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

    function GetData() {
        var url = "pages/listados/listadoProyRespFinales.php";
        var operationUrl = "listadoProyRespFinales";
        var data = {
            idEvaluacion: idEDDEvaluacion,
            idEmpleado: idEDDProyEmpEvaluador,
            idEDDProyEmpEvaluado: idEDDProyEmpEvaluado,
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
    function verEnDashboard({ idEDDEvalProyResp, inputValue }) {

        const url = "pages/cambiarEstado/verEndashboard.php";
        const operationUrl = "verEnDashboard";
        var data = {
            idEDDEvalProyResp: idEDDEvalProyResp,
            verEnDashboard: !inputValue,
            ordenDashboard: 1,
        };

        SendDataService(url, operationUrl, data).then((response) => {
            console.log("response sv", response);
        });


        // const nuevosidEDDEvalPregunta = idEDDEvalPregunta.map((item) => {
        //     console.log(item.idEDDEvalProyResp);
        //     item.idEDDEvalProyResp === idEDDEvalProyResp ? (
        //         item.verEnDashboard = !inputValue, item.verEnDashboard = ordenDashboard
        //     )
        //         : item;
        // }
        // );
        // setidEDDEvalPregunta(nuevosidEDDEvalPregunta)


    }

    var auxEncabezado = "0";
    var auxOrden = "0";

    return userData.statusConected || userData !== null ? (
        <>
            <Header></Header>
            <form> <a
                style={{ margin: '10px', marginTop: '15px', marginLeft: '60px' }}
                type="submit"
                id="btnAtras"
                value="Registrar"
                href="javascript: history.go(-1)">Volver
            </a>
                <Container id="textStyle">
                    {idEDDEvalPregunta.map((idEDDEvalPregunta) => {

                        if (auxEncabezado !== idEDDEvalPregunta.nomEvaluacion) {
                            return (
                                <>
                                    <strong><h2>Resultados de la evaluación: &nbsp;
                                        {auxEncabezado = idEDDEvalPregunta.nomEvaluacion}</h2></strong>
                                    <strong><h5>Realizado por: &nbsp;{idEDDEvalPregunta.nomEvaluador}</h5></strong>
                                </>
                            )
                        }
                    })}
                </Container>

                <Container id="fondoTabla1"><br></br>
                    <Container>
                        {idEDDEvalPregunta.map((idEDDEvalPregunta) => {

                            if (auxOrden !== idEDDEvalPregunta.pregunta) {
                                return (
                                    <>
                                        <Table>
                                            <tr>
                                                <td id="pregunta" style={{ textTransform: 'uppercase' }}>
                                                    {idEDDEvalPregunta.ordenPregunta}. &nbsp;
                                                    {auxOrden = idEDDEvalPregunta.pregunta} &nbsp;
                                                    {idEDDEvalPregunta.nomCompetencia}
                                                </td>
                                            </tr>
                                            
                                            <input type="checkbox" value={idEDDEvalPregunta.verEnDashboard
                                            === "0" ? false : true} checked={idEDDEvalPregunta.verEnDashboard === "1" ? true : false} 
                                           
                                            onChange={({ target }) => {
                                                verEnDashboard({ idEDDEvalProyResp: idEDDEvalPregunta.idEDDEvalProyResp, inputValue: target.value })
                                            }}
                                            ></input>
                                            <tr>

                                                <td id="respuesta" style={{ textTransform: 'uppercase' }}>
                                                    {idEDDEvalPregunta.respuesta === null ? (
                                                        <h6>No respondida</h6>
                                                    ) : (
                                                        idEDDEvalPregunta.respuesta
                                                    )}
                                                </td>
                                            </tr>
                                            <br></br>
                                        </Table>
                                    </>
                                )
                            }
                        })} &nbsp;

                    </Container>
                </Container>
            </form><br></br><br></br>
        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );

}
