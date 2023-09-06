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
import InsertarCursoAlumnoSesion from "../../../templates/forms/Insertar/InsertarCursoAlumnoSesion";
import EditarCursoAlumnoSesion from "../../../templates/forms/Editar/EditarCursoAlumnoSesion";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoCursoAlumnoSesion() {
  const [, params] = useRoute("/listadoCursoAlumnoSesion/:params");

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

  const [listSesion, setlistSesion] = useState([""]);

  const nombreTabla = "cursoalumno_sesion";

  function obtenerSesion() {
    const url = "pages/auxiliares/listadoSesionForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistSesion(response)
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
      obtenerSesion();
    },
    [num_boton, cantidadPorPagina, idSesion]
  );

  //PAGINADOR ---------------------
  function handleChangePaginador() {
    var url = "pages/listados/listadoCursoAlumnoSesion.php";
    var operationUrl = "listadoCursoAlumnoSesion";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idSesion: idSesion,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setCursoAlumnoSesion(datos.datos);
      console.log(data);
    });
  }
  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de Cursos Alumnos Sesiones</h1>
          <h6 style={{ color: "gray" }}>
            Factory Devops {"->"} Listado de Cursos s Sesiones
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarCursoAlumnoSesion}>
              Crear Curso Alumnos Sesiones
            </Button>

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
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Hora inicio</th>
                <th>Hora fin</th>
                <th>%Asist</th>
                <th>%Partic</th>
                {/* <th>ID Curso Alumno</th> */}
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {cursoAlumnoSesion.map((cursoAlumnoSesion) => (
                <tr key={cursoAlumnoSesion.idCursoAlumnoSesion}>
                  <td align="right" width={30}>
                    {cursoAlumnoSesion.idCursoAlumnoSesion}
                  </td>
                  <td>{cursoAlumnoSesion.nomSesion}</td>
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

                  {/* <td align="right" width={90}>{cursoAlumnoSesion.idCursoAlumno}</td> */}

                  {/* <td align="right" width={90}>{cursoAlumnoSesion.porcAprobacion}</td> */}

                  <td>
                    <button
                      data-title="Editar cursoAlumnoSesion"
                      id="OperationBtns"
                      onClick={() =>
                        editarCursoAlumnoSesion(
                          cursoAlumnoSesion.idCursoAlumnoSesion
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
                        desactivar(cursoAlumnoSesion.idCursoAlumnoSesion)
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
      </div>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
