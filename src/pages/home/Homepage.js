import React, { useState, useEffect } from "react";
import getDataService from "../../services/GetDataService";
import "../home/home.css";
import { Navigate } from "react-router-dom";
import Header from "../../templates/Header/Header.js";
// import PieChart from "../templates/Pie";
// import BarChart from "../templates/Bar";
import Card from "react-bootstrap/Card";

export default function HomePage() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cards, setCards] = useState([""]);
  // const url = "TASKS/Cards-General.php";
  // function obtenerDatos() {
  //   getDataService(url).then((cards) => setCards(cards));
  // }
  // useEffect(function () {
  //   obtenerDatos();
  // }, []);
  return userData.statusConected || userData !== null ? (
    <div>
      <Header></Header>
      <div style={{paddingLeft:'10em'}}>
      <br></br>
      <a
        
        type="submit"
        id="btnAtras"
        
        href="/DiseñoDashboardTablaConLineasPorc">DiseñoTbLineasPorc
      </a>
      
      <br></br>
      <br></br>
      
      <a
        
        type="submit"
        id="btnAtras"
       
        href="/DiseñoDashboardGrafico">DiseñoGrafico
      </a>
      
      <br></br>
      <br></br>
     
      <a
        
        type="submit"
        id="btnAtras"
        href="/DiseñoDashboardTabla">DiseñoTabla
      </a>
      </div>
      <div class="column-container">
    
        <h4 class="column left-column">EVALUACIONES<br></br> DE<br></br> DESEMPEÑO</h4>
        
        
     


        <div >
          <h4 class="column right-column">ACADEMIA <br></br>DE<br></br> FORMACIÓN</h4>
        </div>
      </div>
      


    </div>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
