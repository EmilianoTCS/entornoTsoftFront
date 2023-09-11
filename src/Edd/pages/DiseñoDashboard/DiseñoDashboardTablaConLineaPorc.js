import React, { useState, useEffect } from "react";
import { Table,Container,Row,Col } from "react-bootstrap";
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



            <div>
      <Row>
      <Col> 
        <table id="table" responsive>
                <thead>
                    <tr>

                        <th style={{ padding: '1em' }} id="borderTdTh">REFERENTE</th>
                        <th style={{ padding: '1em' }} id="borderTdTh">COLABORADOR</th>

                    </tr>
                </thead>
                <tbody>
                    <tr id="borderTdTh">
                        <th rowspan="5" id="borderTdTh" style={{width:'35%'}}>Romina Alvarez</th>
                        <td>Florencia 90%&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>

                    </tr>
                    <tr id="borderTdTh">
                        <td>Emiliano 88%&nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Daniela 72%&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Juan 47%&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Esteban 22%&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>
                    </tr>

                </tbody>
            </table></Col>
        <Col> 
        <table id="table" responsive>
                <thead>
                    <tr>

                        <th style={{ padding: '1em' }} id="borderTdTh">REFERENTE</th>
                        <th style={{ padding: '1em' }} id="borderTdTh">COLABORADOR</th>

                    </tr>
                </thead>
                <tbody>
                    <tr id="borderTdTh">
                        <th rowspan="5" id="borderTdTh" style={{width:'35%'}}>Josefina Perez</th>
                        <td>Florencia 90%&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>

                    </tr>
                    <tr id="borderTdTh">
                        <td>Emiliano 88%&nbsp;<img id="faceStyle" src={faceVerdeLima2}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Daniela 62%&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Juan 47%&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Esteban 22%&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>
                    </tr>

                </tbody>
            </table></Col>
      </Row>
      <br></br>
      <Row>
      <Col> 
        <table id="table" responsive>

                
        <tbody>
                    <tr id="borderTdTh">
                        <th rowspan="5" id="borderTdTh" style={{width:'35%'}}>Marcelo Cortes Ortega</th>
                        <td>Florencia 40%&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>

                    </tr>
                    <tr id="borderTdTh">
                        <td>Emiliano 28%&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Daniela 48%&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Juan 97%&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Esteban 62%&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                    </tr>

                </tbody>
            </table></Col>
        <Col> 
        <table id="table" responsive>

                <tbody>
                    <tr id="borderTdTh">
                        <th rowspan="5" id="borderTdTh" style={{width:'35%'}} >Ramiro Gomez</th>
                        <td>Florencia 40%&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>

                    </tr>
                    <tr id="borderTdTh">
                        <td>Emiliano 28%&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Daniela 72%&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Juan 97%&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Esteban 62%&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                    </tr>

                </tbody>
            </table></Col>
      </Row>
      <br></br>
      <Row>
      <Col> 
        <table id="table" responsive>

                
        <tbody>
                    <tr id="borderTdTh">
                        <th rowspan="5" id="borderTdTh" style={{width:'35%'}}>Fatima Gonzales</th>
                        <td>Florencia 60%&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>

                    </tr>
                    <tr id="borderTdTh">
                        <td>Emiliano 28%&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Daniela 72%&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Juan 97%&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Esteban 100%&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>
                    </tr>

                </tbody>
            </table></Col>
        <Col> 
        <table id="table" responsive>

                <tbody>
                    <tr id="borderTdTh">
                        <th rowspan="5" id="borderTdTh" style={{width:'35%'}} >Esteban Ramirez</th>
                        <td>Florencia 40%&nbsp;<img id="faceStyle" src={faceNaranja4}></img> </td>

                    </tr>
                    <tr id="borderTdTh">
                        <td>Emiliano 28%&nbsp;<img id="faceStyle" src={faceRojo5}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Daniela 72%&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Juan 97%&nbsp;<img id="faceStyle" src={faceVerde1}></img> </td>
                    </tr>
                    <tr id="borderTdTh">
                        <td>Esteban 62%&nbsp;<img id="faceStyle" src={faceAmarillo3}></img> </td>
                    </tr>

                </tbody>
            </table></Col>
      </Row>
    </div>




           




        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );
}
