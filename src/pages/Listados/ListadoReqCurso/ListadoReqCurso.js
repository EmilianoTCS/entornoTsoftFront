import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { HiEye } from "react-icons/hi";
import "../TablasStyles.css";
import InsertarReqCurso from "../../../templates/forms/Insertar/InsertarReqCurso";
import EditarReqCurso from "../../../templates/forms/Editar/EditarReqCurso";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";

export default function ListadoReqCurso() {
  const [, params] = useRoute("/listadoReqCurso/:params");
  const [reqCurso, setReqCurso] = useState([""]);
  const [isActiveInsertReqCurso, setIsActiveInsertReqCurso] = useState(false);
  const [idReqCurso, setidReqCurso] = useState(null);
  const [isActiveEditReqCurso, setIsActiveEditReqCurso] = useState(false);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "reqcurso";

  const [idCurso, setidCurso] = useState(params.params);

  const [listCurso, setlistCurso] = useState([""]);

  function obtenerCurso() {
    const url = "pages/auxiliares/listadoCursoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCurso(response)
    );
  }

  function insertarReqCurso() {
    setIsActiveInsertReqCurso(!isActiveInsertReqCurso);
  }
  function editarReqCurso(ID) {
    setIsActiveEditReqCurso(!isActiveEditReqCurso);
    setidReqCurso(ID);
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
        console.log(data);
        SendDataService(url, operationUrl, data).then((response) => {
          TopAlerts("successEdited");
        });
      }
    });
  }
  useEffect(
    function () {
      handleChangePaginador();
      obtenerCurso();
    },
    [num_boton, cantidadPorPagina, idCurso]
  );

  //PAGINADOR ---------------------
  function handleChangePaginador() {
    var url = "pages/listados/listadoReqCurso.php";
    var operationUrl = "listadoReqCurso";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idCurso: idCurso,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setReqCurso(datos.datos);
    });
  }
  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ||
    userData.nomRol === "alumno" ||
    userData.nomRol === "relator" ? (
      <>
        <Header></Header>
        <br></br>
        <br></br>
        <div id="fondoTabla">
          <div id="containerTablas">
            <a id="btnAtras" href="/listadoCursos/0">
              Volver
            </a>
            <h1 id="TitlesPages">Listado de requisitos cursos</h1>
            <h6 style={{ color: "gray" }}>
              Factory Devops {"->"} Listado de requisitos cursos
            </h6>
            <br></br>

            <div id="selectPaginador">
              {userData.nomRol === "administrador" ? (
                <Button id="btn" onClick={insertarReqCurso}>
                  Crear Req Curso
                </Button>
              ) : null}

              <div className="form-group" id="btn2">
                <label htmlFor="input_CantidadR">Cantidad registros: </label>
                <select
                  value={cantidadPorPagina || ""}
                  className="form-control"
                  name="input_CantidadR"
                  id="input_CantidadR"
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
                <label htmlFor="input_CantidadR">Cursos: </label>
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    setidCurso(target.value);
                    setNumBoton(1);
                  }}
                >
                  <option hidden value="" selected>
                    Desplegar lista
                  </option>
                  <option value="">Todos</option>
                  {listCurso.map((valor) => (
                    <option
                      selected={valor.idCurso === idCurso ? "selected" : ""}
                      value={valor.idCurso}
                    >
                      {valor.nomCurso}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <InsertarReqCurso
              isActiveReqCurso={isActiveInsertReqCurso}
              cambiarEstado={setIsActiveInsertReqCurso}
              reqCurso={reqCurso}
            ></InsertarReqCurso>

            <EditarReqCurso
              isActiveEditReqCurso={isActiveEditReqCurso}
              cambiarEstado={setIsActiveEditReqCurso}
              idReqCurso={idReqCurso}
              setReqCurso={setReqCurso}
              reqCurso={reqCurso}
              nombreTabla={nombreTabla}
            ></EditarReqCurso>

            <Table id="mainTable" hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre curso</th>
                  <th>Requisito curso</th>
                  {userData.nomRol === "administrador" ? (
                    <th>Operaciones</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {reqCurso.map((reqCurso) => (
                  <tr key={reqCurso.idReqCurso}>
                    <td>{reqCurso.idReqCurso}</td>
                    <td>{reqCurso.nomCurso}</td>
                    <td>{reqCurso.requisitoCurso}</td>
                    {userData.nomRol === "administrador" ? (
                      <td>
                        <button
                          data-title="Editar ReqCurso"
                          id="OperationBtns"
                          onClick={() => editarReqCurso(reqCurso.idReqCurso)}
                        >
                          <RiEditBoxFill id="icons" />
                        </button>
                        <button
                          data-title="Desactivar ReqCurso"
                          onClick={() => desactivar(reqCurso.idReqCurso)}
                          id="OperationBtns"
                        >
                          <BsFillTrashFill id="icons" />
                        </button>
                      </td>
                    ) : null}
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
