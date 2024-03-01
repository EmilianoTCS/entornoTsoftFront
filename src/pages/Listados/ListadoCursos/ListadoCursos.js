import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";
import GetDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { BsBookmarksFill } from "react-icons/bs";
import { AiTwotoneEdit } from "react-icons/ai";

import "../TablasStyles.css";
import InsertarCurso from "../../../templates/forms/Insertar/InsertarCurso";
import EditarCurso from "../../../templates/forms/Editar/EditarCurso";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../../Listados/BtnInsertar.css";

export default function ListadoCursos() {
  const [curso, setCurso] = useState([""]);
  const [isActiveInsertCurso, setIsActiveInsertCurso] = useState(false);
  const [isActiveEditCurso, setIsActiveEditCurso] = useState(false);
  const [idCurso, setIDCurso] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  const nombreTabla = "curso";

  function insertarCurso() {
    setIsActiveInsertCurso(!isActiveInsertCurso);
  }

  function editarCurso(ID) {
    setIsActiveEditCurso(!isActiveEditCurso);
    setIDCurso(ID);
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
    },
    [num_boton, cantidadPorPagina]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoCursos.php";
    var operationUrl = "listadoCursos";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setCurso(datos.datos);
    });
  }

  //PAGINADOR ---------------------
  return userData.statusConected || userData !== null ? (
    <>
      {userData.nomRol === "administrador" ||
      userData.nomRol === "gerencia" ||
      userData.nomRol === "people" ||
      userData.nomRol === "relator" ? (
        <>
          <Header></Header>
          <br></br>
          <br></br>
          <div id="fondoTabla">
            <div id="containerTablas">
              <h1 id="TitlesPages">Listado de cursos</h1>
              <h6 style={{ color: "gray" }}>
                Factory Devops {"->"} Listado de Cursos
              </h6>
              <br></br>

              <div id="selectPaginador">
                {userData.nomRol === "administrador" ? (
                  <Button id="btn" onClick={insertarCurso}>
                    Crear Curso
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
              </div>

              <InsertarCurso
                isActiveCurso={isActiveInsertCurso}
                cambiarEstado={setIsActiveInsertCurso}
                curso={curso}
              ></InsertarCurso>

              <EditarCurso
                isActiveEditCurso={isActiveEditCurso}
                cambiarEstado={setIsActiveEditCurso}
                idCurso={idCurso}
                setCurso={setCurso}
                curso={curso}
                nombreTabla={nombreTabla}
              ></EditarCurso>


              <Table id="mainTable" hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Curso</th>
                    <th>Tipo Horas</th>
                    <th>Durac horas</th>
                    <th>Cant sesiones</th>
                    <th>Operaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {curso.map((curso) => (
                    <tr key={curso.idCurso}>
                      <td>{curso.idCurso}</td>
                      <td>{curso.codCurso}</td>
                      <td>{curso.nomCurso}</td>
                      <td>{curso.tipoHH}</td>
                      <td align="right" width={30}>
                        {curso.duracionCursoHH}
                      </td>
                      <td align="right" width={30}>
                        {curso.cantSesionesCurso}
                      </td>
                      <td>
                        {userData.nomRol === "administrador" ? (
                          <button
                            data-title="Editar curso"
                            id="OperationBtns"
                            onClick={() => editarCurso(curso.idCurso)}
                          >
                            <RiEditBoxFill id="icons" />
                          </button>
                        ) : null}

                        <Link to={`/listadoRamos/${curso.idCurso}`}>
                          <button
                            data-title="Ramo relacionado"
                            id="OperationBtns"
                          >
                            <BsBookmarksFill id="icons" />
                          </button>
                        </Link>

                        <Link to={`/listadoReqCurso/${curso.idCurso}`}>
                          <button
                            data-title="Requisito relacionado"
                            id="OperationBtns"
                          >
                            <AiTwotoneEdit id="icons" />
                          </button>
                        </Link>
                        {userData.nomRol === "administrador" ? (
                          <button
                            data-title="Desactivar curso"
                            onClick={() => desactivar(curso.idCurso)}
                            id="OperationBtns"
                          >
                            <BsFillTrashFill id="icons" />
                          </button>
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
        <AuthorizationError></AuthorizationError>
      )}
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
