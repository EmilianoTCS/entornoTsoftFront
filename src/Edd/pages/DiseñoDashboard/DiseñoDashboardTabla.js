import React, { useState, useEffect } from "react";
import { Table, Container, Row, Col } from "react-bootstrap";
import Header from "../../../templates/Header/Header";
import "../Listados/BtnInsertar.css";
import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import RadialSeparators from "./RadialSeparators";
import "../home/homeEDD.css"
import faceVerde1 from "../Smileys/faceVerde1.png"
import faceVerdeLima2 from "../Smileys/faceVerdeLima2.png"
import faceAmarillo3 from "../Smileys/faceAmarillo3.png"
import faceNaranja4 from "../Smileys/faceNaranja4.png"
import faceRojo5 from "../Smileys/faceRojo5.png"
import LinesChart from "./LineChart";

export default function DiseñoDashboardTabla() {
    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
    const satGeneral = 66;
    const refEval = 2;
    const compEval = 13;
    const tiempProm = 0.23;


    //PAGINADOR ---------------------

    return userData.statusConected || userData !== null ? (
        <>
            <Header></Header>

            <a

                type="submit"
                id="btnAtrasPRUEBASDash"
                value="Registrar"
                href="/home">Volver
            </a>
            <h4 style={{ color: 'white' }}>EVALUACIÓN COLABORADOR</h4>
            <br></br>
            <Table style={{ width: '70%', margin: 'auto' }}>
                <tr >
                    <td>
                        <CircularProgressbar value={66} text={`${satGeneral}%`}
                            background
                            backgroundPadding={6}
                            styles={buildStyles({
                                backgroundColor: "#3e98c7",
                                textColor: "#fff",
                                pathColor: "#fff",
                                trailColor: "transparent"
                            })}
                        />
                    </td>
                    <td>
                        <CircularProgressbar maxValue={4} value={2} text={`${refEval}`} />
                    </td>
                    <td>
                        <CircularProgressbarWithChildren
                            background
                            value={80}
                            text={`${80}%`}
                            strokeWidth={10}
                            styles={buildStyles({
                                strokeLinecap: "butt"
                            })}
                        >
                            <RadialSeparators
                                count={12}
                                style={{
                                    background: "#fff",
                                    width: "2px",
                                    // This needs to be equal to props.strokeWidth
                                    height: `${10}%`
                                }}
                            />
                        </CircularProgressbarWithChildren>
                    </td>
                    {/* FONDO BLANCO SIN RAYAS */}
                    {/* <td style={{ width: 100 }}>
                        <CircularProgressbarWithChildren
                            background
                            backgroundPadding={6}

                            value={80}
                            text={`${80}%`}
                            strokeWidth={10}
                            styles={buildStyles({
                                strokeLinecap: "butt"
                            })}
                        >
                            <RadialSeparators
                                count={12}
                                style={{
                                    background: "#fff",
                                    width: "2px",
                                    // This needs to be equal to props.strokeWidth
                                    height: `${10}%`
                                }}
                            />
                        </CircularProgressbarWithChildren>
                    </td> */}
                    <td>
                        <CircularProgressbar value={100} text={`${compEval}`} />
                    </td>
                    <td>
                        <CircularProgressbar value={100} text={`${tiempProm}`} />
                    </td>
                </tr>
            </Table>
            <br></br>

            <table id="tableLeyendas">
                <tr>
                    <td><div className="bg-light mx-auto" style={{ width: "55em", height: "70%", padding: '16px' }}>
                        <LinesChart />
                    </div></td>

                    <td>
                        <table style={{ backgroundColor: 'white', width: '10em', borderRadius: '20px',marginLeft:'1em' }}>
                            <tr>
                                <td id="infoLinePorcLeyendas">
                                <b>EXCELENTE</b>
                                </td>
                                <td>
                                    <img id="sizeCaritas" src={faceVerde1}></img>
                                </td>
                            </tr>
                            <tr>
                                <td id="infoLinePorcLeyendas">
                                <b>OPORTUNIDAD DE MEJORA</b>
                                </td>
                                <td>
                                    <img id="sizeCaritas" src={faceVerdeLima2}></img>
                                </td>
                            </tr>
                            <tr>
                                <td id="infoLinePorcLeyendas">
                                <b>REQUIERE ATENCIÓN
</b>
                                </td>
                                <td>
                                    <img id="sizeCaritas" src={faceAmarillo3}></img>
                                </td>
                            </tr>
                            <tr>
                                <td id="infoLinePorcLeyendas">
                                    <b>REVISAR SITUACIÓN</b>


                                </td>
                                <td>
                                    <img id="sizeCaritas" src={faceNaranja4}></img>
                                </td>
                            </tr>
                            <tr>
                                <td id="infoLinePorcLeyendas">
                                    <b>ALERTA</b>
                                </td>
                                <td>
                                    <img id="sizeCaritas" src={faceRojo5}></img>
                                </td>
                            </tr>
                        </table>
                    </td>

                </tr>

            </table>
            <br></br>

            <table id="table1" responsive>

                <tr>
                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', width: '26em' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} id="borderTdTh">REFERENTE</th>
                                    <th style={{ padding: '1em' }} id="borderTdTh">COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr id="borderTdTh">
                                    <th rowspan="5" id="borderTdTh" style={{ width: '10em', paddingLeft: '1em' }}>Romina Alvarez </th>
                                    <td id="infoTable">Florencia Lorenzati <b>15%</b>&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>

                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Emiliano <b>88%</b>&nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Daniela <b>82%</b>&nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Juan <b>61%</b>&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Esteban <b>22%</b>&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>
                                </tr>

                            </tbody>
                        </table>
                    </td>

                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', width: '26em' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} id="borderTdTh">REFERENTE</th>
                                    <th style={{ padding: '1em' }} id="borderTdTh">COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr id="borderTdTh">
                                    <th rowspan="5" id="borderTdTh" style={{ width: '10em', paddingLeft: '1em' }}>Josefina Perez</th>
                                    <td id="infoTable">Florencia Lorenzati <b>89%</b>&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>

                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Emiliano <b>69%</b>&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Daniela <b>62%</b>&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Juan <b>42%</b>&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Esteban <b>92%</b>&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>
                                </tr>

                            </tbody>
                        </table>
                    </td>


                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', width: '26em' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} id="borderTdTh">REFERENTE</th>
                                    <th style={{ padding: '1em' }} id="borderTdTh">COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr id="borderTdTh">
                                    <th rowspan="5" id="borderTdTh" style={{ width: '10em', paddingLeft: '1em' }}>Josefina Perez</th>
                                    <td id="infoTable">Florencia Lorenzati <b>10%</b>&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>

                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Emiliano <b>88%</b>&nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Daniela <b>92%</b>&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Juan <b>51%</b>&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Esteban <b>42%</b>&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>
                                </tr>

                            </tbody>
                        </table>
                    </td>

                </tr>
                <br></br>
                <tr>
                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', width: '26em' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} id="borderTdTh">REFERENTE</th>
                                    <th style={{ padding: '1em' }} id="borderTdTh">COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr id="borderTdTh">
                                    <th rowspan="5" id="borderTdTh" style={{ width: '10em', paddingLeft: '1em' }}>Josefina Perez</th>
                                    <td id="infoTable">Florencia Lorenzati <b>90%</b>&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>

                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Emiliano <b>88%</b>&nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Daniela <b>79%</b>&nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Juan <b>87%</b>&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Esteban <b>32%</b>&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>
                                </tr>

                            </tbody>
                        </table>
                    </td>


                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', width: '26em' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} id="borderTdTh">REFERENTE</th>
                                    <th style={{ padding: '1em' }} id="borderTdTh">COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr id="borderTdTh">
                                    <th rowspan="5" id="borderTdTh" style={{ width: '10em', paddingLeft: '1em' }}>Josefina Perez</th>
                                    <td id="infoTable">Florencia Lorenzati <b>45%</b>&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>

                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Emiliano <b>88%</b>&nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Daniela <b>62%</b>&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Juan <b>57%</b>&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Esteban <b>82%</b>&nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> </td>
                                </tr>

                            </tbody>
                        </table>
                    </td>



                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', width: '26em' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} id="borderTdTh">REFERENTE</th>
                                    <th style={{ padding: '1em' }} id="borderTdTh">COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr id="borderTdTh">
                                    <th rowspan="5" id="borderTdTh" style={{ width: '10em', paddingLeft: '1em' }}>Josefina Perez</th>
                                    <td id="infoTable">Florencia Lorenzati <b>40%</b>&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>

                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Emiliano <b>88%</b>&nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Daniela <b>22%</b>&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Juan <b>47%</b>&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>
                                </tr>
                                <tr id="borderTdTh">
                                    <td id="infoTable">Esteban <b>62%</b>&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                                </tr>

                            </tbody>
                        </table>
                    </td>
                </tr>
                <br></br>
            </table>


        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );
}
