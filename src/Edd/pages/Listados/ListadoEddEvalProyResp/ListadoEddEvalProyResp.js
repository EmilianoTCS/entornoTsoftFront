import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillKeyFill, BsFillTrashFill } from "react-icons/bs";

import "../TablasStyles.css";
// import InsertarEddEvalProyResp from "../../templates/form/Insertar/InsertarEddEvalProyResp";
// import EditarEddEvalProyResp from "../../templates/form/Editar/EditarEddEvalProyResp";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoEddEvalProyResp() {
  const [, params] = useRoute("/listadoEddEvalProyResp/:params");

  const [EddEvalProyResp, setEddEvalProyResp] = useState([""]);
  const [isActiveInsertEDDEvalProyResp, setisActiveInsertEDDEvalProyResp] =
    useState(false);
  const [isActiveEditEDDEvalProyResp, setIsActiveEditEDDEvalProyResp] =
    useState(false);
  const [idEddEvalProyResp, setidEddEvalProyResp] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "eddevalproyresp";
  const [idEDDEvalProyEmp, setidEDDEvalProyEmp] = useState(params.params);

  const [idEDDEvaluacion, setidEDDEvaluacion] = useState(params.params);
  const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState(params.params);

  const [idEDDEvalRespPreg, setidEDDEvalRespPreg] = useState(params.params);
  const [idEDDProyEmp, setidEDDProyEmp] = useState(params.params);

  const [listEDDEvalPregunta, setlistEDDEvalPregunta] = useState([""]);
  const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);
  const [listEDDProyEmp, setlistEDDProyEmp] = useState([""]);
  const [listEDDEvalRespPreg, setlistEDDEvalRespPreg] = useState([""]);

  function obtenerProyEmp() {
    const url = "pages/auxiliares/listadoEddProyEmp.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDProyEmp(response)
    );
  }
  function obtenerRespPreg() {
    const url = "pages/auxiliares/listadoEddEvalRespPreg.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvalRespPreg(response)
    );
  }

  function obtenerEvaluacion() {
    const url = "pages/auxiliares/listadoEddEvaluacion.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvaluacion(response)
    );
  }

  function obtenerPregunta() {
    const url = "pages/auxiliares/listadoEddEvalPregunta.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEDDEvalPregunta(response)
    );
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
   //PAGINADOR ---------------------
  function handleChangePaginador() {
    var url = "pages/listados/listadoEddEvalProyResp.php";
    var operationUrl = "listadoEddEvalProyResp";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idEDDProyEmp: idEDDProyEmp,
      idEDDEvaluacion: idEDDEvaluacion,
      idEDDEvalPregunta: idEDDEvalPregunta,
      idEDDEvalProyEmp: idEDDEvalProyEmp,
      idEDDEvalRespPreg: idEDDEvalRespPreg,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEddEvalProyResp(datos.datos);
    });
  }  
  //PAGINADOR ---------------------
  
  useEffect(
    function () {
      handleChangePaginador();
      obtenerEvaluacion();
      obtenerProyEmp();
      obtenerRespPreg();
      obtenerPregunta();
    },
    [
      num_boton,
      cantidadPorPagina,
      idEDDProyEmp,
      idEDDEvalRespPreg,
      idEDDEvaluacion,
      idEDDEvalPregunta,
    ]
  );



  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de resultado de evaluaciones</h1>
          <h6 style={{ color: "gray" }}>
            EDD {"->"} Listado de resultado de evaluaciones
          </h6>
          <br></br>

          <div id="selectPaginador">
            {/* <Button id="btn" onClick={insertarEddEvalProyResp}>
              Crear EvalProyResp
            </Button> */}
            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadRegistros">
                Cantidad registros:{" "}
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
              <label htmlFor="input_CantidadR">Proyecto colaborador: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidEDDProyEmp(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {listEDDProyEmp.map((valor) => (
                  <option
                    selected={
                      valor.idEDDProyEmp === idEDDProyEmp ? "selected" : ""
                    }
                    value={valor.idEDDProyEmp}
                  >
                    {valor.nomProyEmp}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
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
            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadR">Respuesta usuario: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidEDDEvalRespPreg(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {listEDDEvalRespPreg.map((valor) => (
                  <option
                    selected={
                      valor.idEDDEvalRespPreg === idEDDEvalRespPreg
                        ? "selected"
                        : ""
                    }
                    value={valor.idEDDEvalRespPreg}
                  >
                    {valor.nomRespPreg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* <InsertarEddEvalProyResp
            isActiveInsertEDDEvalProyResp={isActiveInsertEDDEvalProyResp}
            cambiarEstado={setisActiveInsertEDDEvalProyResp}
            EDDEvalProyResp={EddEvalProyResp}
          ></InsertarEddEvalProyResp>

          <EditarEddEvalProyResp
            isActiveEditEDDEvalProyResp={isActiveEditEDDEvalProyResp}
            cambiarEstado={setIsActiveEditEDDEvalProyResp}
            idEDDEvalProyResp={idEddEvalProyResp}
            setEDDEvalProyResp={setEddEvalProyResp}
            EDDEvalProyResp={EddEvalProyResp}
            nombreTabla={nombreTabla}
          ></EditarEddEvalProyResp>  */}

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Evaluación</th>
                <th>Proyecto</th>
                <th>Colaborador</th>
                <th>Pregunta</th>
                <th>Respuesta (T)</th>

                <th>Respuesta usuario (A)</th>
                {/* <th>Operaciones</th> */}
              </tr>
            </thead>
            <tbody>
              {EddEvalProyResp.map((EddEvalProyResp) => (
                <tr key={EddEvalProyResp.idEDDEvalProyResp}>
                  <td>{EddEvalProyResp.idEDDEvalProyResp}</td>
                  <td>{EddEvalProyResp.nomEvaluacion}</td>
                  <td>{EddEvalProyResp.nomProyecto}</td>
                  <td>{EddEvalProyResp.nomEmpleado}</td>
                  <td>{EddEvalProyResp.nomPregunta}</td>
                  <td>{EddEvalProyResp.respuesta}</td>

                  <td>{EddEvalProyResp.nomRespPreg}</td>
                  <td>
                    {/* <button
                        data-title="Editar EvalProyResp"
                        id="OperationBtns"
                        onClick={() =>
                          editarEddEvalProyResp(
                            EddEvalProyResp.idEDDEvalProyResp
                          )
                        }
                      >
                        <RiEditBoxFill id="icons" />
                      </button>

                      <button
                        data-title="Desactivar EvalProyResp"
                        onClick={() =>
                          desactivar(EddEvalProyResp.idEDDEvalProyResp)
                        }
                        id="OperationBtns"
                      >
                        <BsFillTrashFill id="icons" />
                      </button> */}
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
    <Navigate to="/login"></Navigate>
  );
}
