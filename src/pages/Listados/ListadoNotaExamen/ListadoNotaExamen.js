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
import InsertarNotaExamen from "../../../templates/forms/Insertar/InsertarNotaExamen";
import EditarNotaExamen from "../../../templates/forms/Editar/EditarNotaExamen";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";

export default function ListadoNotaExamen() {
  const [, params] = useRoute("/listadoNotaExamen/:params");
  const [notaExamen, setNotaExamen] = useState([""]);
  const [isActiveInsertNotaExamen, setIsActiveInsertNotaExamen] =
    useState(false);
  const [idNotaExamen, setidNotaExamen] = useState(null);
  const [isActiveEditNotaExamen, setIsActiveEditNotaExamen] = useState(false);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  const nombreTabla = "notaexamen";
  const [idRamoExamen, setidRamoExamen] = useState(params.params);
  const [idEmpleado, setidEmpleado] = useState(0);

  const [listRamoExamen, setlistRamoExamen] = useState([""]);
  const [listEmpleado, setlistEmpleado] = useState([""]);

  function obtenerRamoExamen() {
    const url = "pages/auxiliares/listadoRamoExamenForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistRamoExamen(response)
    );
  }

  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }
  function insertarNotaExamen() {
    setIsActiveInsertNotaExamen(!isActiveInsertNotaExamen);
  }
  function editarNotaExamen(ID) {
    setIsActiveEditNotaExamen(!isActiveEditNotaExamen);
    setidNotaExamen(ID);
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
        SendDataService(url, operationUrl, data).then((data) => {
          TopAlerts("successEdited");
        });
      }
    });
  }

  useEffect(
    function () {
      handleChangePaginador();
      obtenerRamoExamen();
      obtenerEmpleado();
    },
    [num_boton, cantidadPorPagina, idRamoExamen, idEmpleado]
  );

  //PAGINADOR ---------------------
  function handleChangePaginador() {
    var url = "pages/listados/listadoNotaExamen.php";
    var operationUrl = "listadoNotaExamen";
    if (userData.nomRol === "alumno") {
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idRamoExamen: idRamoExamen,
        idEmpleado: userData.idEmpleado,
      };
    } else {
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idRamoExamen: idRamoExamen,
        idEmpleado: idEmpleado,
      };
    }
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setNotaExamen(datos.datos);
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
            <h1 id="TitlesPages">Listado de Notas de Exámenes</h1>
            <h6 style={{ color: "gray" }}>
              Factory Devops {"->"} Listado de Notas de Exámenes
            </h6>
            <br></br>

            <div id="selectPaginador">
              {userData.nomRol === "administrador" ||
              userData.nomRol === "relator" ? (
                <Button id="btn" onClick={insertarNotaExamen}>
                  Crear Nota Examen
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
                <label htmlFor="input_CantidadR">Examen: </label>
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    setidRamoExamen(target.value);
                    setNumBoton(1);
                  }}
                >
                  <option value="">Todos</option>
                  {listRamoExamen.map((valor) => (
                    <option
                      selected={
                        valor.idRamoExamen === idRamoExamen ? "selected" : ""
                      }
                      value={valor.idRamoExamen}
                    >
                      {valor.nomExamen}
                    </option>
                  ))}
                </select>
              </div>
              {userData.nomRol === "administrador" ||
              userData.nomRol === "gerencia" ||
              userData.nomRol === "people" ||
              userData.nomRol === "relator" ? (
                <div className="form-group" id="btn2">
                  <label htmlFor="input_CantidadR">Colaborador: </label>
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
            <InsertarNotaExamen
              isActiveNotaExamen={isActiveInsertNotaExamen}
              cambiarEstado={setIsActiveInsertNotaExamen}
              notaDeExamen={notaExamen}
            ></InsertarNotaExamen>

            <EditarNotaExamen
              isActiveEditNotaExamen={isActiveEditNotaExamen}
              cambiarEstado={setIsActiveEditNotaExamen}
              idNotaExamen={idNotaExamen}
              setNotaExamen={setNotaExamen}
              notaDeExamen={notaExamen}
              nombreTabla={nombreTabla}
            ></EditarNotaExamen>

            <Table id="mainTable" hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Alumno</th>
                  <th>Curso</th>
                  <th>Examen</th>
                  <th>Nota examen</th>
                  <th>Aprueba examen</th>
                  {userData.nomRol === "administrador" ||
                  userData.nomRol === "relator" ? (
                    <th>Operaciones</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {notaExamen.map((notaExamen) => (
                  <tr key={notaExamen.idNotaExamen}>
                    <td>{notaExamen.idNotaExamen}</td>
                    <td>{notaExamen.nomEmpleado}</td>
                    <td>{notaExamen.nomCurso}</td>
                    <td>{notaExamen.nomExamen}</td>
                    <td>{notaExamen.notaExamen}</td>
                    <td>{notaExamen.apruebaExamen}</td>
                    <td>
                      {userData.nomRol === "administrador" ||
                      userData.nomRol === "relator" ? (
                        <button
                          data-title="Editar notaExamen"
                          id="OperationBtns"
                          onClick={() =>
                            editarNotaExamen(notaExamen.idNotaExamen)
                          }
                        >
                          <RiEditBoxFill id="icons" />
                        </button>
                      ) : null}
                      {userData.nomRol === "administrador" ? (
                        <button
                          data-title="Desactivar notaExamen"
                          onClick={() => desactivar(notaExamen.idNotaExamen)}
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
