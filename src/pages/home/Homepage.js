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
      {/* <table style={{ width: '50%', margin: 'auto' }}>
        <td>
          <td>
            <h4 class="column left-column">EVALUACIONES<br></br> DE<br></br> DESEMPEÑO</h4>
          </td>
        </td>
        <td>
          <td>
            <h4 class="column right-column">ACADEMIA <br></br>DE<br></br> FORMACIÓN</h4>    </td>
        </td>
      </table> */}



      <table style={{ width: '50%', margin: 'auto' }}>
        <tr>
          <td>
            <h4 class="column left-column">MAQUETAS<br></br> DASHBOARD</h4>
          </td>
        </tr>

<br></br>
        <tr>
          <td>
            <div style={{ width: '50%', margin: 'auto' }}>
              <table style={{ border: 'white 2px solid' }}>
                <td style={{ border: 'white 2px solid', padding: '1em' }} border={2}>
                  <h4 style={{ color: 'white' }}>Colaborador</h4>
                  <br></br>
                  <tr>
                    <a
                      type="submit"
                      id="btnAtras"

                      href="/DiseñoDashboardTablaConLineasPorc">DiseñoTbLineasPorc
                    </a>
                  </tr>
                  <br></br>
                  <tr>
                    <a
                      type="submit"
                      id="btnAtras"

                      href="/DiseñoDashboardGrafico">DiseñoGrafico
                    </a>
                  </tr>
                  <br></br>
                  <tr>
                    <a
                      type="submit"
                      id="btnAtras"
                      href="/DiseñoDashboardTabla">DiseñoTabla
                    </a>
                  </tr>
                </td>

                <td style={{ border: 'black 1px solid', padding: '1em' }}>
                  <tr>
                    <h4 style={{ color: 'white' }}>Referente</h4>

                    <br></br>
                    <a

                      type="submit"
                      id="btnAtras"

                      href="/DiseñoTablaLineaReferente">DiseñoTablaLineaReferente
                    </a>
                  </tr>
                  <br></br>
                  <tr>
                    <a

                      type="submit"
                      id="btnAtras"

                      href="/UnReferenteDiseño">DiseñoUnReferente
                    </a>
                  </tr>
                </td>
              </table>
            </div>
          </td>
        </tr>
      </table>


    </div >


  ) : (
    <Navigate to="/login"></Navigate>
  );
}
