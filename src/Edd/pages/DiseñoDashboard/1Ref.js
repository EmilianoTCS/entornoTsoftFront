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
import { FaCodeBranch } from "react-icons/fa";


export default function UnReferenteDiseño() {
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
            <h4 style={{ color: 'white' }}>EVALUACIÓN REFERENTES</h4>
            <br></br>
            <Table style={{ width: '70%', margin: 'auto' }}>

                <tr >
                <td>
                        <CircularProgressbarWithChildren
                            background
                            value={100}
                            text={`${satGeneral}%`}
                            strokeWidth={10}
                            styles={buildStyles({
                                strokeLinecap: "butt"
                            })}
                        >
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
                            color
                            background
                            value={50}
                            text={`${refEval}`}
                            strokeWidth={10}
                            styles={buildStyles({
                                strokeLinecap: "butt",  color:'red',
                            })}
                        >
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
                            background
                            value={100}
                            text={`${80}%`}
                            strokeWidth={10}
                            styles={buildStyles({
                                strokeLinecap: "butt"
                            })}
                        >
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
                            background
                            value={100}
                            text={`${compEval}`}
                            strokeWidth={10}
                            styles={buildStyles({
                                strokeLinecap: "butt"
                            })}
                        >
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
                            background
                            value={100}
                            text={`${tiempProm}`}
                            strokeWidth={10}
                            styles={buildStyles({
                                strokeLinecap: "butt"
                            })}
                        >
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
            <br></br>
            <table style={{ backgroundColor: 'white', width: '50%', borderRadius: '20px', margin: 'auto' }}>

                <td  id="infoLinePorcLeyendasREFERENTE">
                    <b>EXCELENTE</b>
                </td>
                
                <td className="linea">
                    <img id="sizeCaritasReferentes" src={faceVerde1}></img>
                </td>

                <td  id="infoLinePorcLeyendasREFERENTE">
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
            
            <table id="table" responsive>
                <tr>
                    <td >
                        <table style={{ backgroundColor: 'white', width: '26em',height:'26em', borderRadius: '10px' }}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} ></th>


                                </tr>
                            </thead>
                            <tbody >
                                <tr >
                                    <th style={{ height:'3.5em', paddingLeft: '1em' }}>MARCELO CORTES</th>
                                    <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={71} label={`${71}%`} /></td>
                                    <td ><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img></td>
                                       

                                </tr>
                                <hr></hr>
                                <tr >
                                    <td style={{  paddingLeft: '1em' }}>AUTONOMIA </td>
                                    <td> <ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={88} label={`${88}%`} /></td>
                                    <td ><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
                                       </td>
                                </tr>
                                <tr >
                                    <td style={{  paddingLeft: '1em'  }}>CAPACIDAD ANALITICA </td>
                                    <td> <ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={31} label={`${31}%`} /></td>
                                    <td ><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
                                       </td>
                                </tr>
                                <tr >
                                    <td style={{  paddingLeft: '1em'  }}>CAPACIDAD DE APRENDIZAJE</td>
                                    <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={51} label={`${51}%`} /></td>
                                    <td ><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
                                        </td>
                                </tr>
                                <tr >
                                    <td style={{  paddingLeft: '1em'  }}>COMUNICACION </td>
                                    <td> <ProgressBar id="infoLinePorcREFERENTE" className='green-progress-bar' now={95} label={`${95}%`} /></td>
                                    <td ><img id="faceStyleReferenteTodas" src={faceVerde1}></img>
                                       </td>
                                </tr>
                                <tr >
                                    <td style={{  paddingLeft: '1em'  }}>CONFIANZA</td>
                                    <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
                                    <td><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
                                        </td>
                                </tr>
                                <tr >
                                    <td style={{  paddingLeft: '1em'  }}>DESEMPEÑO</td>
                                    <td><ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={51} label={`${51}%`} /></td>
                                    <td ><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
                                        </td>
                                </tr>
                                <tr >
                                    <td style={{ paddingLeft: '1em'  }}>DISPOSICION/ACTITUD </td>
                                    <td><ProgressBar id="infoLinePorcREFERENTE" className='green-progress-bar' now={95} label={`${95}%`} /></td>
                                    <td ><img id="faceStyleReferenteTodas" src={faceVerde1}></img>
                                        </td>
                                </tr>
                                <tr >
                                    <td style={{  paddingLeft: '1em'  }}>EMPODERAMIENTO</td>
                                    <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
                                    <td ><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
                                        </td>
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
