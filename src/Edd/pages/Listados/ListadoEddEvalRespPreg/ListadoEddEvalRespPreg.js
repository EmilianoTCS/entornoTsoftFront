import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";

import "../TablasStyles.css";
import InsertarEDDEvalRespPreg from "../../templates/form/Insertar/InsertarEddEvalRespPreg";
import EditarEDDEvalRespPreg from "../../templates/form/Editar/EditarEddEvalRespPreg";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import AuthorizationError from "../../../../templates/alerts/AuthorizationErrorAlert";

export default function ListadoEDDEvalRespPreg() {
  const [, params] = useRoute("/listadoEddEvalRespPreg/:params");

  const [EDDEvalRespPreg, setEDDEvalRespPreg] = useState([""]);
  const [isActiveInsertEDDEvalRespPreg, setIsActiveInsertEDDEvalRespPreg] =
    useState(false);
  const [isActiveEditEDDEvalRespPreg, setIsActiveEditEDDEvalRespPreg] =
    useState(false);
  const [idEDDEvalRespPreg, setidEDDEvalRespPreg] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "eddevalresppreg";

  const [idEDDEvaluacion, setidEDDEvaluacion] = useState(params.params);
  const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState(params.params);

  const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);
  const [listEDDEvalPregunta, setlistEDDEvalPregunta] = useState([""]);

  function obtenerEDDEvalPregunta() {
    const url = "pages/auxiliares/listadoEddEvalPregunta.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvalPregunta(response)
    );
  }
  function obtenerEvaluacion() {
    const url = "pages/auxiliares/listadoEddEvaluacion.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvaluacion(response)
    );
  }
  function insertarEDDEvalRespPreg() {
    setIsActiveInsertEDDEvalRespPreg(!isActiveInsertEDDEvalRespPreg);
  }
  function editarEDDEvalRespPreg(ID) {
    setIsActiveEditEDDEvalRespPreg(!isActiveEditEDDEvalRespPreg);
    setidEDDEvalRespPreg(ID);
  }

  function desactivar(ID) {
    ConfirmAlert().then((response) => {
      if (response === true) {
        var url = "pages/cambiarEstado/cambiarEstado.php";
        var operationUrl = "cambiarEstado";
        var data = {
          idRegistro: ID,
          usuarioModificacion: userData.usuario,
          nombreTabla: nombreTabla,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          TopAlerts("successEdited");
        });
      }
    });
  }

  useEffect(
    function () {
      handleChangePaginador();
      obtenerEDDEvalPregunta();
      // obtenerEvaluacion()
    },
    [num_boton, cantidadPorPagina, idEDDEvalPregunta]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoEddEvalRespPreg.php";
    var operationUrl = "listadoEddEvalRespPreg";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idEDDEvalPregunta: idEDDEvalPregunta,
      idEvaluacion: 0,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEDDEvalRespPreg(datos.datos);
    });
  }

  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ? (
      <>
        <Header></Header>
        <br></br>
        <br></br>

        <div id="fondoTabla">
          <div id="containerTablas">
            <a
              type="submit"
              id="btnAtras"
              value="Registrar"
              href="/listadoEddEvalPregunta/0"
            >
              Volver
            </a>
            <h1 id="TitlesPages">
              Listado de respuestas de preguntas de evaluaciones
            </h1>
            <h6 style={{ color: "gray" }}>
              EDD {"->"} Listado de respuestas de preguntas de evaluaciones
            </h6>
            <br></br>

            <div id="selectPaginador">
              {userData.nomRol === "administrador" ? (
                <Button id="btn" onClick={insertarEDDEvalRespPreg}>
                  Crear respuesta de pregunta
                </Button>
              ) : null}

              <div className="form-group" id="btn2">
                <label htmlFor="input_CantidadRegistros">
                  Cantidad registros:
                </label>
                <select
                  value={cantidadPorPagina || ""}
                  className="form-control"
                  name="input_CantidadRegistros"
                  id="input_CantidadRegistros"
                  onChange={({ target }) => {
                    setcantidadPorPagina(target.value);
                    setNumBoton(1);
                  }}
                  required
                >
                  <option hidden value="">
                    {cantidadPorPagina}
                  </option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="form-group" id="btn2" style={{ width: 200 }}>
                <label htmlFor="input_CantidadR">Pregunta: </label>
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    setidEDDEvalPregunta(target.value);
                    setNumBoton(1);
                  }}
                >
                  <option value="">Todos</option>
                  {listEDDEvalPregunta.map((valor) => (
                    <option
                      selected={
                        valor.idEDDEvalPregunta === idEDDEvalPregunta
                          ? "selected"
                          : ""
                      }
                      value={valor.idEDDEvalPregunta}
                    >
                      {valor.nomPregunta}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <InsertarEDDEvalRespPreg
              isActiveEDDEvalRespPreg={isActiveInsertEDDEvalRespPreg}
              cambiarEstado={setIsActiveInsertEDDEvalRespPreg}
              EDDEvalRespPreg={EDDEvalRespPreg}
              idEDDEvalPregunta={idEDDEvalPregunta}
            ></InsertarEDDEvalRespPreg>

            <EditarEDDEvalRespPreg
              isActiveEditEDDEvalRespPreg={isActiveEditEDDEvalRespPreg}
              cambiarEstado={setIsActiveEditEDDEvalRespPreg}
              idEDDEvalRespPreg={idEDDEvalRespPreg}
              setEDDEvalRespPreg={setEDDEvalRespPreg}
              EDDEvalRespPreg={EDDEvalRespPreg}
              nombreTabla={nombreTabla}
            ></EditarEDDEvalRespPreg>

            <Table id="mainTable" hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pregunta</th>
                  <th>Orden</th>
                  <th>Respuesta</th>
                  <th>Evaluación</th>
                  {userData.nomRol === "administrador" ? (
                    <th>Operaciones</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {EDDEvalRespPreg.map((idEDDEvalRespPreg) => (
                  <tr key={idEDDEvalRespPreg.idEDDEvalRespPreg}>
                    <td>{idEDDEvalRespPreg.idEDDEvalRespPreg}</td>
                    <td>{idEDDEvalRespPreg.nomPregunta}</td>
                    <td align="right" width={10}>
                      {idEDDEvalRespPreg.ordenRespPreg}
                    </td>
                    <td>{idEDDEvalRespPreg.nomRespPreg}</td>
                    <td>{idEDDEvalRespPreg.nomEvaluacion}</td>

                    <td>
                      {userData.nomRol === "administrador" ? (
                        <>
                          <button
                            data-title="Editar respuesta de pregunta"
                            id="OperationBtns"
                            onClick={() =>
                              editarEDDEvalRespPreg(
                                idEDDEvalRespPreg.idEDDEvalRespPreg
                              )
                            }
                          >
                            <RiEditBoxFill id="icons" />
                          </button>

                          <button
                            data-title="Desactivar respuesta de pregunta"
                            onClick={() =>
                              desactivar(idEDDEvalRespPreg.idEDDEvalRespPreg)
                            }
                            id="OperationBtns"
                          >
                            <BsFillTrashFill id="icons" />
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Paginador
              paginas={cantidadPaginas}
              cambiarNumero={setNumBoton}
              num_boton={num_boton}
            ></Paginador>
          </div>
        </div>
      </>
    ) : (
      <AuthorizationError />
    )
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
