import React, { useState, useEffect } from "react";
import Header from "../../../templates/Header/Header";
import "../Listados/BtnInsertar.css";

export default function DiseñoDashboardTabla() {
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
  
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
