import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillBook } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import { SiSubstack } from "react-icons/si";
import { FaComments } from "react-icons/fa";


import "../TablasStyles.css";
import InsertarEDDEvaluacion from "../../templates/form/Insertar/InsertarEddEvaluacion";
import EditarEDDEvaluacion from "../../templates/form/Editar/EditarEddEvaluacion";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoEDDEvaluacion() {
  const [, params] = useRoute("/listadoEddEvaluacion/:params");

  const [EDDEvaluacion, setEDDEvaluacion] = useState([""]);
  const [isActiveInsertEDDEvaluacion, setIsActiveInsertEDDEvaluacion] =
    useState(false);
  const [isActiveEditEDDEvaluacion, setIsActiveEditEDDEvaluacion] =
    useState(false);
  const [idEDDEvaluacion, setidEDDEvaluacion] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "eddevaluacion";

  const [idEvaluacion, setidEvaluacion] = useState(params.params);

  const [listEvaluacion, setlistEvaluacion] = useState([""]);

  function obtenerEvaluacion() {
    const url = "pages/auxiliares/listadoEddEvaluacion.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEvaluacion(response)
    );
  }

  function insertarEDDEvaluacion() {
    setIsActiveInsertEDDEvaluacion(!isActiveInsertEDDEvaluacion);
  }
  function editarEDDEvaluacion(ID) {
    setIsActiveEditEDDEvaluacion(!isActiveEditEDDEvaluacion);
    setidEDDEvaluacion(ID);
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
          // TopAlerts("successEdited");
          console.log(response);
        });
      }
    });
  }

  useEffect(
    function () {
      handleChangePaginador();
      obtenerEvaluacion()
    },
    [num_boton, cantidadPorPagina, idEvaluacion]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoEddEvaluacion.php";
    var operationUrl = "listadoEddEvaluacion";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idEDDEvaluacion: idEvaluacion,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEDDEvaluacion(datos.datos); console.log(data);
    });
  }

  function ValidarFecha(fechaIni, fechaFin) {
    const fechaActual = new Date().toLocaleDateString("es-GB"); // Obtiene la fecha actual como objeto de fecha
    const fechaInicio = new Date(fechaIni).toLocaleDateString("es-GB");
    const fechaFinal = new Date(fechaFin).toLocaleDateString("es-GB");

    console.log("fechaActual", fechaActual);
    console.log("fechaInicio", fechaInicio);
    console.log("fechaFinal", fechaFinal);
    var result = ""
    // Si las fechas son válidas
    if (fechaActual >= fechaInicio && fechaActual <= fechaFinal) {
      result = 'SÍ';
    } else {
      result = 'NO';
    }

    return result;
  }

  // const resultado = ValidarFecha('2023-08-01', '2023-08-31');
  // console.log(resultado); // Debería imprimir 'SÍ' o 'NO' según la fecha actual

  // Ejemplo de uso

  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <Container id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de evaluaciones</h1>
          <h6 style={{ color: "gray" }}>
            EDD {"->"} Listado de evaluaciones
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarEDDEvaluacion}>
              Crear evaluación
            </Button>
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
                  setidEvaluacion(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {listEvaluacion.map((valor) => (
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
          </div>

          <InsertarEDDEvaluacion
            isActiveEDDEvaluacion={isActiveInsertEDDEvaluacion}
            cambiarEstado={setIsActiveInsertEDDEvaluacion}
            EDDEvaluacion={EDDEvaluacion}
          ></InsertarEDDEvaluacion>

          <EditarEDDEvaluacion
            isActiveEditEDDEvaluacion={isActiveEditEDDEvaluacion}
            cambiarEstado={setIsActiveEditEDDEvaluacion}
            idEDDEvaluacion={idEDDEvaluacion}
            setEDDEvaluacion={setEDDEvaluacion}
            EDDEvaluacion={EDDEvaluacion}
            nombreTabla={nombreTabla}
          ></EditarEDDEvaluacion>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Evaluación</th>
                <th>Tipo evaluación</th>
                <th>Inicio vigencia</th>
                <th>Fin vigencia</th>
                <th>Vigencia</th>

                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {EDDEvaluacion.map((EDDEvaluacion) => (
                <tr key={EDDEvaluacion.idEDDEvaluacion}>
                  <td>{EDDEvaluacion.idEDDEvaluacion}</td>
                  <td>{EDDEvaluacion.nomEvaluacion}</td>
                  <td>{EDDEvaluacion.tipoEvaluacion}</td>
                  <td>{EDDEvaluacion.fechaIni}</td>
                  <td>{EDDEvaluacion.fechaFin}</td>
                  <td>
                    {ValidarFecha(EDDEvaluacion.fechaIni, EDDEvaluacion.fechaFin)}
                  </td>

                  <td>
                    <button
                      data-title="Editar evaluación"
                      id="OperationBtns"
                      onClick={() =>
                        editarEDDEvaluacion(EDDEvaluacion.idEDDEvaluacion)
                      }
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    <Link to={`/listadoEddEvalPregunta/${EDDEvaluacion.idEDDEvaluacion}`}>
                      <button data-title="Preguntas relacionadas" id="OperationBtns">
                        <AiFillBook id="icons" />
                      </button>
                    </Link>

                    {EDDEvaluacion.tipoEvaluacion !== 'COLABORADOR' ? (
                      <Link to={`/homePageEDD/${EDDEvaluacion.idEDDEvaluacion}/${EDDEvaluacion.nomEvaluacion}`}>
                        <button data-title="Información referentes" id="OperationBtns">
                          <MdDashboard id="icons" />
                        </button>
                      </Link>
                    ) : (
                      <Link to={`/GraficosDashboard/${EDDEvaluacion.idEDDEvaluacion}/${EDDEvaluacion.nomEvaluacion}`}>
                        <button data-title="Información colaboradores" id="OperationBtns">
                          <MdDashboard id="icons" />
                        </button>
                      </Link>
                    )
                    }

                    <Link to={`/ComentariosDashboard/${EDDEvaluacion.idEDDEvaluacion}/${EDDEvaluacion.nomEvaluacion}`}>
                      <button data-title="Comentarios" id="OperationBtns">
                        <FaComments id="icons" />
                      </button>
                    </Link>

                    <Link to={`/AlertasOporDes/${EDDEvaluacion.idEDDEvaluacion}/${EDDEvaluacion.nomEvaluacion}`}>
                      <button data-title="Desempeño" id="OperationBtns">
                        <SiSubstack id="icons" />
                      </button>
                    </Link>

                    <button
                      data-title="Desactivar evaluación"
                      onClick={() => desactivar(EDDEvaluacion.idEDDEvaluacion)}
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
      </Container>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
