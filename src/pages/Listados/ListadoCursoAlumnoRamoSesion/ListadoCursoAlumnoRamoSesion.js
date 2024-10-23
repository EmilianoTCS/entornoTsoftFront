import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
// import { HiEye } from "react-icons/hi";
import "../TablasStyles.css";
import InsertarCursoAlumnoSesion from "../../../templates/forms/Insertar/InsertarCursoAlumnoRamoSesion";
import EditarCursoAlumnoSesion from "../../../templates/forms/Editar/EditarCursoAlumnoRamoSesion";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";

export default function ListadoCursoAlumnoRamoSesion() {
  const [, params] = useRoute("/listadoCursoAlumnoRamoSesion/:params");

  const [cursoAlumnoSesion, setCursoAlumnoSesion] = useState([""]);
  const [isActiveInsertCursoAlumnoSesion, setIsActiveInsertCursoAlumnoSesion] =
    useState(false);
  const [idCursoAlumnoSesion, setidCursoAlumnoSesion] = useState(null);
  const [isActiveEditCursoAlumnoSesion, setIsActiveEditCursoAlumnoSesion] =
    useState(false);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  const [idSesion, setidSesion] = useState(params.params);
  const [idEmpleado, setidEmpleado] = useState(0);

  const [listSesion, setlistSesion] = useState([""]);
  const [listEmpleado, setlistEmpleado] = useState([""]);

  const nombreTabla = "cursoalumnoramo_sesion";

  function obtenerSesion() {
    const url = "pages/auxiliares/listadoSesionForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistSesion(response)
    );
  }
  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }
  function insertarCursoAlumnoSesion() {
    setIsActiveInsertCursoAlumnoSesion(!isActiveInsertCursoAlumnoSesion);
  }
  function editarCursoAlumnoSesion(ID) {
    setIsActiveEditCursoAlumnoSesion(!isActiveEditCursoAlumnoSesion);
    setidCursoAlumnoSesion(ID);
  }

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/af_desactivarCursoAlumnoRamoSesion.php";
        var operationUrl = "af_desactivarCursoAlumnoRamoSesion";
        var data = {
          idCursoAlumnoRamoSesion: ID,
          usuarioModificacion: userData.usuario,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        });
      }
    });
  }
  useEffect(
    function () {
      handleChangePaginador();
      obtenerSesion();
      obtenerEmpleado();
    },
    [num_boton, cantidadPorPagina, idSesion, idEmpleado]
  );

  //PAGINADOR ---------------------
  function handleChangePaginador() {
    var url = "pages/listados/listadoCursoAlumnoRamoSesion.php";
    var operationUrl = "listadoCursoAlumnoRamoSesion";

    if (userData.nomRol === "alumno") {
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idSesion: idSesion,
        idEmpleado: userData.idEmpleado,
      };
    } else {
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idSesion: idSesion,
        idEmpleado: idEmpleado,
      };
    }
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setCursoAlumnoSesion(datos.datos);
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
            <h1 id="TitlesPages">Listado de Cursos Alumnos Sesiones</h1>
            <h6 style={{ color: "gray" }}>
              Factory Devops {"->"} Listado de Cursos Alumnos Sesiones
            </h6>
            <br></br>

            <div id="selectPaginador">
              {userData.nomRol === "administrador" ? (
                <Button id="btn" onClick={insertarCursoAlumnoSesion}>
                  Crear Curso Alumnos Sesiones
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
                <label htmlFor="input_CantidadR">Sesiones: </label>
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    setidSesion(target.value);
                    setNumBoton(1);
                  }}
                >
                  <option value="">Todos</option>
                  {listSesion.map((valor) => (
                    <option
                      selected={valor.idSesion === idSesion ? "selected" : ""}
                      value={valor.idSesion}
                    >
                      {valor.nomSesion}
                    </option>
                  ))}
                </select>
              </div>
              {userData.nomRol === "administrador" ||
              userData.nomRol === "gerencia" ||
              userData.nomRol === "people" ||
              userData.nomRol === "relator" ? (
                <div className="form-group" id="btn2">
                  <label htmlFor="input_CantidadR">Alumno: </label>
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
            <InsertarCursoAlumnoSesion
              isActiveCursoAlumnoSesion={isActiveInsertCursoAlumnoSesion}
              cambiarEstado={setIsActiveInsertCursoAlumnoSesion}
              cursoAlumnoSesion={cursoAlumnoSesion}
            ></InsertarCursoAlumnoSesion>

            <EditarCursoAlumnoSesion
              isActiveEditCursoAlumnoSesion={isActiveEditCursoAlumnoSesion}
              cambiarEstado={setIsActiveEditCursoAlumnoSesion}
              idCursoAlumnoSesion={idCursoAlumnoSesion}
              setCursoAlumnoSesion={setCursoAlumnoSesion}
              cursoAlumnoSesion={cursoAlumnoSesion}
              nombreTabla={nombreTabla}
            ></EditarCursoAlumnoSesion>

            <Table id="mainTable" hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sesión</th>
                  <th>Alumno</th>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>Hora inicio</th>
                  <th>Hora fin</th>
                  <th>%Asist</th>
                  <th>%Partic</th>
                  {userData.nomRol === "administrador" ||
                  userData.nomRol === "relator" ? (
                    <th>Operaciones</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {cursoAlumnoSesion.map((cursoAlumnoSesion) => (
                  <tr key={cursoAlumnoSesion.idCursoAlumnoRamoSesion}>
                    <td align="right" width={30}>
                      {cursoAlumnoSesion.idCursoAlumnoRamoSesion}
                    </td>
                    <td>{cursoAlumnoSesion.nomSesion}</td>
                    <td>{cursoAlumnoSesion.nomEmpleado}</td>
                    <td>{cursoAlumnoSesion.fechaIni}</td>
                    <td>{cursoAlumnoSesion.fechaFin}</td>
                    <td>{cursoAlumnoSesion.horaIni}</td>
                    <td>{cursoAlumnoSesion.horaFin}</td>
                    <td align="right" width={30}>
                      {cursoAlumnoSesion.asistencia}
                    </td>
                    <td align="right" width={30}>
                      {cursoAlumnoSesion.participacion}
                    </td>
                    {userData.nomRol === "administrador" ||
                    userData.nomRol === "relator" ? (
                      <td>
                        <button
                          data-title="Editar cursoAlumnoSesion"
                          id="OperationBtns"
                          onClick={() =>
                            editarCursoAlumnoSesion(
                              cursoAlumnoSesion.idCursoAlumnoRamoSesion
                            )
                          }
                        >
                          <RiEditBoxFill id="icons" />
                        </button>
                        {/* <button data-title="Examinar cursoAlumnoSesion" id="OperationBtns">
                      <HiEye id="icons" />
                    </button> */}
                        <button
                          data-title="Desactivar cursoAlumnoSesion"
                          onClick={() =>
                            desactivar(
                              cursoAlumnoSesion.idCursoAlumnoRamoSesion
                            )
                          }
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
