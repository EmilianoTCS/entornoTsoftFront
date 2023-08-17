import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillKeyFill, BsFillTrashFill } from "react-icons/bs";
import { AiFillBook } from "react-icons/ai";

import "../TablasStyles.css";
import InsertarEDDEvalProyEmp from "../../templates/form/Insertar/InsertarEddEvalProyEmp";
import EditarEddEvalProyEmp from "../../templates/form/Editar/EditarEddEvalProyEmp";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoEDDEvalProyEmp() {
  const [, params] = useRoute("/listadoEDDEvalProyEmp/:idProyecto");

  const [EDDEvalProyEmp, setEDDEvalProyEmp] = useState([""]);
  const [isActiveInsertEDDEvalProyEmp, setIsActiveInsertEDDEvalProyEmp] =
    useState(false);
  const [isActiveEditEDDEvalProyEmp, setIsActiveEditEDDEvalProyEmp] =
    useState(false);
  const [idEDDEvalProyEmp, setidEDDEvalProyEmp] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "eddevalproyemp";

  const [idEDDEvaluacion, setidEDDEvaluacion] = useState('');
  const [idEDDProyEmpEvaluador, setidEDDProyEmpEvaluador] = useState(
    ''
  );

  const [idProyecto, setidProyecto] = useState(params.idProyecto);

  const [listProyecto, setlistProyecto] = useState([""]);
  const [idEDDProyEmpEvaluado, setidEDDProyEmpEvaluado] = useState(
    ''
  );

  // const [listEDDProyEmpEvaluador, setlistEDDProyEmpEvaluador] = useState([""]);
  // const [listEDDProyEmpEvaluado, setlistEDDProyEmpEvaluado] = useState([""]);
  // const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);

  function obtenerProyecto() {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistProyecto(response)
    );
  }

  // function obtenerEvaluacion() {
  //   const url = "pages/auxiliares/listadoEddEvaluacion.php";
  //   const operationUrl = "listados";
  //   getDataService(url, operationUrl).then((response) =>
  //     setlistEDDEvaluacion(response)
  //   );
  // }
  // function obtenerEvaluado() {
  //   const url = "pages/auxiliares/listadoEddEvalProyEmp.php";
  //   const operationUrl = "listados";
  //   getDataService(url, operationUrl).then((response) =>
  //     setlistEDDProyEmpEvaluador(response)
  //   );
  // }

  // function obtenerEvaluador() {
  //   const url = "pages/auxiliares/listadoEddEvalProyEmp.php";
  //   const operationUrl = "listados";
  //   getDataService(url, operationUrl).then((response) =>
  //     setlistEDDProyEmpEvaluado(response)
  //   );
  // }

  function insertarEDDEvalProyEmp() {
    setIsActiveInsertEDDEvalProyEmp(!isActiveInsertEDDEvalProyEmp);
  }
  function editarEDDEvalProyEmp(ID) {
    setIsActiveEditEDDEvalProyEmp(!isActiveEditEDDEvalProyEmp);
    setidEDDEvalProyEmp(ID);
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
      // obtenerEvaluacion();
      // obtenerEvaluador();
      // obtenerEvaluado();
      obtenerProyecto();
    },
    [
      num_boton,
      cantidadPorPagina,
      // idEDDEvaluacion,
      // idEDDProyEmpEvaluador,
      // idEDDProyEmpEvaluado,
      idProyecto,
    ]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoEddEvalProyEmp.php";
    var operationUrl = "listadoEddEvalProyEmp";

    if (userData.nomRol === 'alumno') {
      var data = {
        idEDDProyEmpEvaluador: userData.idEmpleado,
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idEDDProyEmpEvaluado: idEDDProyEmpEvaluado,
        idEDDEvaluacion: idEDDEvaluacion,
        idProyecto: idProyecto,
      }
    } else
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idEDDProyEmpEvaluado: idEDDProyEmpEvaluado,
        idEDDProyEmpEvaluador: idEDDProyEmpEvaluador,
        idEDDEvaluacion: idEDDEvaluacion,
        idProyecto, idProyecto,
      };
    // console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEDDEvalProyEmp(datos.datos);
      // console.log(data);
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
            href="/ListadoEddProyEmp/0">Volver
          </a>

          <h1 id="TitlesPages">
            Listado de evaluaciones asociadas al proyecto-colaborador
          </h1>
          <h6 style={{ color: "gray" }}>
            EDD {"->"} Listado de evaluaciones asociadas al proyecto-colaborador
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarEDDEvalProyEmp}>
              Asociar evaluación al proyecto - colaborador
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
            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadR">Proyecto: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidProyecto(target.value); setNumBoton(1);
                  history.pushState(null, null, `/listadoEDDEvalProyEmp/${target.value}`);
                }}
              >
                <option value="0">Todos</option>
                {listProyecto.map((valor) => (
                  <option
                    selected={(valor.idEDDProyecto === idProyecto ? "selected" : "")}
                    value={valor.idEDDProyecto}
                  >
                    {valor.nomProyecto}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InsertarEDDEvalProyEmp
            isActiveEDDEvalProyEmp={isActiveInsertEDDEvalProyEmp}
            cambiarEstado={setIsActiveInsertEDDEvalProyEmp}
            EDDEvalProyEmp={EDDEvalProyEmp}
          ></InsertarEDDEvalProyEmp>

          <EditarEddEvalProyEmp
            isActiveEditEDDEvalProyEmp={isActiveEditEDDEvalProyEmp}
            cambiarEstado={setIsActiveEditEDDEvalProyEmp}
            idEDDEvalProyEmp={idEDDEvalProyEmp}
            setEDDEvalProyEmp={setEDDEvalProyEmp}
            EDDEvalProyEmp={EDDEvalProyEmp}
            nombreTabla={nombreTabla}
          ></EditarEddEvalProyEmp>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Evaluación</th>
                <th colSpan={2}>Fecha vigencia eval</th>
                <th>Disp eval</th>
                <th>Proyecto</th>

                <th>Evaluador</th>
                <th>Evaluado</th>

                <th>Respondida</th>
                <th colSpan={2}>Fecha respuesta eval</th>
                <th>Total min</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {EDDEvalProyEmp.map((EDDEvalProyEmp) => (
                // (userData.nomRol === 'alumno' && userData.nomEmpleado === EDDEvalProyEmp.nomEmpleadoEvaluador ? (
                 <tr key={EDDEvalProyEmp.idEDDEvalProyEmp}>
                  <td>{EDDEvalProyEmp.idEDDEvalProyEmp}</td>
                  <td>{EDDEvalProyEmp.nomEvaluacion}</td>
                  <td>{EDDEvalProyEmp.fechaInicioPeriodoEvaluacion}</td> 
                  <td>{EDDEvalProyEmp.fechaFinPeriodoEvaluacion}</td>
                  <td>
                    {EDDEvalProyEmp.disponibilidadEvaluacion === '1' ? (
                      <td>Disponible</td>
                    ) : (
                      <td>No disponible</td>
                    )}
                  </td>
                  <td>{EDDEvalProyEmp.nomProyecto}</td>

                  <td>{EDDEvalProyEmp.nomEmpleadoEvaluador}</td>
                  <td>{EDDEvalProyEmp.nomEmpleadoEvaluado}</td>

                  <td>{EDDEvalProyEmp.evalRespondida}</td>
                  <td>
                    {EDDEvalProyEmp.evalRespondida === 'NO' ? (
                      <p style={{ color: 'white' }}></p>
                    ) : (
                      EDDEvalProyEmp.fechaIni

                    )}
                  </td><td>
                    {EDDEvalProyEmp.evalRespondida === 'NO' ? (
                      <p style={{ color: 'white' }}></p>
                    ) : (
                      EDDEvalProyEmp.fechaFin
                    )}
                  </td><td>
                    {EDDEvalProyEmp.evalRespondida === 'NO' ? (
                      <p style={{ color: 'white' }}></p>
                    ) : (
                      EDDEvalProyEmp.tiempoTotalEnMin
                    )}
                  </td>

                  <td align="center">
                    <button
                      data-title="Editar evaluación de proyecto - colaborador"
                      id="OperationBtns"
                      onClick={() =>
                        editarEDDEvalProyEmp(EDDEvalProyEmp.idEDDEvalProyEmp)
                      }
                    >
                      <RiEditBoxFill id="icons" />
                    </button>

                    {userData.nomRol === "administrador" || "people" ? (
                      EDDEvalProyEmp.evalRespondida === 'NO' ? (


                        <Link to={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' ? `/listadoRespPregEvaluaciones/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.idEDDProyEmpEvaluado}/${EDDEvalProyEmp.idEDDProyEmpEvaluador}` : ''}>
                          <button data-title="Evaluacion relacionada" id="OperationBtns" disabled={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' && EDDEvalProyEmp.disponibilidadEvaluacion === '1' ? false : true}>
                            <AiFillBook id="icons" />
                          </button>
                        </Link>
                      ) : (
                        <Link to={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' ? `/listadoEvalResp/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.idEDDProyEmpEvaluado}/${EDDEvalProyEmp.idEDDProyEmpEvaluador}` : ''}>
                          <button data-title="Evaluacion relacionada" id="OperationBtns" disabled={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' && EDDEvalProyEmp.disponibilidadEvaluacion === '1' ? false : true}>
                            <AiFillBook id="icons" />
                          </button>
                        </Link>
                      )

                    ) : (
                      EDDEvalProyEmp.evalRespondida === 'NO' ? (


                        <Link to={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' ? `/listadoRespPregEvaluaciones/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.idEDDProyEmpEvaluado}/${userData.idEmpleado}` : ''}>
                          <button data-title="Evaluacion relacionada" id="OperationBtns" disabled={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' && EDDEvalProyEmp.disponibilidadEvaluacion === '1' ? false : true}>
                            <AiFillBook id="icons" />
                          </button>
                        </Link>
                      ) : (
                        <Link to={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' ? `/listadoEvalResp/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.idEDDProyEmpEvaluado}/${userData.idEmpleado}` : ''}>
                          <button data-title="Evaluacion relacionada" id="OperationBtns" disabled={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' && EDDEvalProyEmp.disponibilidadEvaluacion === '1' ? false : true}>
                            <AiFillBook id="icons" />
                          </button>
                        </Link>
                      )
                    )
                    }

                    <button
                      data-title="Desactivar evaluación de proyecto - colaborador"
                      onClick={() =>
                        desactivar(EDDEvalProyEmp.idEDDEvalProyEmp)
                      }
                      id="OperationBtns"
                    >
                      <BsFillTrashFill id="icons" />
                    </button>
                  </td>
                </tr>
                // ) : (<></>))

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
