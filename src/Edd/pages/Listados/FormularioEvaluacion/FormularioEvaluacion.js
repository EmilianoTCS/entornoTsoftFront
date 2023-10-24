import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useRoute } from "wouter";

import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import "../TablasStyles.css";
import "./formStyle.css";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import logo from "./logo/tsoft.png";
import Swal from "sweetalert2";
import ConfirmAlertAll from "../../Alerts/ConfirmAlertAll";
import logoTsoft from "../FormularioEvaluacion/logo/tsoft.png"


export default function FormularioEvaluacion() {
  const [, params] = useRoute("/listadoRespPregEvaluaciones/:idEvaluacion/:idEDDProyEmpEvaluado/:idEDDProyEmpEvaluador/:cicloEvaluacion");

  const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState([""]); //Recibe la respuesta del backend y la almacena en raw, sin procesar
  const [idEDDEvalNomPregunta, setidEDDEvalNomPregunta] = useState(""); //Almacena el listado de preguntas procesado
  const [loadedData, setLoadedData] = useState(false); //Bool que determina el recibimiento correcto de los datos
  var respuestasAEnviar = [];
  const idEDDEvaluacion = params.idEvaluacion;
  const idEDDProyEmpEvaluado = params.idEDDProyEmpEvaluado;
  const idEDDProyEmpEvaluador = params.idEDDProyEmpEvaluador;
  const cicloEvaluacion = params.cicloEvaluacion;
  const [fechaInicioExamen, setfechaInicioExamen] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  function GetData() {
    var url = "pages/listados/listadoRespPregEvaluaciones.php";
    var operationUrl = "listadoRespPregEvaluaciones";
    var data = {
      idEvaluacion: idEDDEvaluacion,
      idEmpleado: idEDDProyEmpEvaluador,
      idEDDProyEmpEvaluado: idEDDProyEmpEvaluado,
      cicloEvaluacion:cicloEvaluacion,
    };
    console.log("getdata",data);
    SendDataService(url, operationUrl, data).then((data) => {
      setidEDDEvalPregunta(data);
      setLoadedData(true); //Cambio el estado del booleano
      ConfirmAlert();
      console.log(data);
    });
  }

  function ConfirmAlert() {
    if (loadedData) {
      Swal.fire({
        title: "IMPORTANTE",
        html: `
        <p>Esta evaluación puede ser resuelta por única vez y los resultados NO podrán ser modificados.</p>
        <p>¿Deseas continuar?</p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        allowOutsideClick : false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          var fechaIni = new Date();
          setfechaInicioExamen(fechaIni);
        }
        else {
          window.history.back()
        }
      });
    }
  }

  function ConfirmAlertEnvio() {
    if (loadedData) {
      Swal.fire({
        html: `
        <p>Gracias por llenar el formulario.</p>
        `,
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Continuar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = "/listadoEDDEvalProyEmp/0"
        }
      });
    }
  }
  function guardaRespEval(idPreg, registro) {
    let itemId = respuestasAEnviar.findIndex((item) => item.id === idPreg);
    if (itemId > -1) {
      respuestasAEnviar.splice(itemId, 1, registro);
    } else {
      respuestasAEnviar.push(registro);
    }
  }
  function SendData(e) {
    e.preventDefault();
    ConfirmAlertAll('¿Confirma el envío de los datos?', 'No podrás cambiar los resultados.', 'warning').then((response) => {

    const url = "pages/insertar/insertarEddEvalProyResp.php";
    const operationUrl = "insertarEddEvalProyResp";
    e.preventDefault();
    let fechaFin = new Date();

    var data = {
      respuestas: respuestasAEnviar,
      datosExtra: {
        fechaInicioExamen: fechaInicioExamen,
        fechaFinExamen: fechaFin,
        idEDDEvaluacion: idEDDEvaluacion,
        usuarioCreacion: userData.usuario,
        cicloEvaluacion:cicloEvaluacion

      },
    }; 
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      console.log("respuestaServer:", response);
      ConfirmAlertEnvio();

    });
  });
  }

  useEffect(
    function () {
      GetData();
    },
    [idEDDEvaluacion, loadedData]
  );

  
  var auxIdPregunta = "0";
  var auxEncabezado = "0";
  var auxDesc = "0";

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <form onSubmit={SendData}>
        <a
                style={{ margin: '10px' ,marginTop:'15px',marginLeft:'60px'}}
                type="submit"
          id="btnAtras"
          value="Registrar"
          href="javascript: history.go(-1)">Volver
        </a>
        <Container id="textStyle">

          <div class="container">

            <div class="row">
              <div class="col" id="title">

                {idEDDEvalPregunta.map((idEDDEvalPregunta) => {

                  if (auxEncabezado !== idEDDEvalPregunta.nomEvaluacion) {
                    return (
                      <>
                        <strong><h2>{auxEncabezado = idEDDEvalPregunta.nomEvaluacion}</h2></strong>
                      </>
                    )
                  }
                })}
              </div>
              <div class="col" id="encabezadoRight">
              <img width="180px" height="100px" src={logoTsoft}></img>

              </div>
              {/* src={idEDDEvalPregunta.logoFormulario} */}
            </div>
          </div>
          {idEDDEvalPregunta.map((idEDDEvalPregunta) => {

            if (auxDesc !== idEDDEvalPregunta.descFormulario) {
              auxDesc= idEDDEvalPregunta.descFormulario
              return (
                <>
                  <p id="encabezadoEnd" style={{ color: 'white' }}>
                    {auxDesc = idEDDEvalPregunta.descFormulario}
                  </p>
                </>

              )
              
            }
          })}


        </Container>
        <Container id="fondoTabla1">

          <br></br>
          <h1>Formulario de evaluación</h1>
          <Table>
            {idEDDEvalPregunta.map((idEDDEvalPregunta) => {
              if (auxIdPregunta !== idEDDEvalPregunta.idEDDEvalPregunta) {
                {
                  auxIdPregunta = idEDDEvalPregunta.idEDDEvalPregunta;
                }
                if (idEDDEvalPregunta.tipoResp === "T") {
                  return (
                    <>
                      <tr>
                        <td>
                          <br></br>
                          {idEDDEvalPregunta.ordenPregunta}. &nbsp;
                          {idEDDEvalPregunta.nomPregunta} &nbsp;
                          {idEDDEvalPregunta.nomCompetencia}
                          {idEDDEvalPregunta.preguntaObligatoria === "1" ? (
                            <a style={{ color: "red" }}>*</a>
                          ) : (
                            <a></a>
                          )}
                        </td>
                      </tr>
                      <br></br>
                      <tr key={idEDDEvalPregunta.idEDDEvalRespPreg}>
                        <td>
                          <table>
                            <tr>
                              <td></td>
                              <td>
                                
                                <textarea
                                  maxLength="500"
                                  type="textarea"
                                  style={{
                                    textTransform: "uppercase",
                                    width: "50em",
                                  }}
                                  rows="3"
                                  cols="50"
                                  className="form-control"
                                  id="idEDDEvalPregunta.idEvalPregunta"
                                  placeholder="Escriba su respuesta"
                                  required={idEDDEvalPregunta.preguntaObligatoria === "1"}
                                  onChange={({ target }) => {
                                    let respuestaTexto = target.value;

                                    guardaRespEval(
                                      idEDDEvalPregunta.idEDDEvalPregunta,
                                      {
                                        id: idEDDEvalPregunta.idEDDEvalPregunta,
                                        idEDDEvalPregunta:
                                          idEDDEvalPregunta.idEDDEvalPregunta,
                                        idEDDEvalRespPreg:
                                          idEDDEvalPregunta.idEDDEvalRespPreg,
                                        tipoResp:
                                          idEDDEvalPregunta.tipoResp,
                                        respuesta: respuestaTexto,
                                        idEDDEvalProyEmp:
                                          idEDDEvalPregunta.idEDDEvalProyEmp,
                                        idEDDProyEmpEvaluador:
                                          idEDDEvalPregunta.idEDDProyEmpEvaluador,
                                      }
                                    );
                                  }}
                                ></textarea>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </>
                  );
                } else {
                  return (
                    <>
                      <tr>
                        <td>
                          <br></br>
                          {idEDDEvalPregunta.ordenPregunta}.&nbsp;
                          {idEDDEvalPregunta.nomPregunta} &nbsp;
                          {idEDDEvalPregunta.nomCompetencia}
                          {idEDDEvalPregunta.preguntaObligatoria === "1" ? (
                            <a style={{ color: "red" }}>*</a>
                          ) : (
                            <a></a>
                          )}
                        </td>
                      </tr>
                      <tr key={idEDDEvalPregunta.idEDDEvalRespPreg}>
                        <td>
                          <table>
                            <tr>
                              <td>
                                <br></br>
                                <input
                                  type="radio"
                                  name={idEDDEvalPregunta.nomPregunta}
                                  value={idEDDEvalPregunta.nomRespPreg}
                                  required={idEDDEvalPregunta.preguntaObligatoria === "1"}
                                  id="inputNomRespuesta"
                                  style={{ width: "4em",textTransform: "uppercase"}}
                                  onChange={({ target }) => {
                                    let respuestaTexto = target.value;

                                    guardaRespEval(
                                      idEDDEvalPregunta.idEDDEvalPregunta,
                                      {
                                        id: idEDDEvalPregunta.idEDDEvalPregunta,
                                        idEDDEvalPregunta:
                                          idEDDEvalPregunta.idEDDEvalPregunta,
                                        idEDDEvalRespPreg:
                                          idEDDEvalPregunta.idEDDEvalRespPreg,
                                        tipoResp:
                                          idEDDEvalPregunta.tipoResp,
                                        respuesta: respuestaTexto,
                                        idEDDEvalProyEmp:
                                          idEDDEvalPregunta.idEDDEvalProyEmp,
                                        idEDDProyEmpEvaluador:
                                          idEDDEvalPregunta.idEDDProyEmpEvaluador,
                                      }
                                    );
                                  }}
                                ></input>
                                {idEDDEvalPregunta.nomRespPreg}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </>
                  );
                }
              } else {
                return (
                  <>
                    <tr key={idEDDEvalPregunta.idEDDEvalRespPreg}>
                      <td>
                        <table>
                          <tr>
                            <td>
                              <input
                                type="radio"
                                name={idEDDEvalPregunta.nomPregunta}
                                value={idEDDEvalPregunta.nomRespPreg}
                                required={idEDDEvalPregunta.preguntaObligatoria === "1"}
                                id="inputNomRespuesta"
                                style={{ width: "4em",textTransform: "uppercase"}}
                                onChange={({ target }) => {
                                  let respuestaTexto = target.value;

                                  guardaRespEval(
                                    idEDDEvalPregunta.idEDDEvalPregunta,
                                    {
                                      id: idEDDEvalPregunta.idEDDEvalPregunta,
                                      idEDDEvalPregunta:
                                        idEDDEvalPregunta.idEDDEvalPregunta,
                                      idEDDEvalRespPreg:
                                        idEDDEvalPregunta.idEDDEvalRespPreg,
                                      tipoResp:
                                        idEDDEvalPregunta.tipoResp,
                                      respuesta: respuestaTexto,
                                      idEDDEvalProyEmp:
                                        idEDDEvalPregunta.idEDDEvalProyEmp,
                                      idEDDProyEmpEvaluador:
                                        idEDDEvalPregunta.idEDDProyEmpEvaluador,
                                    }
                                  );
                                }}
                              ></input>
                              {idEDDEvalPregunta.nomRespPreg}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </>
                );
              }
            })}
            <Button
              variant="secondary"
              type="submit"
              id="btn_registrar"
              value="Registrar"
              className="bntRegistrar"
            >
              Registrar
            </Button>
          </Table>

        </Container>
      </form>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );

}
