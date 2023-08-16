import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillBook } from "react-icons/ai";

import "../TablasStyles.css";
import InsertarEDDEvalPregunta from "../../templates/form/Insertar/InsertarEddEvalPregunta";
import EditarEddEvalPregunta from "../../templates/form/Editar/EditarEddEvalPregunta";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoEDDEvalPregunta() {
  const [, params] = useRoute("/listadoEddEvalPregunta/:params");

  const [EDDEvalPregunta, setEDDEvalPregunta] = useState([""]);
  const [isActiveInsertEDDEvalPregunta, setIsActiveInsertEDDEvalPregunta] =
    useState(false);
  const [isActiveEditEDDEvalPregunta, setIsActiveEditEDDEvalPregunta] =
    useState(false);
  const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "eddevalpregunta";

  const [idEDDEvalCompetencia, setidEDDEvalCompetencia] = useState(
    null
  );
  const [idEDDEvaluacion, setidEDDEvaluacion] = useState(params.params);
  const [idEDDEvaPregunta, setidEDDEvaPregunta] = useState(params.params);

  const [listEDDEvaPregunta, setlistEDDEvaPregunta] = useState([""]);

  const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);
  const [listEDDEvalCompetencia, setlistEDDEvalCompetencia] = useState([""]);

  function obtenerEDDEvalCompetencia() {
    const url = "pages/auxiliares/listadoEddEvalCompetencia.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvalCompetencia(response)
    );
  }

  function obtenerEDDEvaluacion() {
    const url = "pages/auxiliares/listadoEddEvaluacion.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvaluacion(response)
    );
  }

  function obtenerEDDEvalPregunta() {
    const url = "pages/auxiliares/listadoEddEvalPregunta.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
    setlistEDDEvaPregunta(response)
    );
  }

  function insertarEDDEvalPregunta() {
    setIsActiveInsertEDDEvalPregunta(!isActiveInsertEDDEvalPregunta);
  }
  function editarEDDEvalPregunta(ID) {
    setIsActiveEditEDDEvalPregunta(!isActiveEditEDDEvalPregunta);
    setidEDDEvalPregunta(ID);
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
      obtenerEDDEvalCompetencia();
      obtenerEDDEvaluacion();
      obtenerEDDEvalPregunta()
    },
    [num_boton, cantidadPorPagina,idEDDEvaluacion,idEDDEvalPregunta,idEDDEvalCompetencia]

    
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoEddEvalPregunta.php";
    var operationUrl = "listadoEddEvalPregunta";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idEDDEvalCompetencia: idEDDEvalCompetencia,
      idEDDEvaluacion: idEDDEvaluacion,
      idEDDEvalPregunta:idEDDEvalPregunta
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEDDEvalPregunta(datos.datos);
    });
  }

  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <Container id="fondoTabla">
        <div id="containerTablas">
        <a
            type="submit"
            id="btnAtras"
            value="Registrar"
            href="/listadoEddEvaluacion/0">Volver
          </a>
          <h1 id="TitlesPages"> Listado de preguntas de evaluaciones</h1>
          <h6 style={{ color: "gray" }}>
            EDD {"->"} Listado de preguntas de evaluaciones
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarEDDEvalPregunta}>
              Crear pregunta 
            </Button>

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
            {/* <div className="form-group" id="btn2" style={{width:200}}>
              <label htmlFor="input_CantidadR">Pregunta: </label>
              <select
                required
                type="text"
                                
                className="form-control"
                onChange={({ target }) => {
                  setidEDDEvaPregunta(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {listEDDEvaPregunta.map((valor) => (
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
            </div> */}
            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadR">Evaluación: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidEDDEvaluacion(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {listEDDEvaluacion.map((valor) => (
                  <option
                    selected={
                      valor.idEDDEvaluacion === idEDDEvaluacion
                        ? "selected"
                        : ""
                    }
                    value={valor.idEDDEvaluacion}
                  >
                    {valor.nomEvaluacion}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadR">Competencia: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidEDDEvalCompetencia(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {listEDDEvalCompetencia.map((valor) => (
                  <option
                    selected={
                      valor.idEDDEvalCompetencia === idEDDEvalCompetencia
                        ? "selected"
                        : ""
                    }
                    value={valor.idEDDEvalCompetencia}
                  >
                    {valor.nomCompetencia}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InsertarEDDEvalPregunta
            isActiveEDDEvalPregunta={isActiveInsertEDDEvalPregunta}
            cambiarEstado={setIsActiveInsertEDDEvalPregunta}
            EDDEvalPregunta={EDDEvalPregunta}
          ></InsertarEDDEvalPregunta>

          <EditarEddEvalPregunta
            isActiveEditEDDEvalPregunta={isActiveEditEDDEvalPregunta}
            cambiarEstado={setIsActiveEditEDDEvalPregunta}
            idEDDEvalPregunta={idEDDEvalPregunta}
            setEDDEvalPregunta={setEDDEvalPregunta}
            EDDEvalPregunta={EDDEvalPregunta}
            nombreTabla={nombreTabla}
          ></EditarEddEvalPregunta>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Pregunta</th>
                <th>Orden</th>
                <th>Evaluación</th>
                <th>Competencia</th>
                <th>Tipo respuesta</th>
                <th>Obligatorio</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {EDDEvalPregunta.map((idEDDEvalPregunta) => (
                <tr key={idEDDEvalPregunta.idEDDEvalPregunta}>
                  <td>{idEDDEvalPregunta.idEDDEvalPregunta}</td>
                  <td>{idEDDEvalPregunta.nomPregunta}</td>
                  <td>{idEDDEvalPregunta.ordenPregunta}</td>
                  <td>{idEDDEvalPregunta.nomEvaluacion}</td>
                  <td>{idEDDEvalPregunta.nomCompetencia}</td>
                  <td>
                    {idEDDEvalPregunta.tipoResp === 'A' ? (
                      <td>ALTERNATIVA</td>
                    ) : (
                      <td>TEXTO</td>
                    )}
                  </td>
                  <td>{idEDDEvalPregunta.preguntaObligatoria}</td>
                  

                  <td align="center">
                    <button
                      data-title="Editar pregunta"
                      id="OperationBtns"
                      onClick={() =>
                        editarEDDEvalPregunta(
                          idEDDEvalPregunta.idEDDEvalPregunta
                        )
                      }
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    <Link to={`/listadoEddEvalRespPreg/${idEDDEvalPregunta.idEDDEvalPregunta}`}>
                      <button data-title="Respuestas relacionadas" id="OperationBtns">
                        <AiFillBook id="icons" />
                      </button>
                    </Link>
                    <button
                      data-title="Desactivar pregunta"
                      onClick={() =>
                        desactivar(idEDDEvalPregunta.idEDDEvalPregunta)
                      }
                      id="OperationBtns"
                    >
                      <BsFillTrashFill id="icons" />
                    </button>
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
      </Container>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
