import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import Header from "../../../templates/Header/Header";
import "../Listados/BtnInsertar.css";
import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import RadialSeparators from "./RadialSeparators";
import Bars from "./BarsChart";
import LinesChart from "./LineChart";

export default function DiseñoDashboardGrafico() {
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
            <h4 style={{color:'white'}}>EVALUACIÓN COLABORADOR</h4>
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
            <div className="bg-light mx-auto" style={{width:"55em", height:"70%",padding:'16px'}}>
                    <LinesChart />
                </div>
            <br></br>
            <div className="bg-light mx-auto" style={{width:"55em", height:"70%",padding:'16px'}}>
                    <Bars />
                </div>
                <br></br>
        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );
}
