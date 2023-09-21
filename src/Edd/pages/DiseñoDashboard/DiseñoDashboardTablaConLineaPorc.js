import React, { useState, useEffect } from "react";
import { Table, Container, Row, Col } from "react-bootstrap";
import Header from "../../../templates/Header/Header";
import "../Listados/BtnInsertar.css";
import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import RadialSeparators from "./RadialSeparators";
import "../home/homeEDD.css"
import "../DiseñoDashboard/prueba.css";
import faceVerde1 from "../Smileys/faceVerde1.png"
import faceVerdeLima2 from "../Smileys/faceVerdeLima2.png"
import faceAmarillo3 from "../Smileys/faceAmarillo3.png"
import faceNaranja4 from "../Smileys/faceNaranja4.png"
import faceRojo5 from "../Smileys/faceRojo5.png"
import ProgressBar from 'react-bootstrap/ProgressBar';
import LinesChart from "./LineChart";
import GradientSVG from "./GradientSVG";

export default function DiseñoDashboardTablaConLineasPorc() {
    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
    const satGeneral = 74;
    const refEval = '2/4';
    const compEval = 13;
    const tiempProm = 0.23;
    const idCSS = "hello";


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
            <h4 >EVALUACIÓN COLABORADOR</h4>
<div id="tableResumen">
            <Table>

                <tr >
                    <td >
                        <CircularProgressbarWithChildren
                            value={satGeneral}
                            background
                          
                            
                            // text={`${80}%`}
                            strokeWidth={10}
                            styles={buildStyles({
                                strokeLinecap: 'butt',
                                pathColor: "#94FF01",
                                trailColor: "#E5E7E9",
                                backgroundColor:'white',
                                
                                
                            })}
                        >

                            <div style={{ fontSize: 20, textAlign: 'center' }}>
                                <strong>Satisfacción</strong>
                                <br></br>
                                <strong>{satGeneral}%</strong>
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
                            value={50}
                            background
                            // text={`${80}%`}
                            strokeWidth={10}
                            styles={buildStyles({
                                pathColor: "#2980B9",
                                trailColor: "#E5E7E9",
                                strokeLinecap: 'butt',
                                backgroundColor:'white'
                            })}
                        >
                            <div style={{ fontSize: 20, textAlign: 'center' }}>
                                <strong>Referentes</strong>
                                <br></br>
                                <strong>{refEval}</strong>
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
                                pathColor: "#2980B9",
                                trailColor: "grey",
                                backgroundColor:'white'
                            })}
                        >
                            <div style={{ fontSize: 20, textAlign: 'center' }}>
                                <strong>Competencias</strong>
                                <br></br>
                                <strong>{compEval}</strong>
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
                            value={100}
                            background
                            // text={`${80}%`}
                            strokeWidth={10}
                            styles={buildStyles({
                                strokeLinecap: 'butt',
                                pathColor: "#2980B9",
                                trailColor: "grey",
                                backgroundColor:'white'
                            })}
                        >
                            <div style={{ fontSize: 20, textAlign: 'center' }}>
                                <strong>Tiempo</strong>
                                <br></br>
                                <strong>{tiempProm}min</strong>
                                <br></br>
                                <strong>Tiempo</strong>
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
            <br></br>
            <table style={{ backgroundColor: 'white', width: '50%', borderRadius: '20px', margin: 'auto' }}>

                <td id="infoLinePorcLeyendasREFERENTE">
                    <b>EXCELENTE</b>
                </td>

                <td className="linea">
                    <img id="sizeCaritasReferentes" src={faceVerde1}></img>
                </td>

                <td id="infoLinePorcLeyendasREFERENTE">
                    <b>OPORTUNIDAD DE MEJORA</b>
                </td>
                <td className="linea">
                    <img id="sizeCaritasReferentes" src={faceVerdeLima2}></img>
                </td>

                <td id="infoLinePorcLeyendasREFERENTE">
                    <b>REQUIERE ATENCIÓN
                    </b>
                </td>
                <td className="linea">
                    <img id="sizeCaritasReferentes" src={faceAmarillo3}></img>
                </td>

                <td id="infoLinePorcLeyendasREFERENTE">
                    <b>REVISAR SITUACIÓN</b>


                </td>
                <td className="linea">
                    <img id="sizeCaritasReferentes" src={faceNaranja4}></img>
                </td>

                <td id="infoLinePorcLeyendasREFERENTE">
                    <b>ALERTA</b>
                </td>
                <td >
                    <img id="sizeCaritasReferentes" src={faceRojo5}></img>
                </td>

            </table>
            <br></br>

            <table id="table" responsive >
                <tr>

                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr >
                                    <td valign="top" style={{ width: '10em' }}>
                                        <table >
                                            <th style={{ padding: '1em' }} >REFERENTE
                                                <td>Joaquín Aguirre </td>
                                            </th>
                                        </table>
                                    </td>
                                    <td style={{ width: '16em' }}>
                                        <table style={{ width: '100%' }}>

                                            <tr>
                                                <th style={{ padding: '1em' }} >COLABORADOR</th>
                                            </tr>
                                            <tr >

                                                <td id="infoLinePorc">Florencia Lorenzati &nbsp;
                                                    <ProgressBar className='yellow-progress-bar' now={65} label={`${65}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceAmarillo3}></img> </td>

                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Emiliano Sotomayor &nbsp;
                                                    <ProgressBar className='red-progress-bar' now={33} label={`${33}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceRojo5}></img> </td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Daniela Pérez &nbsp;
                                                    <ProgressBar className='orange-progress-bar' now={51} label={`${51}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceNaranja4}></img></td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Juan Aguirre &nbsp;
                                                    <ProgressBar className='orange-progress-bar' now={59} label={`${59}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceNaranja4}></img></td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Esteban Domínguez &nbsp;
                                                    <ProgressBar className='lightGreen-progress-bar' now={81} label={`${81}%`} /></td>
                                                <td ><img id="sizeCaritas" src={faceVerdeLima2}></img> </td>

                                            </tr>



                                        </table>
                                    </td>

                                </tr>
                            </thead>

                        </table>
                    </td>
                    <td>
                        &nbsp;
                    </td>
                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr >
                                    <td valign="top" style={{ width: '10em' }}>
                                        <table >
                                            <th style={{ padding: '1em' }} >REFERENTE
                                                <td>Marco Díaz</td>
                                            </th>
                                        </table>
                                    </td>
                                    <td style={{ width: '16em' }}>
                                        <table style={{ width: '100%' }}>

                                            <tr>
                                                <th style={{ padding: '1em' }} >COLABORADOR</th>
                                            </tr>
                                            <tr >

                                                <td id="infoLinePorc">Florencia Lorenzati &nbsp;
                                                    <ProgressBar className='green-progress-bar' now={99} label={`${99}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceVerde1}></img></td>

                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Emiliano Sotomayor &nbsp;
                                                    <ProgressBar className='lightGreen-progress-bar' now={79} label={`${79}%`} /></td>
                                                <td ><img id="sizeCaritas" src={faceVerdeLima2}></img> </td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Daniela Pérez &nbsp;
                                                    <ProgressBar className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceAmarillo3}></img> </td>

                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Juan Aguirre &nbsp;
                                                    <ProgressBar className='lightGreen-progress-bar' now={83} label={`${83}%`} /></td>
                                                <td ><img id="sizeCaritas" src={faceVerdeLima2}></img> </td>

                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Esteban Domínguez &nbsp;
                                                    <ProgressBar className='orange-progress-bar' now={46} label={`${46}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceNaranja4}></img></td>

                                            </tr>



                                        </table>
                                    </td>

                                </tr>
                            </thead>

                        </table>
                    </td>
                    <td>
                        &nbsp;
                    </td>

                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr >
                                    <td valign="top" style={{ width: '10em' }}>
                                        <table >
                                            <th style={{ padding: '1em' }} >REFERENTE
                                                <td>Romina Álvarez</td>
                                            </th>
                                        </table>
                                    </td>
                                    <td style={{ width: '16em' }}>
                                        <table style={{ width: '100%' }}>

                                            <tr>
                                                <th style={{ padding: '1em' }} >COLABORADOR</th>
                                            </tr>
                                            <tr >

                                                <td id="infoLinePorc">Florencia Lorenzati &nbsp;
                                                    <ProgressBar className='lightGreen-progress-bar' now={75} label={`${75}%`} /></td>
                                                <td ><img id="sizeCaritas" src={faceVerdeLima2}></img> </td>


                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Emiliano Sotomayor &nbsp;
                                                    <ProgressBar className='green-progress-bar' now={93} label={`${93}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceVerde1}></img></td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Daniela Pérez &nbsp;
                                                    <ProgressBar className='orange-progress-bar' now={45} label={`${45}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceNaranja4}></img></td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Juan Aguirre &nbsp;
                                                    <ProgressBar className='red-progress-bar' now={16} label={`${16}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceRojo5}></img> </td>

                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Esteban Domínguez &nbsp;
                                                    <ProgressBar className='yellow-progress-bar' now={67} label={`${67}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceAmarillo3}></img> </td>
                                            </tr>




                                        </table>
                                    </td>

                                </tr>
                            </thead>

                        </table>
                    </td>
                </tr>
                <br></br>
                <tr>
                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr >
                                    <td valign="top" style={{ width: '10em' }}>
                                        <table >
                                            <th style={{ padding: '1em' }} >REFERENTE
                                                <td>Jose Ramírez Ramírez Ramírez Ramírez</td>
                                            </th>
                                        </table>
                                    </td>
                                    <td style={{ width: '16em' }}>
                                        <table style={{ width: '100%' }}>

                                            <tr>
                                                <th style={{ padding: '1em' }} >COLABORADOR</th>
                                            </tr>
                                            <tr >

                                                <td id="infoLinePorc">Florencia Lorenzati &nbsp;
                                                    <ProgressBar className='red-progress-bar' now={27} label={`${27}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceRojo5}></img> </td>

                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Emiliano Sotomayor &nbsp;
                                                    <ProgressBar className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceAmarillo3}></img> </td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Daniela Pérez &nbsp;
                                                    <ProgressBar className='yellow-progress-bar' now={56} label={`${56}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceAmarillo3}></img></td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Juan Aguirre &nbsp;
                                                    <ProgressBar className='yellow-progress-bar' now={48} label={`${48}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceAmarillo3}></img></td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Esteban Domínguez &nbsp;
                                                    <ProgressBar className='green-progress-bar' now={98} label={`${98}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceVerde1}></img></td>
                                            </tr>



                                        </table>
                                    </td>

                                </tr>
                            </thead>

                        </table>
                    </td>
                    <td>
                        &nbsp;
                    </td>
                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr >
                                    <td valign="top" style={{ width: '10em' }}>
                                        <table >
                                            <th style={{ padding: '1em' }} >REFERENTE
                                                <td>Marcelo Cortés Ortega</td>
                                            </th>
                                        </table>
                                    </td>
                                    <td style={{ width: '16em' }}>
                                        <table style={{ width: '100%' }}>

                                            <tr>
                                                <th style={{ padding: '1em' }} >COLABORADOR</th>
                                            </tr>
                                            <tr >

                                                <td id="infoLinePorc">Florencia Lorenzati&nbsp;
                                                    <ProgressBar className='yellow-progress-bar' now={53} label={`${53}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceAmarillo3}></img></td>

                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Emiliano Sotomayor &nbsp;
                                                    <ProgressBar className='red-progress-bar' now={33} label={`${33}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceRojo5}></img> </td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Daniela Pérez &nbsp;
                                                    <ProgressBar className='orange-progress-bar' now={41} label={`${41}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceNaranja4}></img></td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Juan Aguirre &nbsp;
                                                    <ProgressBar className='green-progress-bar' now={100} label={`${100}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceVerde1}></img></td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Esteban Domínguez &nbsp;
                                                    <ProgressBar className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceAmarillo3}></img> </td>
                                            </tr>



                                        </table>
                                    </td>

                                </tr>
                            </thead>

                        </table>
                    </td>

                    <td>
                        &nbsp;
                    </td>

                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr >
                                    <td valign="top" style={{ width: '10em' }}>
                                        <table >
                                            <th style={{ padding: '1em' }} >REFERENTE
                                                <td>Laura Pérez</td>
                                            </th>
                                        </table>
                                    </td>
                                    <td style={{ width: '16em' }}>
                                        <table style={{ width: '100%' }}>

                                            <tr>
                                                <th style={{ padding: '1em' }} >COLABORADOR</th>
                                            </tr>
                                            <tr >

                                                <td id="infoLinePorc">Florencia Lorenzati &nbsp;
                                                    <ProgressBar className='lightGreen-progress-bar' now={79} label={`${79}%`} /></td>
                                                <td ><img id="sizeCaritas" src={faceVerdeLima2}></img> </td>

                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Emiliano Sotomayor &nbsp;
                                                    <ProgressBar className='red-progress-bar' now={35} label={`${35}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceRojo5}></img> </td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Daniela Pérez &nbsp;
                                                    <ProgressBar className='yellow-progress-bar' now={53} label={`${53}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceAmarillo3}></img></td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Juan Aguirre &nbsp;
                                                    <ProgressBar className='red-progress-bar' now={20} label={`${20}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceRojo5}></img></td>
                                            </tr>
                                            <tr >
                                                <td id="infoLinePorc">Esteban Domínguez &nbsp;
                                                    <ProgressBar className='green-progress-bar' now={92} label={`${92}%`} /></td>
                                                <td><img id="sizeCaritas" src={faceVerde1}></img> </td>
                                            </tr>



                                        </table>
                                    </td>

                                </tr>
                            </thead>

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
