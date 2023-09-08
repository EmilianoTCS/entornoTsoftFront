import React, { useState, useEffect } from "react";
import Header from "../../../templates/Header/Header";
import "../Listados/BtnInsertar.css";
import GrafDonutChart from "./GrafDonutChart";

export default function DiseñoDashboardTablaConLineasPorc() {
    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

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
            <div class="bg-light mx-auto px-2 border border-2 border-secondary"
                style={{ width: "670px", height: "350px" }}>
                <GrafDonutChart></GrafDonutChart>                        
            </div>

        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );
}
