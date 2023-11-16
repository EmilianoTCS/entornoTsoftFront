import React, { useState, useEffect, useRef } from "react";
import { Container, Table, Tooltip, OverlayTrigger } from "react-bootstrap";
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
import { FaQuestionCircle } from "react-icons/fa";

import Select from "react-select";

import "../TablasStyles.css";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import "../ListadoCompProy/CompProy.css";
import ExportCSV from "../../../../templates/exports/exportCSV";

export default function ListadoCompProy() {
  // const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  // const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  // const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "listadocompproy";

  const [EDDCompProy, setEDDCompProy] = useState([""]);

  const [tipoComparacion, setTipoComparacion] = useState("");
  const [tipoCargo, setTipoCargo] = useState("");
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [idCliente, setidCliente] = useState("");
  const [listCliente, setlistCliente] = useState([""]);

  const [idProyecto, setidProyecto] = useState("");
  const [listProyecto, setlistProyecto] = useState([""]);

  const [idServicio, setidServicio] = useState("");
  const [listServicio, setlistServicio] = useState([""]);

  const [selectedClients, setSelectedClients] = useState([]);
  const selectedClientsString = selectedClients.join(",");

  const [selectedServicio, setSelectedServicio] = useState([]);
  const selectedServicioString = selectedServicio.join(",");

  const [selectedProyecto, setSelectedProyecto] = useState([]);
  const selectedProyString = selectedProyecto.join(",");

  const [cicloEvaluacion, setcicloEvaluacion] = useState(0);
  const [listcicloEvaluacion, setlistcicloEvaluacion] = useState([""]);

  const [nuevosDatos, setNuevosDatos] = useState([""]);
  const [loadedNuevosDatos, setLodadedNuevosDatos] = useState(false);

  function obtenerCliente() {
    const url = "pages/auxiliares/listadoClienteForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCliente(response)
    );
  }
  function obtenerCicloEvaluacion() {
    const url = "pages/auxiliares/listadoCiclosEval.php";
    const operationUrl = "listados";
    var data = {
      idProyecto: selectedProyString,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      if (Array.isArray(data)) {
        setlistcicloEvaluacion(data);
      } else {
        setlistcicloEvaluacion([]); // Establece listcicloEvaluacion como un arreglo vacío si data no es un arreglo
      }
    });
  }

  function obtenerProyecto() {
    if (selectedServicio.length > 0 && !selectedClients.includes("0")) {
      // Verifica si "Ninguno" está seleccionado
      const url = "pages/auxiliares/listadoProyectoForms.php";
      const operationUrl = "listados";
      var data = {
        idServicio: selectedServicioString,
      };
      SendDataService(url, operationUrl, data).then((data) => {
        setlistProyecto(data);
      });
    } else {
      setlistProyecto([]); // Establece la lista de proyectos en vacío
    }
  }

  function obtenerServicio() {
    if (selectedClients.length > 0) {
      const url = "pages/auxiliares/listadoServicioForms.php";
      const operationUrl = "listados";
      var data = {
        idCliente: selectedClientsString,
      };
      SendDataService(url, operationUrl, data).then((data) => {
        setlistServicio(data);
      });
    }
  }

  // ELIMINAR
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
  // FIN ELIMINAR

  useEffect(() => {
    obtenerCliente();
    obtenerProyecto();
    obtenerServicio();

    if (selectedProyString) {
      // Verifica si se ha seleccionado un proyecto
      obtenerCicloEvaluacion();
    } else {
      // Si no se ha seleccionado un proyecto, establece listcicloEvaluacion como un arreglo vacío
      setlistcicloEvaluacion([]);
    }
  }, [
    selectedClientsString,
    selectedServicioString,
    selectedProyString,
    idProyecto,
    loadedNuevosDatos,
  ]);

  function calcularPromedioCompetenciasPorCiclo(response) {
    const ciclos = {};
    let auxCantRespOK = 0;
    let auxCantResp = 0;
  
    // Iteramos sobre el array original para agrupar valores por ciclo
    response.forEach((item) => {
      const ciclo = item.cicloEvaluacion;
  
      // Si el ciclo no existe, inicializa las variables auxiliares
      if (!ciclos[ciclo]) {
        auxCantRespOK = 0;
        auxCantResp = 0;
        ciclos[ciclo] = {
          cicloEvaluacion: ciclo,
          porcentajeAprob: 0,
          cantRespOK: 0,
          cantResp: 0,
        };
      }
  
      // Acumula cantRespOK y cantResp por cada ciclo
      auxCantRespOK += parseInt(item.cantRespOK);
      auxCantResp += parseInt(item.cantResp);
  
      // Si es el primer registro para el ciclo, copia los valores originales
      if (auxCantResp === parseInt(item.cantResp)) {
        for (const key in item) {
          if (key !== "cicloEvaluacion") {
            ciclos[ciclo][key] = item[key];
          }
        }
      }
  
      // Actualiza las cantidades acumuladas en el objeto del ciclo
      ciclos[ciclo].cantRespOK = auxCantRespOK;
      ciclos[ciclo].cantResp = auxCantResp;
    });
  
    // Calcular el porcentaje de aprobación para cada ciclo
    for (const ciclo in ciclos) {
      const promedioAprob =
        (ciclos[ciclo].cantRespOK * 100) / ciclos[ciclo].cantResp;
      ciclos[ciclo].porcentajeAprob = promedioAprob.toFixed(2);
    }
  
    // Convertir el objeto a un array de objetos
    const result = Object.values(ciclos);
  
    // Actualizar el estado o realizar otras acciones si es necesario
    setNuevosDatos(result);
    setLodadedNuevosDatos(true);
  
    return result;
  }
  

  function SendData(data) {
    var url = "pages/listados/listadoCompetenciasGeneralEval.php";
    var operationUrl = "listadoCompetenciasGeneralEval";
    SendDataService(url, operationUrl, data).then((data) => {
      setEDDCompProy(data);
      setNuevosDatos(calcularPromedioCompetenciasPorCiclo(data));
    });
  }

  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const buscarClick = () => {
    // Validación de fechas
    if (new Date(fechaFin) < new Date(fechaIni)) {
      TopAlerts("FechaFinMayorInicio");
      return;
    }

    // EXPRESION
    if (selectedServicioString === "" && selectedProyString === "") {
    }
    if (
      selectedProyecto.length < 1 ||
      /^,(.*)/.test(selectedProyecto) ||
      /.*,,.*/.test(selectedProyecto) ||
      /[0]/.test(selectedProyecto)
    ) {
      TopAlerts("01", "El proyecto no está seleccionado.");
      return;
    }

    if (!fechaIni || !fechaFin || !tipoComparacion || !tipoCargo) {
      TopAlerts("02", "Uno o más campos se encuentran vacíos o nulos.");
      return; // Salir de la función si los campos no están llenos
    }

    // Resetear la tabla
    setEDDCompProy([]);
    var data = {
      idCliente: selectedClientsString,
      idServicio: selectedServicioString,
      idProyecto: selectedProyString,
      tipoComparacion: tipoComparacion,
      tipoCargo: tipoCargo,
      fechaIni: fechaIni,
      fechaFin: fechaFin,
      cicloEvaluacion: cicloEvaluacion,
    };

    // Después de realizar la búsqueda, establece el estado de busquedaRealizada en true
    setBusquedaRealizada(true);

    SendData(data);
  };

  // Restablecer los valores
  const limpiarClick = () => {
    setcicloEvaluacion(0);
    setSelectedClients([]);
    setSelectedServicio([]);
    setSelectedProyecto([]);
    setidProyecto("0");
    setidServicio("0");
    setTipoComparacion("");
    setTipoCargo("");
    setFechaIni("");
    setFechaFin("");
    setlistServicio([]);
    setEDDCompProy([]); // Esto eliminará los datos de la tabla
    setBusquedaRealizada(true);
  };
  const resetProjects = () => {
    setSelectedProyecto([]);
    setidProyecto("");
  };
  const resetServices = () => {
    setSelectedServicio([]);
  };

  // FINNN Restablecer los valores
  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>

      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <a type="submit" id="btnAtras" value="Registrar" href="/home">
            Volver
          </a>
          <h1 id="TitlesPages">Listado de comparación de proyectos</h1>
          <h6 style={{ color: "gray" }}>
            Eval desempeño {"->"} Comparación de proyectos
          </h6>
          <br></br>

          <table style={{ width: "100%" }}>
            <tr>
              <td style={{ width: "16em" }}>
                <label htmlFor="input_CantidadR">Clientes: </label>
                {/* <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-cliente">{mensajeCtrl}</Tooltip>}>
                                    <span> <FaQuestionCircle id="icons" /></span>
                                </OverlayTrigger> */}
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    const selectedOptions = Array.from(
                      target.selectedOptions,
                      (option) => option.value
                    );

                    if (selectedOptions.includes("todos")) {
                      // Si "Todos" está seleccionado, selecciona todas las demás opciones excepto "Ninguno"
                      setSelectedClients(
                        listCliente
                          .filter((valor) => valor.idCliente !== "0")
                          .map((valor) => valor.idCliente)
                      );
                    } else if (selectedOptions.includes("0")) {
                      // Si "Ninguno" está seleccionado, deselecciona todas las demás opciones
                      setSelectedClients(["0"]);
                    } else {
                      setSelectedClients(selectedOptions);
                    }
                    resetProjects();
                    resetServices();
                  }}
                >
                  <option disabled hidden>
                    Clientes
                  </option>
                  <option value="0">Ninguno</option>
                  {/* <option value="todos">-- Todos --</option> Agrega la opción "Todos" */}
                  {listCliente.map((valor) => (
                    <option
                      selected={
                        selectedClients.includes(valor.idCliente)
                          ? "selected"
                          : ""
                      }
                      value={valor.idCliente}
                    >
                      {valor.nomCliente}
                    </option>
                  ))}
                </select>
              </td>

              <td id="espacioEntreOpciones" style={{ width: "16em" }}>
                <label htmlFor="input_CantidadR">Servicios: </label>
                {/* <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-cliente">{mensajeCtrl}</Tooltip>}>
                                    <span> <FaQuestionCircle id="icons" /></span>
                                </OverlayTrigger> */}
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    const selectedOptions = Array.from(
                      target.selectedOptions,
                      (option) => option.value
                    );

                    if (selectedOptions.includes("todos")) {
                      // Si "Todos" está seleccionado, selecciona todas las demás opciones excepto "Ninguno"
                      setSelectedServicio(
                        listServicio
                          .filter((valor) => valor.idServicio !== "0")
                          .map((valor) => valor.idServicio)
                      );
                    } else if (selectedOptions.includes("0")) {
                      // Si "Ninguno" está seleccionado, deselecciona todas las demás opciones
                      setSelectedServicio(["0"]);
                    } else {
                      setSelectedServicio(selectedOptions);
                    }
                    resetProjects();
                  }}
                >
                  <option disabled hidden>
                    Servicios
                  </option>
                  <option value="0">Ninguno</option>
                  {/* <option value="todos">-- Todos --</option> Agrega la opción "Todos" */}
                  {listServicio.map((valor) => (
                    <option
                      selected={
                        selectedServicio.includes(valor.idServicio)
                          ? "selected"
                          : ""
                      }
                      value={valor.idServicio}
                    >
                      {valor.nomServicio}
                    </option>
                  ))}
                </select>
              </td>

              <td id="espacioEntreOpciones" style={{ width: "16em" }}>
                <label htmlFor="input_CantidadR">Proyectos:</label>
                {/* <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-cliente">{mensajeCtrl}</Tooltip>}>
                                    <span> <FaQuestionCircle id="icons" /></span>
                                </OverlayTrigger>*/}
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    const selectedOptions = Array.from(
                      target.selectedOptions,
                      (option) => option.value
                    );

                    if (selectedOptions.includes("todos")) {
                      // Si "Todos" está seleccionado, selecciona todas las demás opciones excepto "Ninguno"
                      setSelectedProyecto(
                        listProyecto
                          .filter((valor) => valor.idEDDProyecto !== "0")
                          .map((valor) => valor.idEDDProyecto)
                      );
                    } else if (selectedOptions.includes("0")) {
                      // Si "Ninguno" está seleccionado, deselecciona todas las demás opciones
                      setSelectedProyecto(["0"]);
                    } else {
                      setSelectedProyecto(selectedOptions);
                    }
                  }}
                >
                  <option disabled hidden>
                    Proyectos
                  </option>
                  <option value="0">Ninguno</option>
                  {/* <option value="todos">-- Todos --</option> Agrega la opción "Todos" */}
                  {listProyecto.map((valor) => (
                    <option
                      selected={
                        selectedProyecto.includes(valor.idEDDProyecto)
                          ? "selected"
                          : ""
                      }
                      value={valor.idEDDProyecto}
                    >
                      {valor.nomProyecto}
                    </option>
                  ))}
                </select>
              </td>
              <td id="espacioEntreOpciones" style={{ width: "16em" }}>
                <div className="form-group">
                  <label htmlFor="Ciclo">Ciclo de evaluación: </label>
                  <select
                    required
                    type="text"
                    className="form-control"
                    onChange={({ target }) => {
                      setcicloEvaluacion(target.value);
                    }}
                  >
                    <option value={0}>Todos</option>
                    {listcicloEvaluacion.map((valor) => (
                      <option value={valor.cicloEvaluacion}>
                        {valor.cicloEvaluacion}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td id="espacioEntreOpciones">
                <label>Fecha inicio desde:</label>
                <br></br>
                <input
                  className="form-control"
                  placeholder="Fecha inicio"
                  type="date"
                  value={fechaIni}
                  onChange={(e) => setFechaIni(e.target.value)}
                />
              </td>
              <td id="espacioEntreOpciones">
                <span>Fecha inicio hasta:</span>
                <br></br>
                <input
                  className="form-control"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </td>

              <td>
                <option disabled></option>
                <button
                  data-title="Limpiar filtros"
                  type="button"
                  class="btn-General-Pag"
                  onClick={limpiarClick}
                >
                  Limpiar
                </button>
              </td>
            </tr>
          </table>
          <br></br>
          <table style={{ width: "100%" }}>
            <tr>
              <td>
                <div id="tableResumen">
                  <table>
                    <td>
                      <strong>Comparación por:</strong>
                    </td>
                    <td id="espacioEntreOpciones">
                      <input
                        type="radio"
                        id="mes"
                        name="tipoComparacion"
                        value="MES"
                        checked={tipoComparacion === "MES"}
                        onChange={(e) => setTipoComparacion(e.target.value)}
                      />
                      <label htmlFor="mes">&nbsp;Mes</label>
                    </td>
                    <td id="espacioEntreOpciones">
                      <input
                        type="radio"
                        id="año"
                        name="tipoComparacion"
                        value="AÑO"
                        checked={tipoComparacion === "AÑO"}
                        onChange={(e) => setTipoComparacion(e.target.value)}
                      />
                      <label htmlFor="año">&nbsp;Año</label>
                    </td>
                  </table>
                </div>
              </td>

              <td id="espacioEntreOpciones">
                <div id="tableResumen">
                  <table>
                    <td>
                      <strong>Seleccionar por:</strong>
                    </td>
                    <td id="espacioEntreOpciones">
                      <input
                        type="radio"
                        id="referentes"
                        name="tipoCargo"
                        value="REFERENTE"
                        checked={tipoCargo === "REFERENTE"}
                        onChange={(e) => setTipoCargo(e.target.value)}
                      />
                      <label htmlFor="referentes">&nbsp;Referente</label>
                    </td>
                    <td id="espacioEntreOpciones">
                      <input
                        type="radio"
                        id="colaborador"
                        name="tipoCargo"
                        value="COLABORADOR"
                        checked={tipoCargo === "COLABORADOR"}
                        onChange={(e) => setTipoCargo(e.target.value)}
                      />
                      <label htmlFor="colaborador">&nbsp;Colaborador</label>
                    </td>
                  </table>
                </div>
              </td>
              <td>
                <button
                  data-title="Buscar"
                  type="button"
                  class="btn-General-Pag"
                  onClick={buscarClick} // Aquí se agrega el manejador de eventos
                >
                  Buscar
                </button>
              </td>

              <td>
                <Link
                  to={`/dashboardCompProy/${selectedClients}/${selectedServicio}/${selectedProyecto}/${tipoComparacion}/${tipoCargo}/${fechaIni}/${fechaFin}/${cicloEvaluacion}`}
                >
                  <button
                    data-title="Desplegar dashboard"
                    type="button"
                    className="btn-General-Pag"
                    onClick={buscarClick}
                    disabled={!busquedaRealizada} // Deshabilita el botón si busquedaRealizada es falso
                  >
                    Desplegar Dashboard
                  </button>
                </Link>
              </td>
              <td>
               <ExportCSV inputData={EDDCompProy} nomTabla={nombreTabla}/> 
              </td>
            </tr>
          </table>
          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Proyecto</th>
                <th>Ciclo</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>% Aprobación</th>
                <th>Cant Ref</th>
                <th>Cant Colab</th>

                {/* <th>Operaciones</th> */}
              </tr>
            </thead>
            <tbody>
              {loadedNuevosDatos ? (
                nuevosDatos.map((item) => (
                  <tr>
                    <td>{item.nomCliente}</td>
                    <td>{item.nomServicio}</td>
                    <td>{item.nomProyecto}</td>
                    <td>{item.cicloEvaluacion}</td>
                    <td>{item.epeFechaIni}</td>
                    <td>{item.epeFechaFin}</td>
                    <td>{item.porcentajeAprob}</td>
                    <td>{item.cantReferentes}</td>
                    <td>{item.cantColaboradores}</td>
                  </tr>
                ))
              ) : (
                <></>
              )}
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
    <Navigate to="/login"></Navigate>
  );
}
