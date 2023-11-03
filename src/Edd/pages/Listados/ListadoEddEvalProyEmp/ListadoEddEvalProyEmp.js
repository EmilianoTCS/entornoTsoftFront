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

import { MdDashboard } from "react-icons/md";
import { SiSubstack } from "react-icons/si";
import { FaComments } from "react-icons/fa";
import { BiSolidSend } from "react-icons/bi";


import "../TablasStyles.css";
import InsertarEDDEvalProyEmp from "../../templates/form/Insertar/InsertarEddEvalProyEmp";
import EnviarCorreo from "./EnviarCorreo";
import EnviarCorreoColab from "./EnviarCorreoColab";
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
  const [isActiveInsertEDDEnviarCorreo, setIsActiveInsertEDDEnviarCorreo] =
    useState(false);
  const [isActiveInsertEDDEnviarCorreoColab, setIsActiveInsertEDDEnviarCorreoColab] =
    useState(false);
  const [idEDDEvalProyEmp, setidEDDEvalProyEmp] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "eddevalproyemp";

  const [idEDDEvaluacion, setidEDDEvaluacion] = useState('');

  const [idEvaluado, setidEvaluado] = useState('');
  const [idEvaluador, setidEvaluador] = useState('');

  const [idProyecto, setidProyecto] = useState(params.idProyecto);
  const [listProyecto, setlistProyecto] = useState([""]);

  const [listEvaluadores, setlistEvaluadores] = useState('');
  const [listEvaluados, setlistEvaluados] = useState('');

  const [cicloEvaluacion, setcicloEvaluacion] = useState('');
  const [listcicloEvaluacion, setlistcicloEvaluacion] = useState([""]);

  const [loadedData, setloadedData] = useState(false);

  // const [listEDDProyEmpEvaluador, setlistEDDProyEmpEvaluador] = useState([""]);
  // const [listEDDProyEmpEvaluado, setlistEDDProyEmpEvaluado] = useState([""]);
  // const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);

  // function obtenerProyecto() {
  //   const url = "pages/auxiliares/listadoProyectoForms.php";
  //   const operationUrl = "listados";
  //   getDataService(url, operationUrl).then((response) =>
  //     setlistProyecto(response)
  //   );
  // }


  function obtenerCicloEvaluacion() {
    const url = "pages/auxiliares/listadoCiclosEval.php";
    const operationUrl = "listados";
    var data = {
      idProyecto: '',
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setlistcicloEvaluacion(data);
    });
  }


  function obtenerProyecto() {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    var data = {
      idServicio: '',
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setlistProyecto(data);
    });
  }

  function obtenerEvaluadorEvaluado() {
    const url = "pages/auxiliares/listadoEvaluadoresEvaluados.php";
    const operationUrl = "listadoEvaluadoresEvaluados";
    getDataService(url, operationUrl).then((response) => {
      // console.log(response);
      const { evaluadores, evaluados } = response
      setlistEvaluadores(evaluadores)
      setlistEvaluados(evaluados)
      setloadedData(true)
    }
    );
  }

  function enviarCorreo() {
    setIsActiveInsertEDDEnviarCorreo(!isActiveInsertEDDEnviarCorreo);
  }

  function enviarCorreoColab() {
    setIsActiveInsertEDDEnviarCorreoColab(!isActiveInsertEDDEnviarCorreoColab);
  }


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
      obtenerEvaluadorEvaluado();
      obtenerProyecto();
      obtenerCicloEvaluacion();
    },
    [
      num_boton,
      cantidadPorPagina,
      idProyecto,
      idEvaluado,
      idEvaluador,
      cicloEvaluacion,
      loadedData
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
        idEDDProyEmpEvaluado: idEvaluado,
        idEDDEvaluacion: idEDDEvaluacion,
        idProyecto: idProyecto,
        cicloEvaluacion: cicloEvaluacion,
      }
    } else
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idEDDProyEmpEvaluado: idEvaluado,
        idEDDProyEmpEvaluador: idEvaluador,
        idEDDEvaluacion: idEDDEvaluacion,
        idProyecto: idProyecto,
        cicloEvaluacion: cicloEvaluacion,
      };
    // console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      // console.log(data);
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEDDEvalProyEmp(datos.datos);
      console.log(data);
      console.log(userData.idEmpleado);
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


          <table>
            <tr> <td><Button id="btn" onClick={insertarEDDEvalProyEmp}>
              Asociar evaluación al proyecto - colaborador
            </Button>
            </td>

              <td style={{ width: '12em' }}>
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

              </td>

              <td>
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
                    {

                      listProyecto.map((valor) => (
                        <option
                          selected={(valor.idEDDProyecto === idProyecto ? "selected" : "")}
                          value={valor.idEDDProyecto}
                        >
                          {valor.nomProyecto}
                        </option>
                      ))}
                  </select>
                </div>
              </td>

              <td>
                <div className="form-group" id="btn2">
                  <label htmlFor="input_CantidadR">Evaluador: </label>
                  <select
                    required
                    type="text"
                    className="form-control"
                    onChange={({ target }) => {
                      setidEvaluador(target.value); setNumBoton(1);

                    }}
                  >
                    <option value="0">Todos</option>
                    {
                      loadedData ?
                        listEvaluadores.map((valor) => (
                          <option
                            selected={(valor.idEDDProyEmpEvaluador === idEvaluador ? "selected" : "")}
                            value={valor.idEDDProyEmpEvaluador}
                          >
                            {valor.nomEmpleado}
                          </option>
                        )) : <></>}
                  </select>
                </div>
              </td>

              <td>
                <div className="form-group" id="btn2">
                  <label htmlFor="input_CantidadR">Evaluado: </label>
                  <select
                    required
                    type="text"
                    className="form-control"
                    onChange={({ target }) => {
                      setidEvaluado(target.value); setNumBoton(1);

                    }}
                  >
                    <option value="0">Todos</option>
                    {loadedData ?
                      listEvaluados.map((valor) => (
                        <option
                          selected={(valor.idEDDProyEmpEvaluado === idEvaluado ? "selected" : "")}
                          value={valor.idEDDProyEmpEvaluado}
                        >
                          {valor.nomEmpleado}
                        </option>
                      )) : <></>}
                  </select>
                </div>
              </td>
              <td>
              <div className="form-group" id="btn2">
                <label htmlFor="Ciclo">Ciclo de evaluación: </label>
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    setcicloEvaluacion(target.value); setNumBoton(1);
                  }}
                >
                  <option value="0">Todos</option>
                  {
                    listcicloEvaluacion.map((valor) => (
                      <option
                        value={valor.cicloEvaluacion}
                      >
                        {valor.cicloEvaluacion}
                      </option>
                    ))}
                </select>
              </div>
            </td>
            </tr>

          </table>


          <EnviarCorreo
            isActiveEDDEnviarCorreo={isActiveInsertEDDEnviarCorreo}
            cambiarEstado={setIsActiveInsertEDDEnviarCorreo}
          // EDDEnviarCorreo={EDDEnviarCorreo}
          ></EnviarCorreo>

          <EnviarCorreoColab
            isActiveEDDEnviarCorreoColab={isActiveInsertEDDEnviarCorreoColab}
            cambiarEstado={setIsActiveInsertEDDEnviarCorreoColab}
          // EDDEnviarCorreoColab={EDDEnviarCorreoColab}
          ></EnviarCorreoColab>

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
                {/* <th colSpan={2}>Fecha vigencia eval</th>
                <th>Disp eval</th> */}
                <th>Proyecto</th>

                <th>Evaluador</th>
                <th>Cargo</th>
                <th>Evaluado</th>

                <th >Resp</th>
                <th >Ciclo eval</th>

                <th>Fecha respuesta eval</th>
                {/* <th>Total min</th> */}

                <th >Fecha fin vigencia ref</th>


                <th>Correo enviado ref</th>
                <th >Fecha fin vigencia col</th>

                <th>Correo enviado col</th>

                <th>

                  <table>
                    <tr>
                      <td ><button data-title="Envío correo con formulario evaluaciones a referentes" type="button" class="btn-Other" onClick={enviarCorreo}>Envío Eval Ref</button>
                      </td>

                    </tr><tr><td>
                      <button data-title="Envío correo con formulario evaluaciones a colaboradores" type="button" class="btn-Other" onClick={enviarCorreoColab}>Envío Eval Col</button>
                    </td></tr>
                  </table>

                  Operaciones</th>

              </tr>
            </thead>
            <tbody>
              {EDDEvalProyEmp.map((EDDEvalProyEmp) => (

                // (userData.nomRol === 'alumno' && userData.nomEmpleado === EDDEvalProyEmp.nomEmpleadoEvaluador ? (
                <tr key={EDDEvalProyEmp.idEDDEvalProyEmp}>
                  <td>{EDDEvalProyEmp.idEDDEvalProyEmp}</td>
                  <td>{EDDEvalProyEmp.nomEvaluacion}</td>
                  {/* <td width={5}>{EDDEvalProyEmp.fechaInicioPeriodoEvaluacion}</td>
                  <td width={5}>{EDDEvalProyEmp.fechaFinPeriodoEvaluacion}</td>
                  <td>{EDDEvalProyEmp.disponibilidadEvaluacion === '1' ? (
                    <td>DISPONIBLE</td>
                  ) : (
                    <td>NO DISPONIBLE</td>
                  )}
                  </td> */}
                  <td>{EDDEvalProyEmp.nomProyecto}</td>

                  <td >{EDDEvalProyEmp.nomEmpleadoEvaluador}</td>
                  <td>{EDDEvalProyEmp.cargoEnProy === 'COLABORADOR' ? (
                    <td>COLAB</td>
                  ) : (
                    <td>REF</td>
                  )}</td>

                  <td>{EDDEvalProyEmp.nomEmpleadoEvaluado}</td>

                  <td>{EDDEvalProyEmp.evalRespondida}</td>
                  <td>{EDDEvalProyEmp.cicloEvaluacion}</td>




                  <td width={5} >{EDDEvalProyEmp.evalRespondida === 'NO' ? (
                    <p style={{ color: 'white' }}></p>
                  ) : (
                    <div href="#" class="tip" style={{ textDecoration: 'underline', color: 'black' }}>{EDDEvalProyEmp.fechaIni}<span>{' Fecha inicio: ' + EDDEvalProyEmp.fechaIni + ' Fecha fin: ' + EDDEvalProyEmp.fechaFin + ' Total minutos: ' + EDDEvalProyEmp.tiempoTotalEnMin}
                    </span></div>


                  )}

                  </td>



                  {/* <td width={5}>{EDDEvalProyEmp.evalRespondida === 'NO' ? (
                    <p style={{ color: 'white' }}></p>
                  ) : (
                    EDDEvalProyEmp.fechaIni

                  )}
                  </td>
                  <td width={5}>
                    {EDDEvalProyEmp.evalRespondida === 'NO' ? (
                      <p style={{ color: 'white' }}></p>
                    ) : (
                      EDDEvalProyEmp.fechaFin
                    )}
                  </td> */}
                  {/* <td width={5}>
                    {EDDEvalProyEmp.evalRespondida === 'NO' ? (
                      <p style={{ color: 'white' }}></p>
                    ) : (
                      EDDEvalProyEmp.tiempoTotalEnMin
                    )}
                  </td> */}

                  <td>
                    {EDDEvalProyEmp.fechaIniVigenciaEvalRef &&
                      EDDEvalProyEmp.fechaIniVigenciaEvalRef.split(' ').map((part, index) => {
                        if (index === 0) {
                          var [dia, mes, anio] = part.split('/'); // Suponiendo que la fecha está en formato 'dd/mm/yyyy'

                          // Convierte el día, mes y año a números
                          var diaNumero = Number(dia);
                          var mesNumero = Number(mes);
                          var anioNumero = Number(anio);

                          // Suma los días de vigencia
                          diaNumero += Number(EDDEvalProyEmp.diasVigenciaEvalRef);

                          // Comprueba si se superó el último día del mes
                          if (diaNumero > 31) { // Supongo el valor máximo de días en un mes es 31, puedes ajustarlo según tus necesidades
                            diaNumero -= 31; // Resta 31 para obtener el día correcto
                            mesNumero++; // Aumenta el mes en 1

                            // Comprueba si se superó el último mes del año
                            if (mesNumero > 12) {
                              mesNumero -= 12; // Resta 12 para obtener el mes correcto
                              anioNumero++; // Aumenta el año en 1
                            }
                          }

                          // Formatea la nueva fecha
                          return `${diaNumero}/${mesNumero}/${anioNumero}`;
                        } else {
                          return part;
                        }
                      }).join(' ')
                    }
                  </td>

                  <td>{EDDEvalProyEmp.CorreoLinkEnviadoRef}</td>

                  <td>
                    {EDDEvalProyEmp.fechaIniVigenciaEvalColab &&
                      EDDEvalProyEmp.fechaIniVigenciaEvalColab.split(' ').map((part, index) => {
                        if (index === 0) {
                          var [dia, mes, anio] = part.split('/'); // Suponiendo que la fecha está en formato 'dd/mm/yyyy'

                          // Convierte el día, mes y año a números
                          var diaNumero = Number(dia);
                          var mesNumero = Number(mes);
                          var anioNumero = Number(anio);

                          // Suma los días de vigencia
                          diaNumero += Number(EDDEvalProyEmp.diasVigenciaEvalRefColab);

                          // Comprueba si se superó el último día del mes
                          if (diaNumero > 31) { // Supongo el valor máximo de días en un mes es 31, puedes ajustarlo según tus necesidades
                            diaNumero -= 31; // Resta 31 para obtener el día correcto
                            mesNumero++; // Aumenta el mes en 1

                            // Comprueba si se superó el último mes del año
                            if (mesNumero > 12) {
                              mesNumero -= 12; // Resta 12 para obtener el mes correcto
                              anioNumero++; // Aumenta el año en 1
                            }
                          }

                          // Formatea la nueva fecha
                          return `${diaNumero}/${mesNumero}/${anioNumero}`;
                        } else {
                          return part;
                        }
                      }).join(' ')
                    }
                  </td>




                  <td>{EDDEvalProyEmp.CorreoLinkEnviadoColab}</td>

                  <td align="center">
                    {EDDEvalProyEmp.evalRespondida !== 'SÍ' && EDDEvalProyEmp.CorreoLinkEnviadoRef !== 'SÍ' && EDDEvalProyEmp.CorreoLinkEnviadoColab !== 'SÍ' ?
                      (
                        <button
                          data-title="Editar evaluación de proyecto - colaborador"
                          id="OperationBtns"
                          onClick={() =>
                            editarEDDEvalProyEmp(EDDEvalProyEmp.idEDDEvalProyEmp)
                          }
                        >
                          <RiEditBoxFill id="icons" />
                        </button>
                      ) : (
                        <button
                          disabled
                          data-title="Editar evaluación de proyecto - colaborador"
                          id="OperationBtns"
                          onClick={() =>
                            editarEDDEvalProyEmp(EDDEvalProyEmp.idEDDEvalProyEmp
                            )
                          }
                        >
                          <RiEditBoxFill id="icons" />
                        </button>)}


                    {userData.nomRol === "administrador" || "people" ? (
                      EDDEvalProyEmp.evalRespondida === 'NO' ? (


                        <Link to={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' ? `/listadoRespPregEvaluaciones/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.idEDDProyEmpEvaluado}/${EDDEvalProyEmp.idEDDProyEmpEvaluador}/${EDDEvalProyEmp.cicloEvaluacion}` : ''}>
                          <button data-title="Evaluacion relacionada" id="OperationBtns" disabled={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' && EDDEvalProyEmp.disponibilidadEvaluacion === '1' ? false : true}>
                            <AiFillBook id="icons" />
                          </button>
                        </Link>
                      ) : (
                        <Link to={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' ? `/listadoEvalResp/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.idEDDProyEmpEvaluado}/${EDDEvalProyEmp.idEDDProyEmpEvaluador}/${EDDEvalProyEmp.cicloEvaluacion}` : ''}>
                          <button data-title="Evaluacion relacionada" id="OperationBtns" >
                            <AiFillBook id="icons" />
                          </button>
                        </Link>
                      )

                    ) : (
                      EDDEvalProyEmp.evalRespondida === 'NO' ? (


                        <Link to={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' ? `/listadoRespPregEvaluaciones/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.idEDDProyEmpEvaluado}/${userData.idEmpleado}/${EDDEvalProyEmp.cicloEvaluacion}` : ''}>
                          <button data-title="Evaluacion relacionada" id="OperationBtns" disabled={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' && EDDEvalProyEmp.disponibilidadEvaluacion === '1' ? false : true}>
                            <AiFillBook id="icons" />
                          </button>
                        </Link>
                      ) : (
                        <Link to={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' ? `/listadoEvalResp/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.idEDDProyEmpEvaluado}/${userData.idEmpleado}/${EDDEvalProyEmp.cicloEvaluacion}` : ''}>
                          <button data-title="Evaluacion relacionada" id="OperationBtns" disabled={EDDEvalProyEmp.nomEvaluacion !== 'empty / vacio' && EDDEvalProyEmp.disponibilidadEvaluacion === '1' ? false : true}>
                            <AiFillBook id="icons" />
                          </button>
                        </Link>
                      )
                    )
                    }


                    {EDDEvalProyEmp.cargoEnProy !== 'REFERENTE' ? (

                      EDDEvalProyEmp.evalRespondida === 'SÍ' ? (
                        <Link to={`/homePageEDD/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.nomEvaluacion}/${EDDEvalProyEmp.idEDDProyecto}/${EDDEvalProyEmp.cicloEvaluacion}`}>
                          <button data-title="Información referentes" id="OperationBtns">
                            <MdDashboard id="icons" />
                          </button>
                        </Link>
                      ) : (
                        <Link to={`/homePageEDD/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.nomEvaluacion}/${EDDEvalProyEmp.idEDDProyecto}/${EDDEvalProyEmp.cicloEvaluacion}`}>
                          <button data-title="Información referentes" id="OperationBtns" disabled>
                            <MdDashboard id="icons" />
                          </button>
                        </Link>
                      )


                    ) : (
                      EDDEvalProyEmp.evalRespondida === 'SÍ' ? (
                        <Link to={`/GraficosDashboard/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.nomEvaluacion}/${EDDEvalProyEmp.idEDDProyecto}/${EDDEvalProyEmp.cicloEvaluacion}`}>
                          <button data-title="Información colaboradores" id="OperationBtns">
                            <MdDashboard id="icons" />
                          </button>
                        </Link>
                      ) : (
                        <Link to={`/GraficosDashboard/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.nomEvaluacion}/${EDDEvalProyEmp.idEDDProyecto}/${EDDEvalProyEmp.cicloEvaluacion}`}>
                          <button data-title="Información colaboradores" id="OperationBtns" disabled>
                            <MdDashboard id="icons" />
                          </button>
                        </Link>
                      )

                    )
                    }



                    {EDDEvalProyEmp.evalRespondida === 'SÍ' ? (
                      <Link to={`/ComentariosDashboard/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.nomEvaluacion}/${EDDEvalProyEmp.idEDDProyecto}/${EDDEvalProyEmp.cicloEvaluacion}`}>
                        <button data-title="Comentarios" id="OperationBtns">
                          <FaComments id="icons" />
                        </button>
                      </Link>
                    ) : (
                      <Link to={`/ComentariosDashboard/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.nomEvaluacion}/${EDDEvalProyEmp.idEDDProyecto}/${EDDEvalProyEmp.cicloEvaluacion}`}>
                        <button data-title="Comentarios" id="OperationBtns" disabled>
                          <FaComments id="icons" />
                        </button>
                      </Link>
                    )}


                    {EDDEvalProyEmp.evalRespondida === 'SÍ' ? (
                      <Link to={`/AlertasOporDes/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.nomEvaluacion}/${EDDEvalProyEmp.tipoEvaluacion}/${EDDEvalProyEmp.idEDDProyecto}/${EDDEvalProyEmp.cicloEvaluacion}`}>
                        <button data-title="Desempeño" id="OperationBtns">
                          <SiSubstack id="icons" />
                        </button>
                      </Link>
                    ) : (
                      <Link to={`/AlertasOporDes/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.nomEvaluacion}/${EDDEvalProyEmp.tipoEvaluacion}/${EDDEvalProyEmp.idEDDProyecto}/${EDDEvalProyEmp.cicloEvaluacion}`}>
                        <button data-title="Desempeño" id="OperationBtns" disabled>
                          <SiSubstack id="icons" />
                        </button>
                      </Link>
                    )}







                    {/* <Link to={`/AlertasOporDes/${EDDEvalProyEmp.idEDDEvaluacion}/${EDDEvalProyEmp.nomEvaluacion}/${EDDEvalProyEmp.tipoEvaluacion}/${EDDEvalProyEmp.idEDDProyecto}`}>
                      <button data-title="Desempeño" id="OperationBtns">
                        <BiSolidSend id="icons" />
                      </button>
                    </Link> */}

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
      </div >
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
