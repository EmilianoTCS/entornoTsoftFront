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
import LinesChart from "./LineChart";


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

            <table id="table" responsive >
                <tr>
                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody >

                                <tr >
                                    <th rowspan="5" style={{ width: '10em', paddingLeft: '1em' }}>Romina Alvarez </th>
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
                                    <td id="infoLinePorc">Daniela Perez &nbsp;
                                        <ProgressBar className='orange-progress-bar' now={51} label={`${51}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceNaranja4}></img></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan Aguirre &nbsp;
                                        <ProgressBar className='orange-progress-bar' now={59} label={`${59}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceNaranja4}></img></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban Dominguez &nbsp;
                                        <ProgressBar className='lightGreen-progress-bar' now={81} label={`${81}%`} /></td>
                                    <td ><img id="sizeCaritas" src={faceVerdeLima2}></img> </td>

                                </tr>

                            </tbody>
                        </table>
                    </td>
                     <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody >

                                <tr >
                                    <th rowspan="5" style={{ width: '10em', paddingLeft: '1em' }}>Romina Alvarez </th>
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
                                    <td id="infoLinePorc">Daniela Perez &nbsp;
                                        <ProgressBar className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceAmarillo3}></img> </td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan Aguirre &nbsp;
                                        <ProgressBar className='lightGreen-progress-bar' now={83} label={`${83}%`} /></td>
                                    <td ><img id="sizeCaritas" src={faceVerdeLima2}></img> </td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban Dominguez &nbsp;
                                        <ProgressBar className='orange-progress-bar' now={46} label={`${46}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceNaranja4}></img></td>

                                </tr>

                            </tbody>
                        </table>
                    </td>


                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody >

                                <tr >
                                    <th rowspan="5" style={{ width: '10em', paddingLeft: '1em' }}>Romina Alvarez </th>
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
                                    <td id="infoLinePorc">Daniela Perez &nbsp;
                                        <ProgressBar className='orange-progress-bar' now={45} label={`${45}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceNaranja4}></img></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan Aguirre &nbsp;
                                        <ProgressBar className='red-progress-bar' now={16} label={`${16}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceRojo5}></img> </td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban Dominguez &nbsp;
                                        <ProgressBar className='yellow-progress-bar' now={67} label={`${67}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceAmarillo3}></img> </td>
                                </tr>

                            </tbody>
                        </table>
                    </td> 
                 </tr>
                <br></br>
                <tr>
                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody >

                                <tr >
                                    <th rowspan="5" style={{ width: '10em', paddingLeft: '1em' }}>Jose Ramirez </th>
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
                                    <td id="infoLinePorc">Daniela Perez &nbsp;
                                        <ProgressBar className='yellow-progress-bar' now={56} label={`${56}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceAmarillo3}></img></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan Aguirre &nbsp;
                                        <ProgressBar className='yellow-progress-bar' now={48} label={`${48}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceAmarillo3}></img></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban Dominguez &nbsp;
                                        <ProgressBar className='green-progress-bar' now={98} label={`${98}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceVerde1}></img></td>
                                </tr>

                            </tbody>
                        </table>
                    </td>
                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody >

                                <tr >
                                    <th rowspan="5" style={{ width: '10em', paddingLeft: '1em' }}>Marcelo Cortes Ortega </th>
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
                                    <td id="infoLinePorc">Daniela Perez &nbsp;
                                        <ProgressBar className='orange-progress-bar' now={41} label={`${41}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceNaranja4}></img></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan Aguirre &nbsp;
                                        <ProgressBar className='green-progress-bar' now={100} label={`${100}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceVerde1}></img></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban Dominguez &nbsp;
                                        <ProgressBar className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceAmarillo3}></img> </td>
                                </tr>

                            </tbody>
                        </table>
                    </td>



                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody >

                                <tr >
                                    <th rowspan="5" style={{ width: '10em', paddingLeft: '1em' }}>Laura Perez </th>
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
                                    <td id="infoLinePorc">Daniela Perez &nbsp;
                                        <ProgressBar className='yellow-progress-bar' now={53} label={`${53}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceAmarillo3}></img></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan Aguirre &nbsp;
                                        <ProgressBar className='red-progress-bar' now={20} label={`${20}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceRojo5}></img></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban Dominguez &nbsp;
                                        <ProgressBar className='green-progress-bar' now={92} label={`${92}%`} /></td>
                                    <td><img id="sizeCaritas" src={faceVerde1}></img> </td>
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
