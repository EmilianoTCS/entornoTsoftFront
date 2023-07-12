import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";

import "../TablasStyles.css";
import InsertarEmpSubsist from "../../templates/form/Insertar/InsertarEmpSubsist";
import EditarEmpSubsist from "../../templates/form/Editar/EditarEmpSubsist";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoEmpSubsist() {
  const [, params] = useRoute("/listadoEmpSubsist/:params");

  const [EmpSubsist, setEmpSubsist] = useState([""]);
  const [isActiveInsertEmpSubsist, setIsActiveInsertEmpSubsist] =
    useState(false);
  const [isActiveEditEmpSubsist, setIsActiveEditEmpSubsist] = useState(false);
  const [idEmpSubsist, setidEmpSubsist] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "empsubsist";

  const [idEmpleado, setidEmpleado] = useState(params.params);
  const [idSubsistema, setidSubsistema] = useState(params.params);

  const [listEmpleado, setlistEmpleado] = useState([""]);
  const [listSubsistema, setlistSubsistema] = useState([""]);



  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }

  function obtenerSubsist() {
    const url = "pages/auxiliares/listadoSubsistemaForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
    setlistSubsistema(response)
    );
  }

    function insertarEmpSubsist() {
      setIsActiveInsertEmpSubsist(!isActiveInsertEmpSubsist);
    }
    function editarEmpSubsist(ID) {
      setIsActiveEditEmpSubsist(!isActiveEditEmpSubsist);
      setidEmpSubsist(ID);
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
          console.log(response);
        });
      }
    });
  }

  useEffect(
    function () {
      handleChangePaginador();
      obtenerEmpleado();
      obtenerSubsist();
    },
    [num_boton, cantidadPorPagina, idEmpleado,idSubsistema]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoEmpSubsist.php";
    var operationUrl = "listadoEmpSubsist";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idEmpleado: idEmpleado,
      idSubsistema:idSubsistema
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEmpSubsist(datos.datos);
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
          <h1 id="TitlesPages">Listado de empleados asociados a subsistemas</h1>
          <h6 style={{ color: "gray" }}>
            EDD {"->"} Listado de empleados asociados a subsistemas
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarEmpSubsist}>
              Asociar empleado a subsistema
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
              <label htmlFor="input_CantidadR">Empleado: </label>
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
                    selected={valor.idEmpleado === idEmpleado ? "selected" : ""}
                    value={valor.idEmpleado}
                  >
                    {valor.nomEmpleado}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadR">Subsistema: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidSubsistema(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {listSubsistema.map((valor) => (
                  <option
                    selected={valor.idSubsistema === idSubsistema ? "selected" : ""}
                    value={valor.idSubsistema}
                  >
                    {valor.nomSubsistema}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InsertarEmpSubsist
            isActiveEmpSubsist={isActiveInsertEmpSubsist}
            cambiarEstado={setIsActiveInsertEmpSubsist}
            EmpSubsist={EmpSubsist}
          ></InsertarEmpSubsist>

          <EditarEmpSubsist
            isActiveEditEmpSubsist={isActiveEditEmpSubsist}
            cambiarEstado={setIsActiveEditEmpSubsist}
            idEmpSubsist={idEmpSubsist}
            setEmpSubsist={setEmpSubsist}
            EmpSubsist={EmpSubsist}
            nombreTabla={nombreTabla}
          ></EditarEmpSubsist>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Empleado</th>
                <th>Subsistema</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {EmpSubsist.map((EmpSubsist) => (
                <tr key={EmpSubsist.idEmpSubsist}>
                  <td>{EmpSubsist.idEmpSubsist}</td>

                  <td>{EmpSubsist.nomEmpleado}</td>
                  <td>{EmpSubsist.nomSubsistema}</td>
                  <td>
                    <button
                      data-title="Editar colaborador subsistema"
                      id="OperationBtns"
                      onClick={() => editarEmpSubsist(EmpSubsist.idEmpSubsist)}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    <Link to={`/listadoEDDProyEmp/${EmpSubsist.idEmpSubsist}`}>
                      <button
                        data-title="Proy. colaborador relacionados"
                        id="OperationBtns"
                      >
                        <RiEditBoxFill id="icons" />
                      </button>
                    </Link>
                    <button
                      data-title="Desactivar colaborador subsistema"
                      onClick={() => desactivar(EmpSubsist.idEmpSubsist)}
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
