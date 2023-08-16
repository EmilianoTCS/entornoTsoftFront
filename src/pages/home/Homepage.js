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
      <div>
        <h4 style={{color:'white'}}>Home</h4>
        {/* <div id="container_cards">
          {cards.map((singleCard) => (
            <>
              <Card id="coe_carta">
                <Card.Body>
                  <Card.Text>Cursos</Card.Text>
                  <Card.Title style={{ fontSize: "50pt" }}>
                    38
                    {singleCard.totalCursos}
                  </Card.Title>
                  <Card.Text>Total</Card.Text>
                </Card.Body>
              </Card>
              <Card id="coe_carta">
                <Card.Body>
                  <Card.Text style={{ fontSize: "14pt" }}>
                    Colaboradores
                  </Card.Text>
                  <Card.Title style={{ fontSize: "50pt" }}>
                    55
                    {singleCard.totalColaboradores}
                  </Card.Title>
                  <Card.Text>Total</Card.Text>
                </Card.Body>
              </Card>
              <Card id="coe_carta">
                <Card.Body>
                  <Card.Text>Cursos</Card.Text>
                  <Card.Title style={{ fontSize: "50pt" }}>
                    23
                    {singleCard.totalFinalizados}
                  </Card.Title>
                  <Card.Text>Finalizados</Card.Text>
                </Card.Body>
              </Card>
              <Card id="coe_carta">
                <Card.Body>
                  <Card.Text>Porcentaje</Card.Text>
                  <Card.Title style={{ fontSize: "50pt" }}>
                    73
                    {singleCard.porcentajeFinalizados}
                  </Card.Title>
                  <Card.Text>Finalizados</Card.Text>
                </Card.Body>
              </Card>
              <Card id="coe_carta">
                <Card.Body>
                  <Card.Text>Cursos</Card.Text>
                  <Card.Title style={{ fontSize: "50pt" }}>
                    18
                    {singleCard.totalActivos}
                  </Card.Title>
                  <Card.Text>Activos</Card.Text>
                </Card.Body>
              </Card>
              <Card id="coe_carta">
                <Card.Body>
                  <Card.Text>Cursos</Card.Text>
                  <Card.Title style={{ fontSize: "50pt" }}>
                    {singleCard.totalPendientes}14
                  </Card.Title>
                  <Card.Text>Pendientes</Card.Text>
                </Card.Body>
              </Card>
            </>
          ))}
        </div>
      </div>
      
      <div>
        <h3>COMPETENCIAS EVALUADAS</h3>
        <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>COMUNICACIÓN</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>
            <div class="flechaAbajo1"></div>
              {/* {singleCard.totalPendientes}37
            </Card.Title>
          </div>
        </div>*/}

        {/* <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>INTELIGENCIA EMOCIONAL</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>
            <div class="flechaAbajo2"></div>
              {singleCard.totalPendientes}71
            </Card.Title>
          </div>
        </div> */}

        {/* <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>GESTION</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>
            <div class="flechaAbajo3"></div>
              {singleCard.totalPendientes}14
            </Card.Title>
          </div>
        </div> */}
        {/* <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>LIDERAZGO CUALITATIVO</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>
              {singleCard.totalPendientes}55
            </Card.Title>
          </div>
        </div> */}
      </div> 

{/* ----------------------------------------------------------------------------------------------- */}
{/* <div id="barraDerecha">
        <h3>COMPETENCIAS EVALUADAS</h3>
        <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>COMUNICACIÓN</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>
            <div class="flechaArriba1"></div>
              {singleCard.totalPendientes}37
            </Card.Title>
          </div>
        </div>

        <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>INTELIGENCIA EMOCIONAL</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>
              {singleCard.totalPendientes}71
            </Card.Title>
          </div>
        </div>

        <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>GESTION</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>
              {singleCard.totalPendientes}14
            </Card.Title>
          </div>
        </div>
        <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>LIDERAZGO CUALITATIVO</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>
              {singleCard.totalPendientes}55
            </Card.Title>
          </div>
        </div>
      </div> */}
      {/* ----------------------------------------------------------------------------------------------- */}
  {/* <div id="barraMedio2">
        <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>COMUNICACIÓN</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>
              37
            </Card.Title>
          </div>
        </div>

        <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>INTELIGENCIA EMOCIONAL</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>
71
            </Card.Title>
          </div>
        </div>

        <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>GESTION</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>14
            </Card.Title>
          </div>
        </div>
        <div
          class="card text-center"
          style={{
            width: "18rem",
            backgroundColor: "#EEEDE7",
            margin: "2rem",
          }}
        >
          <div class="card-body">
            <Card.Text>LIDERAZGO CUALITATIVO</Card.Text>
            <Card.Title style={{ fontSize: "30pt" }}>55
            </Card.Title>
          </div>
        </div>
      </div> */}


    </div>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
