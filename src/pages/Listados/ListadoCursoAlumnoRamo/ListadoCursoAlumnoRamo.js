import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import "../TablasStyles.css";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";
import SendDataService from "../../../services/SendDataService";
// import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Header from "../../../templates/Header/Header";
import { Table, Button } from "react-bootstrap";
import Paginador from "../../../templates/Paginador/Paginador";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { ImBook } from "react-icons/im";
import { useRoute } from "wouter";
import InsertarCursoAlumnoRamo from "../../../templates/forms/Insertar/InsertarCursoAlumnoRamo";
import EditarCursoAlumnoRamo from "../../../templates/forms/Editar/EditarCursoAlumnoRamo";
import getDataService from "../../../services/GetDataService";

export default function ListadoCursoAlumnoRamo() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [num_boton, setNumBoton] = useState(1);
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [datosRamo, setDatosRamo] = useState();

  const [, params] = useRoute("/listadoCursoAlumnoRamo/:params");
  const [idCurso, setIDCurso] = useState(params.params);
  const [idEmpleado, setIDEmpleado] = useState(0);

  const [isActiveFormularioInsertar, setIsActiveFormularioInsertar] =
    useState(false);

  const [isActiveFormularioEditar, setIsActiveFormularioEditar] =
    useState(false);

  const [datosCursoAlumnoRamo, setDatosCursoAlumnoRamo] = useState();
  const [listCursos, setListCursos] = useState([]);
  const [listEmpleados, setListEmpleados] = useState([]);

  function obtenerCurso() {
    const url = "pages/auxiliares/listadoCursoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setListCursos(response)
    );
  }

  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setListEmpleados(response)
    );
  }
  function ObtenerDatos() {
    var url = "pages/listados/listadoCursoAlumnoRamo.php";
    var operationUrl = "listadoCursoAlumnoRamo";
    if (userData.nomRol === "alumno") {
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idCurso: idCurso,
        idEmpleado: userData.idEmpleado,
      };
    } else {
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idCurso: idCurso,
        idEmpleado: idEmpleado,
      };
    }
    console.log(data);

    SendDataService(url, operationUrl, data).then((response) => {
      const { paginador, ...datos } = response;
      setCantidadPaginas(paginador.cantPaginas);
      setDatosRamo(datos.datos);
    });
  }

  function editarCursoAlumnoRamo(item) {
    setDatosCursoAlumnoRamo(item);
    setIsActiveFormularioEditar(true);
  }
  useEffect(() => {
    ObtenerDatos();
    obtenerCurso();
    obtenerEmpleado();
  }, [num_boton, cantidadPorPagina, idEmpleado, idCurso]);

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

        <InsertarCursoAlumnoRamo
          cambiarEstado={setIsActiveFormularioInsertar}
          isActiveCursoAlumno={isActiveFormularioInsertar}
        />

        {isActiveFormularioEditar && (
          <EditarCursoAlumnoRamo
            cambiarEstado={setIsActiveFormularioEditar}
            cursoAlumnoRamo={datosCursoAlumnoRamo}
            isActiveCursoAlumno={isActiveFormularioEditar}
          />
        )}
        <div id="fondoTabla">
          <div id="containerTablas">
            <h1 id="TitlesPages">Listado de Cursos Alumnos Ramos</h1>
            <h6 style={{ color: "gray" }}>
              Factory Devops {"->"} Listado de Cursos Alumnos Ramos
            </h6>
            <br></br>

            <div id="selectPaginador">
              {userData.nomRol === "administrador" ? (
                <Button
                  id="btn"
                  onClick={() => {
                    setIsActiveFormularioInsertar(true);
                  }}
                >
                  Crear Curso Alumnos Ramo
                </Button>
              ) : null}
              {/* cursos */}
              <div className="form-group" id="btn2">
                <label htmlFor="input_CantidadR">Cursos: </label>
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    setIDCurso(target.value);
                    setNumBoton(1);
                  }}
                >
                  <option hidden value="" selected>
                    Desplegar lista
                  </option>
                  <option value="">Todos</option>
                  {listCursos.map((valor) => (
                    <option
                      selected={valor.idCurso === idCurso ? "selected" : ""}
                      value={valor.idCurso}
                    >
                      {valor.nomCurso}
                    </option>
                  ))}
                </select>
              </div>
              {/* empleados */}
              <div>
                <label htmlFor="input_NomA">Nombre alumno:</label>

                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => setIDEmpleado(target.value)}
                >
                  <option hidden value="">
                    Desplegar lista
                  </option>
                  <option value="0">
                   Todos
                  </option>

                  {listEmpleados.map((valor) => (
                    <option value={valor.idEmpleado}>
                      {valor.nomEmpleado}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Table id="mainTable" hover responsive>
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Ramo</th>
                  <th>Alumno</th>
                  <th>Fecha ini</th>
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
                {datosRamo &&
                  datosRamo.map((item) => (
                    <tr key={item.idCursoAlumnoRamo}>
                      <td>{item.nomCurso}</td>
                      <td>{item.nomRamo}</td>
                      <td>{item.nomEmpleado}</td>
                      <td width={120}>{item.fechaIni}</td>
                      <td>{item.fechaFin}</td>

                      <td align="right">{item.porcAsistencia}</td>
                      <td align="right">{item.porcParticipacion}</td>
                      <td align="right">{item.porcAprobacion}</td>
                      <td>{item.ramoAprobado}</td>
                      <td>{item.estadoRamo}</td>
                      <td>
                        {userData.nomRol === "administrador" ? (
                          <button
                            data-title="Editar item"
                            id="OperationBtns"
                            onClick={() => editarCursoAlumnoRamo(item)}
                          >
                            <RiEditBoxFill id="icons" />
                          </button>
                        ) : null}

                        <Link
                          to={`/listadoCursoAlumnoRamoSesion/${item.idCursoAlumnoRamo}`}
                        >
                          <button
                            data-title="Curso-Alum-Sesion relacionado"
                            id="OperationBtns"
                          >
                            <ImBook id="icons" />
                          </button>
                        </Link>
                        {userData.nomRol === "administrador" ? (
                          <button
                            data-title="Desactivar item"
                            onClick={() => desactivar(item.idCursoAlumnoRamo)}
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
            {/* <Paginador
              paginas={cantidadPaginas}
              cambiarNumero={setNumBoton}
              num_boton={num_boton}
            ></Paginador> */}
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
