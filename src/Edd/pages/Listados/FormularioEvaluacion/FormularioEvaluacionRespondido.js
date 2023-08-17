import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import { useRoute } from "wouter";

import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import "../TablasStyles.css";
import "./formStyle.css";
import "../BtnInsertar.css";

export default function FormularioEvaluacionRespondida() {
  const [, params] = useRoute(
    "/listadoEvalResp/:idEvaluacion/:idEDDProyEmpEvaluado/:idEDDProyEmpEvaluador"
  );

  const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState([""]); //Recibe la respuesta del backend y la almacena en raw, sin procesar
  const [loadedData, setLoadedData] = useState(false); //Bool que determina el recibimiento correcto de los datos
  const idEDDEvaluacion = params.idEvaluacion;
  const idEDDProyEmpEvaluado = params.idEDDProyEmpEvaluado;
  const idEDDProyEmpEvaluador = params.idEDDProyEmpEvaluador;
  const [inputVerEnDashboard, setInputVerEnDashboard] = useState();
  const [inputOrdenDashboard, setInputOrdenDashboard] = useState();
  const [idEDDEvalProyEmp, setIdEDDEvalProyEmp] = useState();
  const [disableInputText, setDisableInputText] = useState(true);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  //Obtiene las preguntas y respuestas de la BDD
  function GetData() {
    var url = "pages/listados/listadoProyRespFinales.php";
    var operationUrl = "listadoProyRespFinales";
    var data = {
      idEvaluacion: idEDDEvaluacion,
      idEmpleado: idEDDProyEmpEvaluador,
      idEDDProyEmpEvaluado: idEDDProyEmpEvaluado,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setidEDDEvalPregunta(data);
      setLoadedData(true); //Cambio el estado del booleano
    });
  }

  //Habilita o deshabilita la visualización del registro en el dashboard
  function VerEnDashboard(e) {
    e.preventDefault();

    if (
      inputVerEnDashboard === "0" ||
      idEDDEvalPregunta.verEnDashboard === null
    ) {
      const url = "pages/cambiarEstado/verEndashboard.php";
      const operationUrl = "verEnDashboard";
      var data = {
        idEmpleado: idEDDProyEmpEvaluador,
        idEDDProyEmpEvaluado: idEDDProyEmpEvaluado,
        idEvaluacion: idEDDEvaluacion,
        idEDDEvalProyResp: idEDDEvalProyEmp,
        verEnDashboard: 1,
        ordenDashboard: inputOrdenDashboard,
      };

      SendDataService(url, operationUrl, data).then((response) => {
        console.log("response sv", response);
        actualizarRespuesta(response[0]);
      });
    } else {
      const url = "pages/cambiarEstado/verEndashboard.php";
      const operationUrl = "verEnDashboard";
      var data = {
        idEmpleado: idEDDProyEmpEvaluador,
        idEDDProyEmpEvaluado: idEDDProyEmpEvaluado,
        idEvaluacion: idEDDEvaluacion,
        idEDDEvalProyResp: idEDDEvalProyEmp,
        verEnDashboard: "",
        ordenDashboard: "",
      };

      SendDataService(url, operationUrl, data).then((response) => {
        console.log("response sv", response);
        actualizarRespuesta(response[0]);
      });
    }
  }

  //Una vez actualizado el dashboard, obtiene el registro actualizado y lo reemplaza por el original
  function actualizarRespuesta(props) {
    const nuevaRespuesta = idEDDEvalPregunta.map((item) =>
      item.idEDDEvalProyResp === props.idEDDEvalProyResp ? props : item
    );
    setidEDDEvalPregunta(nuevaRespuesta);
    // console.log("updated", idEDDEvalPregunta);
  }

  //Se ejecuta al entrar a la página y se actualiza de acuerdo a las dependencias establecidas
  useEffect(
    function () {
      GetData();
    },
    [idEDDEvaluacion, loadedData, idEDDEvalPregunta]
  );
  var auxEncabezado = "0";
  var auxOrden = "0";

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <div>
        {" "}
        <a
          style={{ margin: "10px", marginTop: "15px", marginLeft: "60px" }}
          type="submit"
          id="btnAtras"
          value="Registrar"
          href="javascript: history.go(-1)"
        >
          Volver
        </a>
        <Container id="textStyle">
          {idEDDEvalPregunta.map((idEDDEvalPregunta) => {
            if (auxEncabezado !== idEDDEvalPregunta.nomEvaluacion) {
              return (
                <>
                  <strong>
                    <h2>
                      Resultados de la evaluación: &nbsp;
                      {(auxEncabezado = idEDDEvalPregunta.nomEvaluacion)}
                    </h2>
                  </strong>
                  <strong>
                    <h5>
                      Realizado por: &nbsp;{idEDDEvalPregunta.nomEvaluador}
                    </h5>
                  </strong>
                </>
              );
            }
          })}
        </Container>
        <Container id="fondoTabla1">
          <br></br>
          <Container>
            {idEDDEvalPregunta.map((idEDDEvalPregunta) => {
              if (auxOrden !== idEDDEvalPregunta.pregunta) {
                return (
                  <>
                    <Table>
                      <tr>
                        <td
                          id="pregunta"
                          style={{ textTransform: "uppercase" }}
                        >
                          {idEDDEvalPregunta.ordenPregunta}. &nbsp;
                          {(auxOrden = idEDDEvalPregunta.pregunta)} &nbsp;
                          {idEDDEvalPregunta.nomCompetencia}
                        </td>
                      </tr>

                      <tr>
                        <td
                          id="respuesta"
                          style={{ textTransform: "uppercase" }}
                        >
                          {idEDDEvalPregunta.respuesta === null ? (
                            <h6>No respondida</h6>
                          ) : (
                            idEDDEvalPregunta.respuesta
                          )}
                        </td>
                      </tr>

                      <Container>
                        <form
                          name={idEDDEvalPregunta.ordenPregunta}
                          id={idEDDEvalPregunta.ordenPregunta}
                          onSubmit={VerEnDashboard}
                        >
                          <div>
                            <label for="verEnDashboard">Habilitar</label>
                            <input
                              type="checkbox"
                              id="verEnDashboard"
                              value={
                                idEDDEvalPregunta.verEnDashboard === "0" ||
                                idEDDEvalPregunta.verEnDashboard === null
                                  ? "0"
                                  : "1"
                              }
                              defaultChecked={
                                idEDDEvalPregunta.verEnDashboard === "1" ||
                                idEDDEvalPregunta.verEnDashboard !== null
                                  ? true
                                  : false
                              }
                              onChange={({ target }) => {
                                setInputVerEnDashboard(target.value);
                                setIdEDDEvalProyEmp(
                                  idEDDEvalPregunta.idEDDEvalProyResp
                                );
                                setDisableInputText(!disableInputText);
                              }}
                            />
                          </div>
                          <div>
                            <>
                              <input
                                type="number"
                                placeholder="Orden de dashboard"
                                name={idEDDEvalPregunta.ordenPregunta}
                                onChange={({ target }) => {
                                  setInputOrdenDashboard(target.value);
                                }}
                              ></input>
                              <br />
                            </>
                          </div>
                          <Button type="submit">Sub</Button>
                        </form>
                      </Container>

                      <br></br>
                    </Table>
                  </>
                );
              }
            })}
            &nbsp;
          </Container>
        </Container>
      </div>
      <br></br>
      <br></br>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}