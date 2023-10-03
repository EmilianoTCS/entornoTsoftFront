// import React, { useState, useEffect } from "react";
// import { Table, Container, Row, Col } from "react-bootstrap";
// import Header from "../../../templates/Header/Header";
// import "../Listados/BtnInsertar.css";
// import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import RadialSeparators from "./RadialSeparators";
// import "../home/homeEDD.css"
// import "../DiseñoDashboard/DiseñoDash.css";
// import faceVerde1 from "../Smileys/faceVerde1.png"
// import faceVerdeLima2 from "../Smileys/faceVerdeLima2.png"
// import faceAmarillo3 from "../Smileys/faceAmarillo3.png"
// import faceNaranja4 from "../Smileys/faceNaranja4.png"
// import faceRojo5 from "../Smileys/faceRojo5.png"
// import ProgressBar from 'react-bootstrap/ProgressBar';
// import { FaCodeBranch } from "react-icons/fa";


// export default function DiseñoTablaLineaReferente() {
//     const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
//     const satGeneral = 66;
//     const refEval = '2/4';
//     const compEval = 13;
//     const tiempProm = 4.83;
//     //PAGINADOR ---------------------

//     return userData.statusConected || userData !== null ? (
//         <>

//             <Header></Header>
//             <a

//                 type="submit"
//                 id="btnAtrasPRUEBASDash"
//                 value="Registrar"
//                 href="/home">Volver
//             </a>
//             <h4 style={{ color: 'black' }}>EVALUACIÓN REFERENTES</h4>
//             <br></br>
//             <div id="tableResumen">
//             <Table>

//                 <tr >
//                     <td >
//                         <CircularProgressbarWithChildren
//                             value={satGeneral}
//                             background
                          
                            
//                             // text={`${80}%`}
//                             strokeWidth={10}
//                             styles={buildStyles({
//                                 strokeLinecap: 'butt',
//                                 pathColor: "#94FF01",
//                                 trailColor: "#E5E7E9",
//                                 backgroundColor:'white',
                                
                                
//                             })}
//                         >

//                             <div style={{ fontSize: 20, textAlign: 'center' }}>
//                                 <strong>Satisfacción</strong>
//                                 <br></br>
//                                 <strong>{satGeneral}%</strong>
//                                 <br></br>
//                                 <strong>General</strong>
//                             </div>
//                             <RadialSeparators
//                                 count={10}
//                                 style={{

//                                     background: "#fff",
//                                     width: "2px",
//                                     // This needs to be equal to props.strokeWidth
//                                     height: `${10}%`
//                                 }}
//                             />
//                         </CircularProgressbarWithChildren>
//                     </td>
//                     <td>
//                     <CircularProgressbarWithChildren
//                             value={50}
//                             background
//                             // text={`${80}%`}
//                             strokeWidth={10}
//                             styles={buildStyles({
//                                 pathColor: "#FFE700",
//                                 trailColor: "#E5E7E9",
//                                 strokeLinecap: 'butt',
//                                 backgroundColor:'white'
//                             })}
//                         >
//                             <div style={{ fontSize: 20, textAlign: 'center' }}>
//                                 <strong>Referentes</strong>
//                                 <br></br>
//                                 <strong>{refEval}</strong>
//                                 <br></br>
//                                 <strong>Evaluadores</strong>
//                             </div>
//                             <RadialSeparators
//                                 count={10}
//                                 style={{
//                                     background: "#fff",
//                                     width: "2px",
//                                     // This needs to be equal to props.strokeWidth
//                                     height: `${10}%`
//                                 }}
//                             />
//                         </CircularProgressbarWithChildren>
//                     </td>
//                     <td>
//                     <CircularProgressbarWithChildren
//                             value={100}
//                             background
//                             // text={`${80}%`}
//                             strokeWidth={10}
//                             styles={buildStyles({
//                                 strokeLinecap: 'butt',
//                                 pathColor: "#02C101",
//                                 trailColor: "grey",
//                                 backgroundColor:'white'
//                             })}
//                         >
//                             <div style={{ fontSize: 20, textAlign: 'center' }}>
//                                 <strong>Competencias</strong>
//                                 <br></br>
//                                 <strong>{compEval}</strong>
//                                 <br></br>
//                                 <strong>Evaluadas</strong>
//                             </div>
//                             <RadialSeparators
//                                 count={10}
//                                 style={{
//                                     background: "#fff",
//                                     width: "2px",
//                                     // This needs to be equal to props.strokeWidth
//                                     height: `${10}%`
//                                 }}
//                             />
//                         </CircularProgressbarWithChildren>
//                     </td>

//                     <td>
//                     <CircularProgressbarWithChildren
//                             maxValue={10}
//                             value={tiempProm}
//                             background
//                             // text={`${80}%`}
//                             strokeWidth={10}
//                             styles={buildStyles({
//                                 strokeLinecap: 'butt',
//                                 pathColor: "#FF7300",
//                                 trailColor: "#E5E7E9",
//                                 backgroundColor:'white'
//                             })}
//                         >
//                             <div style={{ fontSize: 20, textAlign: 'center' }}>
//                                 <strong>Tiempo</strong>
//                                 <br></br>
//                                 <strong>{tiempProm}min</strong>
//                                 <br></br>
//                                 <strong>Promedio</strong>
//                             </div>
//                             <RadialSeparators
//                                 count={10}
//                                 style={{
//                                     background: "#fff",
//                                     width: "2px",
//                                     // This needs to be equal to props.strokeWidth
//                                     height: `${10}%`
//                                 }}
//                             />
//                         </CircularProgressbarWithChildren>
//                     </td>
//                 </tr>

//             </Table>
//             </div>
//             <br></br>

//             <table style={{ backgroundColor: 'white', width: '50%', borderRadius: '20px', margin: 'auto' }}>

//                 <td id="infoLinePorcLeyendasREFERENTE">
//                     <b>EXCELENTE</b>
//                 </td>

//                 <td className="linea">
//                     <img id="sizeCaritasReferentes" src={faceVerde1}></img>
//                 </td>

//                 <td id="infoLinePorcLeyendasREFERENTE">
//                     <b>OPORTUNIDAD DE MEJORA</b>
//                 </td>
//                 <td className="linea">
//                     <img id="sizeCaritasReferentes" src={faceVerdeLima2}></img>
//                 </td>

//                 <td id="infoLinePorcLeyendasREFERENTE">
//                     <b>REQUIERE ATENCIÓN
//                     </b>
//                 </td>
//                 <td className="linea">
//                     <img id="sizeCaritasReferentes" src={faceAmarillo3}></img>
//                 </td>

//                 <td id="infoLinePorcLeyendasREFERENTE">
//                     <b>REVISAR SITUACIÓN</b>


//                 </td>
//                 <td className="linea">
//                     <img id="sizeCaritasReferentes" src={faceNaranja4}></img>
//                 </td>

//                 <td id="infoLinePorcLeyendasREFERENTE">
//                     <b>ALERTA</b>
//                 </td>
//                 <td >
//                     <img id="sizeCaritasReferentes" src={faceRojo5}></img>
//                 </td>

//             </table>
//             <br></br>



//             <table id="table" responsive>
//                 <tr>
//                     <td >
//                         <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
//                             <thead>
//                                 <tr>

//                                     <th style={{ paddingLeft: '0.8em',fontSize:'15pt' }} >REFERENTE</th>



//                                 </tr>
//                             </thead>
//                             <tbody >
//                                 <tr style={{ borderBottom: '2px #808080 solid' }}>
//                                     <th style={{ height: '50px', paddingLeft: '1em' }}>MARCELO CORTES ORTEGA </th>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={71} label={`${71}%`} /></td>
//                                     <td ><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img></td>


//                                 </tr>

//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>AUTONOMIA </td>
//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={88} label={`${88}%`} /></td>
//                                     <td ><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD ANALITICA </td>
//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={31} label={`${31}%`} /></td>
//                                     <td ><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD DE APRENDIZAJE</td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={51} label={`${51}%`} /></td>
//                                     <td ><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>COMUNICACION </td>
//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='green-progress-bar' now={95} label={`${95}%`} /></td>
//                                     <td ><img id="faceStyleReferenteTodas" src={faceVerde1}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CONFIANZA</td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={62} label={`${62}%`} /></td>
//                                     <td><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>DESEMPEÑO</td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={51} label={`${51}%`} /></td>
//                                     <td ><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>DISPOSICION/ACTITUD </td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='green-progress-bar' now={95} label={`${95}%`} /></td>
//                                     <td ><img id="faceStyleReferenteTodas" src={faceVerde1}></img>
//                                     </td>
//                                 </tr>
//                                 <tr >
//                                     <td style={{ paddingLeft: '1em' }}>EMPODERAMIENTO</td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={62} label={`${62}%`} /></td>
//                                     <td ><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </td>
//                     <td>
//                         &nbsp;
//                     </td>
//                     <td >
//                         <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
//                             <thead>
//                                 <tr>

//                                 <th style={{ paddingLeft: '0.8em',fontSize:'15pt' }} >REFERENTE</th>



//                                 </tr>
//                             </thead>
//                             <tbody >
//                                 <tr style={{ borderBottom: '2px #808080 solid' }}>
//                                     <th style={{ height: '50px', paddingLeft: '1em' }}>ROMAN PEREZ </th>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={81} label={`${81}%`} /></td>
//                                     <td><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
//                                     </td>

//                                 </tr>

//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>AUTONOMIA </td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={61} label={`${61}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>

//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD ANALITICA </td>
//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={63} label={`${63}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD DE APRENDIZAJE</td>
//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={31} label={`${31}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>COMUNICACION </td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='green-progress-bar' now={91} label={`${91}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceVerde1}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CONFIANZA</td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={85} label={`${85}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>DESEMPEÑO</td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={81} label={`${81}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>DISPOSICION/ACTITUD </td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={15} label={`${15}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>
//                                 <tr >
//                                     <td style={{ paddingLeft: '1em' }}>EMPODERAMIENTO</td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={42} label={`${42}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </td>
//                     <td>
//                         &nbsp;
//                     </td>
//                     <td >
//                         <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
//                             <thead>
//                                 <tr>

//                                 <th style={{ paddingLeft: '0.8em',fontSize:'15pt' }} >REFERENTE</th>

//                                 </tr>
//                             </thead>
//                             <tbody >
//                                 <tr style={{ borderBottom: '2px #808080 solid' }}>
//                                     <th style={{ height: '50px', paddingLeft: '1em' }}>DARIO GOMEZ </th>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={31} label={`${31}%`} /></td>
//                                     <td><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>

//                                 </tr>

//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>AUTONOMIA </td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={24} label={`${24}%`} /></td>
//                                     <td><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>

//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD ANALITICA </td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={17} label={`${17}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD DE APRENDIZAJE</td>
//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={41} label={`${41}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>COMUNICACION </td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={75} label={`${75}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CONFIANZA</td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={62} label={`${62}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>DESEMPEÑO</td>
//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={51} label={`${51}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ width: '12em', paddingLeft: '1em' }}>DISPOSICION/ACTITUD </td>
//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={65} label={`${65}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>
//                                 </tr>
//                                 <tr >
//                                     <td style={{ paddingLeft: '1em' }}>EMPODERAMIENTO</td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={20} label={`${20}%`} /></td>

//                                     <td><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </td>
//                 </tr>
//                 <br></br>
//                 <tr>
//                     <td >
//                         <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
//                             {/* <thead>
//                                 <tr>

//                                     <th colSpan='2' style={{ paddingLeft: '1em' }} >REFERENTE : 	FIDEL SANTIAGO  </th>



//                                 </tr>
//                             </thead>
//                             <tbody >
//                                 <tr style={{ borderBottom: '2px #808080 solid' }}>


//                                     <td align='center' colSpan={3} id="faceStyleReferenteTodasConHR">
//                                         <img id="faceStyleReferenteTitle" src={faceNaranja4}></img>
//                                         <ProgressBar id="infoLinePorcREFPrin" className='orange-progress-bar' now={42} label={`${42}%`} />
//                                     </td> */}
//                             <thead>
//                                 <tr>

//                                 <th style={{ paddingLeft: '0.8em',fontSize:'15pt' }} >REFERENTE</th>

//                                 </tr>
//                             </thead>
//                             <tbody >
//                                 <tr style={{ borderBottom: '2px #808080 solid' }}>
//                                     <th style={{ height: '50px', paddingLeft: '1em' }}>DARIO GOMEZ </th>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={45} label={`${45}%`} /></td>
//                                     <td><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>

//                                 </tr>

//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>AUTONOMIA </td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={24} label={`${24}%`} /></td>
//                                     <td><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>AUTONOMIA </td>

//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={79} label={`${79}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
//                                     </td>

//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD ANALITICA </td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={43} label={`${43}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD DE APRENDIZAJE</td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={41} label={`${41}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>COMUNICACION </td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={25} label={`${25}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CONFIANZA</td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={22} label={`${22}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>DESEMPEÑO</td>

//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={51} label={`${51}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ width: '12em', paddingLeft: '1em' }}>DISPOSICION/ACTITUD </td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='green-progress-bar' now={89} label={`${89}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceVerde1}></img>
//                                     </td>
//                                 </tr>

//                                 <tr >
//                                     <td style={{ paddingLeft: '1em' }}>EMPODERAMIENTO</td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='green-progress-bar' now={99} label={`${99}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceVerde1}></img>
//                                     </td>
//                                 </tr>


//                             </tbody>
//                         </table>
//                     </td>
//                     <td>
//                         &nbsp;
//                     </td>

//                     <td >
//                         <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
//                             <thead>
//                                 <tr>

//                                 <th style={{ paddingLeft: '0.8em',fontSize:'15pt' }} >REFERENTE</th>

//                                 </tr>
//                             </thead>
//                             <tbody >
//                                 <tr style={{ borderBottom: '2px #808080 solid' }}>
//                                     <th style={{ height: '50px', paddingLeft: '1em' }}>RAMIRO  </th>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={61} label={`${61}%`} /></td>
//                                     <td><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>

//                                 </tr>

//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>AUTONOMIA </td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={64} label={`${64}%`} /></td>
//                                     <td><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>

//                                 </tr>

//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>AUTONOMIA </td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={81} label={`${81}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
//                                     </td>

//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD ANALITICA </td>

//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={83} label={`${83}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD DE APRENDIZAJE</td>

//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={51} label={`${51}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>COMUNICACIÓN </td>

//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={55} label={`${55}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CONFIANZA</td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={59} label={`${59}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>DESEMPEÑO</td>

//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='orange-progress-bar' now={35} label={`${35}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ width: '12em', paddingLeft: '1em' }}>DISPOSICION/ACTITUD </td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={19} label={`${19}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>

//                                 <tr >
//                                     <td style={{ paddingLeft: '1em' }}>EMPODERAMIENTO</td>


//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={32} label={`${32}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>


//                             </tbody>
//                         </table>
//                     </td>
//                     <td>
//                         &nbsp;
//                     </td>
//                     <td >
//                         <table style={{ backgroundColor: 'white', width: '26em', borderRadius: '10px' }}>
//                             {/* <thead>
//                                 <tr>

//                                     <th colSpan='2' style={{ paddingLeft: '1em' }} >REFERENTE : DANIELA AGUIRRE  </th>



//                                 </tr>
//                             </thead>
//                             <tbody >
//                                 <tr style={{ borderBottom: '2px #808080 solid' }}>


//                                     <td align='center' colSpan={3} id="faceStyleReferenteTodasConHR">
//                                         <img id="faceStyleReferenteTitle" src={faceVerde1}></img>
//                                         <ProgressBar id="infoLinePorcREFPrin" className='green-progress-bar' now={86} label={`${86}%`} />
//                                     </td> 

//                                 </tr>*/}
//  <thead>
//                                 <tr>

//                                 <th style={{ paddingLeft: '0.8em',fontSize:'15pt' }} >REFERENTE</th>

//                                 </tr>
//                             </thead>
//                             <tbody >
//                                 <tr style={{ borderBottom: '2px #808080 solid' }}>
//                                     <th style={{ height: '50px', paddingLeft: '1em' }}>DARIO GOMEZ </th>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='green-progress-bar' now={95} label={`${95}%`} /></td>
//                                     <td><img id="faceStyleReferenteTodas" src={faceVerde1}></img>
//                                     </td>

//                                 </tr>

//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>AUTONOMIA </td>
//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={83} label={`${83}%`} /></td>
//                                     <td><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>

//                                     <td style={{ paddingLeft: '1em' }}>AUTONOMIA </td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='lightGreen-progress-bar' now={79} label={`${79}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceVerdeLima2}></img>
//                                     </td>

//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD ANALITICA </td>


//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={33} label={`${33}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CAPACIDAD DE APRENDIZAJE</td>

//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={58} label={`${58}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceNaranja4}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>COMUNICACION </td>

//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={25} label={`${25}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>CONFIANZA</td>

//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='red-progress-bar' now={37} label={`${37}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceRojo5}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ paddingLeft: '1em' }}>DESEMPEÑO</td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={58} label={`${58}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>
//                                 </tr>


//                                 <tr style={{ borderBottom: '1px #DCDCDC solid' }}>
//                                     <td style={{ width: '12em', paddingLeft: '1em' }}>DISPOSICION/ACTITUD </td>

//                                     <td> <ProgressBar id="infoLinePorcREFERENTE" className='green-progress-bar' now={93} label={`${93}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceVerde1}></img>
//                                     </td>
//                                 </tr>

//                                 <tr>
//                                     <td style={{ paddingLeft: '1em' }}>EMPODERAMIENTO</td>

//                                     <td><ProgressBar id="infoLinePorcREFERENTE" className='yellow-progress-bar' now={58} label={`${58}%`} /></td>


//                                     <td id="faceStyleReferenteTodasConHR"><img id="faceStyleReferenteTodas" src={faceAmarillo3}></img>
//                                     </td>
//                                 </tr>


//                             </tbody>
//                         </table>
//                     </td>

//                 </tr>

//                 <br></br>

//             </table>
//         </>
//     ) : (
//         <Navigate to="/login"></Navigate>
//     );
// }
