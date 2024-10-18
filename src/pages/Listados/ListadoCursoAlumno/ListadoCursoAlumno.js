import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { ImBook } from "react-icons/im";

import "../TablasStyles.css";
import InsertarCursoAlumno from "../../../templates/forms/Insertar/InsertarCursoAlumno";
import EditarCursoAlumno from "../../../templates/forms/Editar/EditarCursoAlumno";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";

export default function ListadoCursoAlumno() {
  const [, params] = useRoute("/listadoCursoAlumnos/:params");

  const [CursoAlumno, setCursoAlumno] = useState([""]);
  const [isActiveInsertCursoAlumno, setIsActiveInsertCursoAlumno] =
    useState(false);
  const [idCursoAlumno, setidCursoAlumno] = useState(null);
  const [isActiveEditCursoAlumno, setIsActiveEditCursoAlumno] = useState(false);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  const nombreTabla = "cursoalumno";

  const [idEmpleado, setidEmpleado] = useState(params.params);
  const [idCurso, setidCurso] = useState(params.params);

  const [listEmpleado, setlistEmpleado] = useState([""]);
  const [listCurso, setlistCurso] = useState([""]);

  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }

  function obtenerCurso() {
    const url = "pages/auxiliares/listadoCursoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCurso(response)
    );
  }

  function insertarCursoAlumno() {
    setIsActiveInsertCursoAlumno(!isActiveInsertCursoAlumno);
  }
  function editarCursoAlumno(ID) {
    setIsActiveEditCursoAlumno(!isActiveEditCursoAlumno);
    setidCursoAlumno(ID);
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
      obtenerCurso();
      obtenerEmpleado();
    },
    [num_boton, cantidadPorPagina, idEmpleado, idCurso]
  );

  //PAGINADOR ---------------------
  function handleChangePaginador() {
    var url = "pages/listados/listadoCursoAlumno.php";
    var operationUrl = "listadoCursoAlumno";
    if (userData.nomRol === "alumno") {
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idEmpleado: userData.idEmpleado,
        idCurso: idCurso,
      };
    } else {
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idEmpleado: idEmpleado,
        idCurso: idCurso,
      };
    }
    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setCursoAlumno(datos.datos);
      console.log(data);
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
            <h1 id="TitlesPages">Listado de Cursos Alumnos</h1>
            <h6 style={{ color: "gray" }}>
              Factory Devops {"->"} Listado de Cursos Alumnos
            </h6>
            <br></br>

            <div id="selectPaginador">
              {userData.nomRol === "administrador" ? (
                <Button id="btn" onClick={insertarCursoAlumno}>
                  Crear Curso Alumno
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
              {userData.nomRol === "administrador" ||
              userData.nomRol === "gerencia" ||
              userData.nomRol === "people" ||
              userData.nomRol === "relator" ? (
                <div className="form-group" id="btn2">
                  <label htmlFor="input_CantidadR">Alumnos: </label>
                  <select
                    required
                    type="text"
                    className="form-control"
                    onChange={({ target }) => {
                      setidEmpleado(target.value);
                      setNumBoton(1);
                    }}
                  >
                    <option value="">Todos</option>
                    {listEmpleado.map((valor) => (
                      <option
                        selected={
                          valor.idEmpleado === idEmpleado ? "selected" : ""
                        }
                        value={valor.idEmpleado}
                      >
                        {valor.nomEmpleado}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>

            <InsertarCursoAlumno
              isActiveCursoAlumno={isActiveInsertCursoAlumno}
              cambiarEstado={setIsActiveInsertCursoAlumno}
              CursoAlumno={CursoAlumno}
            ></InsertarCursoAlumno>

            <EditarCursoAlumno
              isActiveEditCursoAlumno={isActiveEditCursoAlumno}
              cambiarEstado={setIsActiveEditCursoAlumno}
              idCursoAlumno={idCursoAlumno}
              setCursoAlumno={setCursoAlumno}
              CursoAlumno={CursoAlumno}
              nombreTabla={nombreTabla}
            ></EditarCursoAlumno>

            <Table id="mainTable" hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Alumno</th>
                  <th>Curso</th>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>%Asist</th>
                  <th>%Partic</th>
                  <th>%Aprob</th>
                  <th>Aprobada</th>
                  <th>Estado</th>
                  <th>Operaciones</th>
                </tr>
              </thead>
              <tbody>
                {CursoAlumno.map((CursoAlumno) => (
                  <tr key={CursoAlumno.idCursoAlumno}>
                    <td>{CursoAlumno.idCursoAlumno}</td>
                    <td>{CursoAlumno.nomEmpleado}</td>
                    <td>{CursoAlumno.nomCurso}</td>
                    <td width={120}>{CursoAlumno.fechaIni}</td>
                    <td>{CursoAlumno.fechaFin}</td>

                    <td align="right">{CursoAlumno.porcAsistencia}</td>
                    <td align="right">{CursoAlumno.porcParticipacion}</td>
                    <td align="right">{CursoAlumno.porcAprobacion}</td>
                    <td>{CursoAlumno.claseAprobada}</td>
                    <td>{CursoAlumno.estadoCurso}</td>
                    <td>
                      {userData.nomRol === "administrador" ? (
                        <button
                          data-title="Editar CursoAlumno"
                          id="OperationBtns"
                          onClick={() =>
                            editarCursoAlumno(CursoAlumno.idCursoAlumno)
                          }
                        >
                          <RiEditBoxFill id="icons" />
                        </button>
                      ) : null}

                      <Link
                        to={`/listadoCursoAlumnoRamo/${CursoAlumno.idCursoAlumno}`}
                      >
                        <button
                          data-title="Curso-Alum-Ramo relacionado"
                          id="OperationBtns"
                        >
                          <ImBook id="icons" />
                        </button>
                      </Link>
                      {userData.nomRol === "administrador" ? (
                        <button
                          data-title="Desactivar CursoAlumno"
                          onClick={() => desactivar(CursoAlumno.idCursoAlumno)}
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
      <AuthorizationError />
    )
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
