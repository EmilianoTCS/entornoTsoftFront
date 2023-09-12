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
                <td >
                    <table style={{backgroundColor:'white',width:'30em',borderRadius:'10px'}}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody >
     
                                <tr >
                                    <th rowspan="5"  style={{width:'10em' ,paddingLeft:'1em'}}>Romina Alvarez </th>
                                    <td id="infoLinePorc">Florencia Lorenzati &nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> 
                                    <ProgressBar  className='lightGreen-progress-bar' now={81} label={`${81}%`} /></td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Emiliano &nbsp;<img id="faceStyle" src={faceRojo5}></img> 
                                    <ProgressBar  className='red-progress-bar' now={33} label={`${33}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Daniela &nbsp;<img id="faceStyle" src={faceNaranja4}></img> 
                                    <ProgressBar  className='yellow-progress-bar' now={51} label={`${51}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan &nbsp;<img id="faceStyle" src={faceVerde1}></img> 
                                    <ProgressBar  className='green-progress-bar' now={95} label={`${95}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban &nbsp;<img id="faceStyle" src={faceAmarillo3}></img> 
                                    <ProgressBar  className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
                                </tr>

                            </tbody>
                        </table>
                    </td>

                    <td >
                    <table style={{backgroundColor:'white',width:'30em',borderRadius:'10px'}}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{width:'10em' ,paddingLeft:'1em'}}>Juana Lopez </th>
                                    <td id="infoLinePorc">Florencia Lorenzati &nbsp;<img id="faceStyle" src={faceRojo5}></img> 
                                    <ProgressBar  className='red-progress-bar' now={35} label={`${35}%`} /></td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Emiliano &nbsp;<img id="faceStyle" src={faceVerde1}></img> 
                                    <ProgressBar  className='green-progress-bar' now={97} label={`${97}%`} /></td>
                                </tr>
                                <tr>
                                    <td id="infoLinePorc">Daniela &nbsp;<img id="faceStyle" src={faceNaranja4}></img> 
                                    <ProgressBar  className='orange-progress-bar' now={52} label={`${52}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan &nbsp;<img id="faceStyle" src={faceAmarillo3}></img> 
                                    <ProgressBar  className='yellow-progress-bar' now={64} label={`${64}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban &nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> 
                                    <ProgressBar  className='lightGreen-progress-bar' now={84} label={`${84}%`} /></td>
                                </tr>

                            </tbody>
                        </table>
                    </td>


                    <td >
                    <table style={{backgroundColor:'white',width:'30em',borderRadius:'10px'}}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody >
                                <tr >
                                    <th rowspan="5" style={{width:'10em' ,paddingLeft:'1em'}} >Marcelo Cortes Ortega</th>
                                    <td id="infoLinePorc">Florencia Lorenzati &nbsp;<img id="faceStyle" src={faceVerde1}></img> 
                                    <ProgressBar  className='green-progress-bar' now={91} label={`${91}%`} /></td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Emiliano &nbsp;<img id="faceStyle" src={faceAmarillo3}></img> 
                                    <ProgressBar  className='yellow-progress-bar' now={63} label={`${63}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Daniela &nbsp;<img id="faceStyle" src={faceRojo5}></img> 
                                    <ProgressBar  className='red-progress-bar' now={22} label={`${22}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan &nbsp;<img id="faceStyle" src={faceVerde1}></img> 
                                    <ProgressBar  className='green-progress-bar' now={98} label={`${98}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban &nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> 
                                    <ProgressBar  className='lightGreen-progress-bar' now={80} label={`${80}%`} /></td>
                                </tr>

                            </tbody>
                        </table>
                    </td>
                </tr>
                <br></br>
                <tr>
                <td >
                    <table style={{backgroundColor:'white',width:'30em',borderRadius:'10px'}}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{width:'10em' ,paddingLeft:'1em'}} >Guillermina Gomez</th>
                                    <td>Florencia Lorenzati &nbsp;<img id="faceStyle" src={faceNaranja4}></img> 
                                    <ProgressBar  className='orange-progress-bar' now={51} label={`${51}%`} /></td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Emiliano &nbsp;<img id="faceStyle" src={faceAmarillo3}></img> 
                                    <ProgressBar  className='yellow-progress-bar' now={67} label={`${67}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Daniela &nbsp;<img id="faceStyle" src={faceRojo5}></img> 
                                    <ProgressBar  className='red-progress-bar' now={25} label={`${25}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan &nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> 
                                    <ProgressBar  className='lightGreen-progress-bar' now={78} label={`${78}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban &nbsp;<img id="faceStyle" src={faceAmarillo3}></img> 
                                    <ProgressBar  className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
                                </tr>

                            </tbody>
                        </table>
                    </td>

                    <td >
                    <table style={{backgroundColor:'white',width:'30em',borderRadius:'10px'}}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{width:'10em' ,paddingLeft:'1em'}} >Mauricio Perez</th>
                                    <td id="infoLinePorc">Florencia Lorenzati &nbsp;<img id="faceStyle" src={faceRojo5}></img> 
                                    <ProgressBar  className='red-progress-bar' now={29} label={`${29}%`} /></td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Emiliano &nbsp;<img id="faceStyle" src={faceAmarillo3}></img> 
                                    <ProgressBar  className='yellow-progress-bar' now={56} label={`${56}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Daniela &nbsp;<img id="faceStyle" src={faceVerde1}></img> 
                                    <ProgressBar  className='green-progress-bar' now={92} label={`${92}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan &nbsp;<img id="faceStyle" src={faceNaranja4}></img> 
                                    <ProgressBar  className='orange-progress-bar' now={50} label={`${50}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban &nbsp;<img id="faceStyle" src={faceRojo5}></img> 
                                    <ProgressBar  className='red-progress-bar' now={21} label={`${21}%`} /></td>
                                </tr>

                            </tbody>
                        </table>
                    </td>


                    <td >
                    <table style={{backgroundColor:'white',width:'30em',borderRadius:'10px'}}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <th rowspan="5" style={{width:'10em' ,paddingLeft:'1em'}} >Estefania Gonzales</th>
                                    <td id="infoLinePorc">Florencia Lorenzati &nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> 
                                    <ProgressBar  className='lightGreen-progress-bar' now={81} label={`${81}%`} /></td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Emiliano &nbsp;<img id="faceStyle" src={faceNaranja4}></img> 
                                    <ProgressBar  className='orange-progress-bar' now={49} label={`${49}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Daniela &nbsp;<img id="faceStyle" src={faceVerde1}></img> 
                                    <ProgressBar  className='green-progress-bar' now={100} label={`${100}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan &nbsp;<img id="faceStyle" src={faceNaranja4}></img> 
                                    <ProgressBar  className='orange-progress-bar' now={54} label={`${54}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban &nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> 
                                    <ProgressBar  className='lightGreen-progress-bar' now={84} label={`${84}%`} /></td>
                                </tr>

                            </tbody>
                        </table>
                    </td>
                </tr>
                <br></br>
                {/* <tr>
                <td >
                    <table style={{backgroundColor:'white',width:'30em',borderRadius:'10px'}}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <th rowspan="5"  style={{width:'10em' ,paddingLeft:'1em'}}>Jorge Martinez</th>
                                    <td id="infoLinePorc">Florencia Lorenzati &nbsp;<img id="faceStyle" src={faceVerde1}></img> 
                                    <ProgressBar  className='green-progress-bar' now={95} label={`${95}%`} /></td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Emiliano &nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> 
                                    <ProgressBar  className='lightGreen-progress-bar' now={87} label={`${87}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Daniela &nbsp;<img id="faceStyle" src={faceAmarillo3}></img> 
                                    <ProgressBar  className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan &nbsp;<img id="faceStyle" src={faceNaranja4}></img> 
                                    <ProgressBar  className='orange-progress-bar' now={54} label={`${54}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban &nbsp;<img id="faceStyle" src={faceRojo5}></img> 
                                    <ProgressBar  className='red-progress-bar' now={39} label={`${39}%`} /></td>
                                </tr>

                            </tbody>
                        </table>
                    </td>

                    <td >
                    <table style={{backgroundColor:'white',width:'30em',borderRadius:'10px'}}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <th rowspan="5"  style={{width:'10em' ,paddingLeft:'1em'}}>Fausto Dominguez</th>
                                    <td id="infoLinePorc">Florencia Lorenzati &nbsp;<img id="faceStyle" src={faceVerde1}></img> 
                                    <ProgressBar  className='green-progress-bar' now={94} label={`${94}%`} /></td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Emiliano &nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> 
                                    <ProgressBar  className='lightGreen-progress-bar' now={86} label={`${86}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Daniela &nbsp;<img id="faceStyle" src={faceAmarillo3}></img> 
                                    <ProgressBar  className='yellow-progress-bar' now={61} label={`${61}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan &nbsp;<img id="faceStyle" src={faceNaranja4}></img> 
                                    <ProgressBar  className='orange-progress-bar' now={52} label={`${52}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban &nbsp;<img id="faceStyle" src={faceRojo5}></img> 
                                    <ProgressBar  className='red-progress-bar' now={31} label={`${31}%`} /></td>
                                </tr>

                            </tbody>
                        </table>
                    </td>


                    <td >
                    <table style={{backgroundColor:'white',width:'30em',borderRadius:'10px'}}>
                            <thead>
                                <tr>

                                    <th style={{ padding: '1em' }} >REFERENTE</th>
                                    <th style={{ padding: '1em' }} >COLABORADOR</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <th rowspan="5"  style={{width:'10em' ,paddingLeft:'1em'}}>Marcelo cortes ortega</th>
                                   <td id="infoLinePorc">Florencia Lorenzati &nbsp;<img id="faceStyle" src={faceVerde1}></img> 
                                   <ProgressBar  className='green-progress-bar' now={95} label={`${95}%`} /></td>

                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Emiliano &nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> 
                                    <ProgressBar  className='lightGreen-progress-bar' now={88} label={`${88}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Daniela &nbsp;<img id="faceStyle" src={faceAmarillo3}></img> 
                                    <ProgressBar  className='yellow-progress-bar' now={66} label={`${66}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Juan &nbsp;<img id="faceStyle" src={faceNaranja4}></img> 
                                    <ProgressBar  className='orange-progress-bar' now={53} label={`${53}%`} /></td>
                                </tr>
                                <tr >
                                    <td id="infoLinePorc">Esteban &nbsp;<img id="faceStyle" src={faceRojo5}></img> 
                                    <ProgressBar  className='red-progress-bar' now={35} label={`${35}%`} /></td>
                                </tr>

                            </tbody>
                        </table>
                    </td>
                </tr> */}
            </table>
        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );
}
