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
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import RadialSeparators from "./RadialSeparators";
import carita_excelente from "../Smileys/carita_excelente.png"
import carita_mejora from "../Smileys/carita_mejora.png"
import carita_atencion from "../Smileys/carita_atencion.png"
import carita_situacion from "../Smileys/carita_situacion.png"
import carita_alerta from "../Smileys/carita_alerta.png"
import ProgressBar from 'react-bootstrap/ProgressBar';


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
        const [listConfigTiempoPromedio, setListConfigTiempoPromedio] =
        useState("");
    const [loadedDataLeyenda, setLoadedDataLeyenda] = useState(false);

    const [loadedDataResumenEval, setLoadedDataResumenEval] = useState(false);
    const [loadedDataCompetencias, setLoadedDataCompetencias] = useState(false);
    const [loadedDataRango, setLoadedDataRango] = useState(false);
    const [loadedDataColor, setLoadedDataColor] = useState(false);
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

    function GetDataResumenEval() {
        var url = "pages/listados/listadoResumenEval.php";
        var operationUrl = "listadoResumenEval";
        var data = {
            idEvaluacion: idEDDEvaluacion,
            idProyecto: idEDDProyecto,
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
        };
        SendDataService(url, operationUrl, data).then((data) => {
            setListCompetencias(data);
            setLoadedDataCompetencias(true);
            // console.log('Response', data);
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

console.log(listResumenEval);
        if (loadedDataResumenEval && loadedDataTiempoPromedio) {
            return (
                <div id="tableResumen">
                    <Table>

                        <tr >
                            <td >
                                <CircularProgressbarWithChildren
                                    maxValue={100}
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
                                    maxValue={listResumenEval[0].referentesEvaluados}
                                    value={listResumenEval[0].referentesEvaluados}
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
                                {carita_exc}
                                {carita_mej}
                                {carita_atenc}
                                {carita_sit}
                                {carita_aler}
                            </td>


                        </>
                    );


                }
            });

            return (
                <div>
                    <br></br>
                    <table responsive style={{ backgroundColor: 'white', width: '50%', borderRadius: '20px', margin: 'auto' }}>

                        {tableRows}

                    </table><br></br></div>)
        }
    }

    function InfoExag2() {
        var list_proc_emp = {};
        var contador = 0;
        var evaluadores = [];

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

                if (Object.keys(listCompetencias).length === contador) {
                    evaluadores = Object.keys(list_proc_emp);
                }
            });
        }

        // Función para dividir en grupos de 3 evaluadores por fila
        function chunkArray(arr, chunkSize) {
            const result = [];
            for (let i = 0; i < arr.length; i += chunkSize) {
                result.push(arr.slice(i, i + chunkSize));
            }
            return result;
        }

        const evaluadoresPorFila = chunkArray(evaluadores, 3);

        return (
            <table id="table" responsive >
                <div>
                    {evaluadoresPorFila.map((filaEvaluadores, index) => (
                        <div key={index} style={{ display: 'flex' }}>
                            {filaEvaluadores.map((evaluador) => (
                                <table
                                    key={evaluador}
                                    style={{
                                        backgroundColor: 'white',
                                        width: '26em',
                                        borderRadius: '10px',
                                        margin: '5px', // Espacio entre tablas
                                    }}
                                    responsive
                                >
                                    <thead>
                                        <tr>
                                            <td valign="top" style={{ width: '10em' }}>
                                                <table>
                                                    <th style={{ padding: '1em' }} >REFERENTE
                                                        <td>{evaluador}</td>
                                                    </th>
                                                </table>
                                            </td>
                                            <td style={{ width: '16em' }}>
                                                <table style={{ width: '100%' }}>
                                                    <tr style={{ borderBottom: '1px #808080 solid' }}>
                                                        <th style={{ padding: '1em' }}>COLABORADOR</th>
                                                    </tr>
                                                    <tbody>
                                                        {Object.keys(list_proc_emp[evaluador]).map((empleado) => {
                                                            // console.log('list_proc_emp',list_proc_emp);
                                                            const porcentajes = list_proc_emp[evaluador][empleado];
                                                            const suma = porcentajes.reduce((total, porcentaje) => total + parseFloat(porcentaje), 0);
                                                            const promedio = suma / porcentajes.length;

                                                            return (
                                                                <tr style={{ borderTop: '1px #DCDCDC solid' }}>
                                                                    <td style={{ fontSize: '11pt', padding: '3px', fontWeight: '400', fontFamily: 'arial' }}>
                                                                        {empleado} &nbsp;
                                                                        <td id="infoLinePorc" style={{ width: '13em' }}>
                                                                            <ProgressBar className='lightGreen-progress-bar' now={promedio} label={`${promedio.toFixed(2)}%`} />
                                                                        </td>
                                                                    </td>
                                                                    <td>
                                                                        <td >
                                                                            <ArrowsTemplate porcAprobComp={promedio} />

                                                                        </td>

                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </thead>
                                </table>
                            ))}
                        </div>
                    ))}
                </div>
            </table>
        );
    }


    useEffect(
        function () {
            GetDataResumenEval();
            GetDataCompetencias();
            GetConfigTiempoPromedio();
            GetConfigCompColorFlechas();
            GetConfigCompRangoFlechas();
            GetConfigCompRangoLeyenda()

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
            <BodyResumen2></BodyResumen2>

            {/* LEYENDAS */}
            <InfoArrows></InfoArrows>
            {/* FIN LEYENDAS */}

            <InfoExag2></InfoExag2>

            {/* <InfoArrows></InfoArrows> */}



            <div class="bg-light mx-auto px-2"
                style={{ width: "50em", height: "27em" }}>
                <GrafChart idEDDEvaluacion={idEDDEvaluacion} idEDDProyecto={idEDDProyecto} />
            </div>




        </div>

    ) : (
        <Navigate to="/login"></Navigate>

    );
}

