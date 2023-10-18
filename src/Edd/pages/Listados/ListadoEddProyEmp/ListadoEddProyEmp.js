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
import InsertarEDDProyEmp from "../../templates/form/Insertar/InsertarEddProyEmp";
import EditarEDDProyEmp from "../../templates/form/Editar/EditarEddProyEmp";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoEDDProyEmp() {
  const [, params] = useRoute("/listadoEddProyEmp/:params");

  const [EDDProyEmp, setEDDProyEmp] = useState([""]);
  const [isActiveInsertEDDProyEmp, setIsActiveInsertEDDProyEmp] = useState(false);
  const [isActiveEditEDDProyEmp, setIsActiveEditEDDProyEmp] = useState(false);
  const [idEDDProyEmp, setidEDDProyEmp] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "eddproyemp";

  const [idProyecto, setidProyecto] = useState(params.params);
  const [idEmpleado, setidEmpleado] = useState(0);

  const [listProyecto, setlistProyecto] = useState([""]);

  const [listEmpleado, setlistEmpleado] = useState([""]);

  // function obtenerProyecto() {
  //   const url = "pages/auxiliares/listadoProyectoForms.php";
  //   const operationUrl = "listados";
  //   getDataService(url, operationUrl).then((response) =>
  //     setlistProyecto(response)
  //   );
  // }


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
  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }

  function insertarEDDProyEmp() {
    setIsActiveInsertEDDProyEmp(!isActiveInsertEDDProyEmp);
  }
  function editarEDDProyEmp(ID) {
    setIsActiveEditEDDProyEmp(!isActiveEditEDDProyEmp);
    setidEDDProyEmp(ID);
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
          TopAlerts('successEdited');
        });
      }
    });
  }

  useEffect(
    function () {
      handleChangePaginador();
      obtenerProyecto();
      obtenerEmpleado();
    },
    [num_boton, cantidadPorPagina, idProyecto, idEmpleado]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoEddProyEmp.php";
    var operationUrl = "listadoEddProyEmp";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idEmpleado: 0,
      idProyecto: idProyecto,
      idEmpleado: idEmpleado
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEDDProyEmp(datos.datos);
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
            href="/listadoEddProyecto/0">Volver
          </a>


          <h1 id="TitlesPages">Listado de proyectos - colaboradores</h1>
          <h6 style={{ color: 'gray' }}>EDD {'->'} Listado de proyectos - colaboradores</h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarEDDProyEmp}>
              Asociar proyecto - colaboradores
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
                onChange={({ target }) => { setidProyecto(target.value); setNumBoton(1); }}
              >
                <option value="">Todos</option>
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
            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadR">Colaborador: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => { setidEmpleado(target.value); setNumBoton(1); }}
              >
                <option value="">Todos</option>
                {listEmpleado.map((valor) => (
                  <option
                    selected={(valor.idEmpleado === idEmpleado ? "selected" : "")}
                    value={valor.idEmpleado}
                  >
                    {valor.nomEmpleado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InsertarEDDProyEmp
            isActiveEDDProyEmp={isActiveInsertEDDProyEmp}
            cambiarEstado={setIsActiveInsertEDDProyEmp}
            EDDProyEmp={EDDProyEmp}
          ></InsertarEDDProyEmp>

          <EditarEDDProyEmp
            isActiveEditEDDProyEmp={isActiveEditEDDProyEmp}
            cambiarEstado={setIsActiveEditEDDProyEmp}
            idEDDProyEmp={idEDDProyEmp}
            setEDDProyEmp={setEDDProyEmp}
            EDDProyEmp={EDDProyEmp}
            nombreTabla={nombreTabla}
          ></EditarEDDProyEmp>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Proyecto</th>
                <th>Colaborador</th>
                <th>Cargo en proyecto</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {EDDProyEmp.map((EDDProyEmp) => (
                <tr key={EDDProyEmp.idEDDProyEmp}>
                  <td>{EDDProyEmp.idEDDProyEmp}</td>
                  <td>{EDDProyEmp.nomProyecto}</td>
                  <td>{EDDProyEmp.nomEmpleado}</td>
                  <td>{EDDProyEmp.cargoEnProy}</td>
                  <td>
                    <button
                      data-title="Editar proyecto - colaborador"
                      id="OperationBtns"
                      onClick={() => editarEDDProyEmp(EDDProyEmp.idEDDProyEmp)}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>



                    <Link to={EDDProyEmp.idProyecto !== 'empty / vacio' ? `/listadoEddEvalProyEmp/${EDDProyEmp.idProyecto}` : ''}>
                      <button disabled={EDDProyEmp.nomProyecto !== 'empty / vacio' ? false : true} data-title="Evaluaciones relacionadas" id="OperationBtns">
                        <AiFillBook id="icons" />
                      </button>
                    </Link >



                    <button
                      data-title="Desactivar proyecto - colaborador"
                      onClick={() => desactivar(EDDProyEmp.idEDDProyEmp)}
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
