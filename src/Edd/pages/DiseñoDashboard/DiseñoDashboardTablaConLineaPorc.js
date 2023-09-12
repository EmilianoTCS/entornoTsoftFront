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
import ProgressBar from 'react-bootstrap/ProgressBar';


export default function DiseñoDashboardTablaConLineasPorc() {
    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
    const satGeneral = 66;
    const refEval = '2/4';
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


            <table id="table" responsive>

                <tr>
                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', borderRadius: '10px' }}>
                            <thead>
                                <tr>

                                    <th id='borderTdThPORC' style={{ padding: '1em' }} >REFERENTE</th>
                                    <th id='borderTdThPORC' style={{ padding: '1em' }} >COLABORADOR</th>
                                </tr>
                            </thead>

                            <tbody >
                                <tr >
                                    <th rowspan="5" style={{ width: '40%' }}>Romina Alvarez</th>
                                    <th id="paddingColab">Florencia 90%&nbsp; <img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar animated now={90} label={`${90}%`} /></th>

                                </tr>
                                <tr >
                                    <th id="paddingColab">Emiliano 88%&nbsp;<img id="faceStyleLinea" src={faceVerdeLima2}></img>
                                        <ProgressBar animated now={88} label={`${88}%`} /></th>

                                </tr>
                                <tr >
                                    <th id="paddingColab">Daniela 72%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar animated now={72} label={`${72}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Juan 47%&nbsp;<img id="faceStyleLinea" src={faceNaranja4}></img>
                                        <ProgressBar animated now={47} label={`${47}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Esteban 22%&nbsp;<img id="faceStyleLinea" src={faceRojo5}></img>
                                        <ProgressBar animated now={22} label={`${22}%`} /> </th>
                                </tr>

                            </tbody>
                        </table>

                    </td>

                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', borderRadius: '10px' }}>
                            <thead>
                                <tr>

                                    <th id='borderTdThPORC' style={{ padding: '1em' }} >REFERENTE</th>
                                    <th id='borderTdThPORC' style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody >
                                <tr >
                                    <th rowspan="5" style={{ width: '40%' }}>Romina Alvarez</th>
                                    <th id="paddingColab">Florencia 90%&nbsp; <img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar animated now={90} label={`${90}%`} /></th>

                                </tr>
                                <tr >
                                    <th id="paddingColab">Emiliano 88%&nbsp;<img id="faceStyleLinea" src={faceVerdeLima2}></img>
                                        <ProgressBar animated now={88} label={`${88}%`} /></th>

                                </tr>
                                <tr >
                                    <th id="paddingColab">Daniela 72%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar animated now={72} label={`${72}%`} /></th>
                                </tr>

                                <tr >
                                    <th id="paddingColab">Juan 47%&nbsp;<img id="faceStyleLinea" src={faceNaranja4}></img>
                                        <ProgressBar animated now={47} label={`${47}%`} /></th>
                                </tr>



                                <tr >
                                    <th id="paddingColab">Esteban 22%&nbsp;<img id="faceStyleLinea" src={faceRojo5}></img>
                                        <ProgressBar animated now={22} label={`${22}%`} /> </th>
                                </tr>

                            </tbody>
                        </table>
                    </td>

                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', borderRadius: '10px' }}>
                            <thead>
                                <tr>

                                    <th id='borderTdThPORC' style={{ padding: '1em' }} >REFERENTE</th>
                                    <th id='borderTdThPORC' style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{ width: '40%' }}>Josefina Perez</th>
                                    <th id="paddingColab">Florencia 65%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar animated now={65} label={`${65}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Emiliano 88%&nbsp;<img id="faceStyleLinea" src={faceVerdeLima2}></img>
                                        <ProgressBar animated now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Daniela 52%&nbsp;<img id="faceStyleLinea" src={faceNaranja4}></img>
                                        <ProgressBar animated now={62} label={`${62}%`} /> </th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Juan 47%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar animated now={100} label={`${100}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Esteban 22%&nbsp;<img id="faceStyleLinea" src={faceRojo5}></img>
                                        <ProgressBar animated now={32} label={`${32}%`} /> </th>
                                </tr>

                            </tbody>
                        </table>

                    </td>
                </tr>
                <br></br>

                {/* ----------------- */}

                <tr>
                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', borderRadius: '10px' }}>


                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{ width: '40%' }}>Fatima Gonzales</th>
                                    <th id="paddingColab">Florencia 60%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>

                                </tr>
                                <tr >
                                    <th id="paddingColab">Emiliano 28%&nbsp;<img id="faceStyleLinea" src={faceRojo5}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Daniela 72%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Juan 97%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Esteban 100%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>
                                </tr>

                            </tbody>
                        </table>
                    </td>

                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', borderRadius: '10px' }}>


                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{ width: '40%' }}>Fatima Gonzales</th>
                                    <th id="paddingColab">Florencia 60%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>

                                </tr>
                                <tr >
                                    <th id="paddingColab">Emiliano 28%&nbsp;<img id="faceStyleLinea" src={faceRojo5}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Daniela 72%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Juan 97%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Esteban 100%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>
                                </tr>

                            </tbody>
                        </table>
                    </td>

                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', borderRadius: '10px' }}>

                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{ width: '40%' }} >Marcelo Cortes Ortega</th>
                                    <th id="paddingColab">Florencia 40%&nbsp;<img id="faceStyleLinea" src={faceNaranja4}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>

                                </tr>
                                <tr >
                                    <th id="paddingColab">Emiliano 28%&nbsp;<img id="faceStyleLinea" src={faceRojo5}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Daniela 72%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Juan 97%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar now={88} label={`${88}%`} /> </th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Esteban 62%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar now={88} label={`${88}%`} /> </th>
                                </tr>

                            </tbody>
                        </table>


                    </td>
                </tr>

                <br></br>

                {/* ----------------- */}

                <tr>
                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', borderRadius: '10px' }}>


                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{ width: '40%' }}>Fatima Gonzales</th>
                                    <th id="paddingColab">Florencia 60%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>

                                </tr>
                                <tr >
                                    <th id="paddingColab">Emiliano 28%&nbsp;<img id="faceStyleLinea" src={faceRojo5}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Daniela 72%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Juan 97%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Esteban 100%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>
                                </tr>

                            </tbody>
                        </table>
                    </td>

                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', borderRadius: '10px' }}>


                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{ width: '40%' }}>Fatima Gonzales</th>
                                    <th id="paddingColab">Florencia 60%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>

                                </tr>
                                <tr >
                                    <th id="paddingColab">Emiliano 28%&nbsp;<img id="faceStyleLinea" src={faceRojo5}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Daniela 72%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Juan 97%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Esteban 100%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>
                                </tr>

                            </tbody>
                        </table>
                    </td>

                    <td style={{ width: '32%' }}>
                        <table style={{ backgroundColor: 'white', borderRadius: '10px' }}>

                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{ width: '40%' }} >Esteban Ramirez</th>
                                    <th id="paddingColab">Florencia 40%&nbsp;<img id="faceStyleLinea" src={faceNaranja4}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>

                                </tr>
                                <tr >
                                    <th id="paddingColab">Emiliano 28%&nbsp;<img id="faceStyleLinea" src={faceRojo5}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Daniela 72%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /></th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Juan 97%&nbsp;<img id="faceStyleLinea" src={faceVerde1}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /> </th>
                                </tr>
                                <tr >
                                    <th id="paddingColab">Esteban 62%&nbsp;<img id="faceStyleLinea" src={faceAmarillo3}></img>
                                        <ProgressBar visuallyHidden now={88} label={`${88}%`} /> </th>
                                </tr>

                            </tbody>
                        </table>


                    </td>
                </tr>

            </table>

























        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );
}
