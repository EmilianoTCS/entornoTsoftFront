import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useRoute } from "wouter";
import Swal from "sweetalert2";

import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";

import "../TablasStyles.css";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function FormularioEvaluacion() {
  const [, params] = useRoute("/listadoRespPregEvaluaciones/:params");

  const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState([""]); //Recibe la respuesta del backend y la almacena en raw, sin procesar
  const [idEDDEvalNomPregunta, setidEDDEvalNomPregunta] = useState(""); //Almacena el listado de preguntas procesado
  const [loadedData, setLoadedData] = useState(false); //Bool que determina el recibimiento correcto de los datos
  var respuestasAEnviar = [];
  const idEDDEvaluacion = params.params;
  const [fechaInicioExamen, setfechaInicioExamen] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  function reduceRepeated() {
    // Función que reduce la cantidad de elementos repetidos en un array, con esto, obtengo las preguntas filtradas
    if (idEDDEvalPregunta != "") {
      const nomPreguntas = idEDDEvalPregunta.reduce((acc, item) => {
        if (!acc.includes(item.nomPregunta)) {
          acc.push(item.nomPregunta);
        }
        return acc;
      }, []);

      const ordenPregunta = idEDDEvalPregunta.reduce((acc, item) => {
        if (!acc.includes(item.ordenPregunta)) {
          acc.push(item.ordenPregunta);
        }
        return acc;
      }, []);

      setidEDDEvalNomPregunta({
        //Guardo lo obtenido en un objeto
        nomPreguntas: nomPreguntas,
        ordenPregunta: ordenPregunta,
      });
    }
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
      }).then((result) => {
        if (result.isConfirmed) {
          var fechaIni = new Date();
          setfechaInicioExamen(fechaIni);
        }
      });
    }
  }

  useEffect(
    function () {
      handleChangePaginador();
    },
    [idEDDEvaluacion, loadedData]   //Añadido loaded data como dependencia
  );

  //---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoRespPregEvaluaciones.php";
    var operationUrl = "listadoRespPregEvaluaciones";
    var data = {
      idEvaluacion: idEDDEvaluacion,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setidEDDEvalPregunta(data);  //Guardo la respuesta obtenida del servidor (data)
      setLoadedData(true);         //Cambio el estado del booleano
      reduceRepeated();            //Invoco la función para reducir lo repetido
      ConfirmAlert();
    });
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
      },
    };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log("respuestaServer:", response);
    });
  }

  function Formulario() {
    //El formulario que va a ser visible
    if (loadedData != false) {
      //Si mi array no está vacío, trabajo en él
      return (
        <form onSubmit={SendData}>
          <Container id="fondoTabla">
            <h1>Formulario de evaluación</h1>
            <Table>
              {idEDDEvalNomPregunta.nomPreguntas.map(
                (
                  nomPreguntas,
                  index //Mapeo las preguntas filtradas
                ) => (
                  <tr>
                    <td>
                      {index + 1 + " - " + nomPreguntas}
                      {idEDDEvalPregunta.map(
                        (
                          idEDDEvalPregunta //Mapeo el array sin procesar
                        ) => (
                          <table id="respuestas">
                            {nomPreguntas === idEDDEvalPregunta.nomPregunta ? ( //Donde las preguntas filtradas coincidan con las obtenidas en el array sin procesar, se ejecuta el siguiente ternario
                              idEDDEvalPregunta.tipoResp === "T" ? ( //Si es de tipo texto, retorno un textbox
                                <fieldset>
                                  <tr key={idEDDEvalPregunta.idEDDEvalRespPreg}>
                                    <input
                                      type="text"
                                      id="idEDDEvalPregunta.idEvalPregunta"
                                      required
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
                                  </tr>
                                </fieldset>
                              ) : (
                                //Si no, retorno un checkbox
                                <fieldset>
                                  <ul>
                                    <tr
                                      key={idEDDEvalPregunta.idEDDEvalRespPreg}
                                    >
                                      <label for="inputNomRespuesta">
                                        {idEDDEvalPregunta.nomRespPreg}
                                      </label>
                                      <input
                                        type="radio"
                                        name={idEDDEvalPregunta.nomPregunta}
                                        value={idEDDEvalPregunta.nomRespPreg}
                                        required
                                        id="inputNomRespuesta"
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
                                    </tr>
                                  </ul>
                                </fieldset>
                              )
                            ) : (
                              <></>
                            )}
                          </table>
                        )
                      )}
                    </td>
                  </tr>
                )
              )}
            </Table>
            <Button
              variant="secondary"
              type="submit"
              id="btn_registrar"
              value="Registrar"
            >
              Registrar
            </Button>
          </Container>
        </form>
      );
    } else {
      return <h1>LOADING</h1>; //Si no tengo nada de lo anterior, devuelvo un loading
    }
  }

  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <Formulario></Formulario>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
