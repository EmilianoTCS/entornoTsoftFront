import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import Header from "../../../templates/Header/Header";
import "../Listados/BtnInsertar.css";
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
            <br></br>
            <br></br>
            <a

                type="submit"
                id="btnAtras"
                value="Registrar"
                href="/home">Volver
            </a>

            <Table style={{width:'50%',margin:'auto'}}>
                <tr >
                    <td style={{ width: 100}}> 
                        <CircularProgressbar  value={66} text={`${satGeneral}%`}
                        // styles={buildStyles({
                        //     rotation: 0.25,
                        //     strokeLinecap: 'butt',
                        //     textSize: '16px',
                        //     pathTransitionDuration: 0.5,
                        //     // Colors
                        //     pathColor: `#f88`,
                        //     textColor: '#f88',
                        //     trailColor: '#fff',
                        //     backgroundColor: '#3e98c7',
                        // })} 
                        />
                    </td>
                    <td style={{ width: 100}}> 
                            
                        <CircularProgressbar  maxValue={4} value={2} text={`${refEval}`} />
                    </td>
                    <td style={{ width: 100}}> 
                        <CircularProgressbar value={100} text={`${compEval}`} />
                    </td>
                    <td style={{ width: 100}}> 
                        <CircularProgressbar value={100} text={`${tiempProm}`} />
                    </td>
                </tr>
            </Table>






        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );
}
