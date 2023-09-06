import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate,Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";


import "../TablasStyles.css";
import InsertarEmpTipoPerfil from "../../templates/form/Insertar/InsertarEmpTipoPerfil";
import EditarEmpTipoPerfil from "../../templates/form/Editar/EditarEmpTipoPerfil";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoEmpTipoPerfil() {
  const [, params] = useRoute("/listadoEmpTipoPerfil/:params");

  const [EmpTipoPerfil, setEmpTipoPerfil] = useState([""]);
  const [isActiveInsertEmpTipoPerfil, setIsActiveInsertEmpTipoPerfil] = useState(false);
  const [isActiveEditEmpTipoPerfil, setIsActiveEditEmpTipoPerfil] = useState(false);
  const [idEmpTipoPerfil, setidEmpTipoPerfil] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "emptipoperfil";

  const [idTipoPerfil, setidTipoPerfil] = useState(params.params);
  const [idEmpleado, setidEmpleado] = useState(params.params);

  const [listTipoPerfil, setlistTipoPerfil] = useState([""]);
  const [listEmpleado, setlistEmpleado] = useState([""]);

  function obtenerTipoPerfil() {
    const url = "pages/auxiliares/listadoTipoPerfilForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
    setlistTipoPerfil(response)
    );
  }

  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }

  function insertarEmpTipoPerfil() {
    setIsActiveInsertEmpTipoPerfil(!isActiveInsertEmpTipoPerfil);
  }
  function editarEmpTipoPerfil(ID) {
    setIsActiveEditEmpTipoPerfil(!isActiveEditEmpTipoPerfil);
    setidEmpTipoPerfil(ID);
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
        console.log(data);
        SendDataService(url, operationUrl, data).then((response) => {
          TopAlerts('successEdited');
          console.log(response);
        });
      }
    });
  }

  useEffect(
    function () {
      handleChangePaginador();
      obtenerEmpleado();
      obtenerTipoPerfil();
    },
    [num_boton, cantidadPorPagina,idTipoPerfil,idEmpleado]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoEmpTipoPerfil.php";
    var operationUrl = "listadoEmpTipoPerfil";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idTipoPerfil:idTipoPerfil,
      idEmpleado:idEmpleado
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEmpTipoPerfil(datos.datos);
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
          <h1 id="TitlesPages">Listado de perfiles de colaborador</h1>
          <h6 style={{color:'gray'}}>EDD {'->'} Listado de perfiles de colaborador</h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarEmpTipoPerfil}>
              Asociar perfil a colaborador
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
              <label htmlFor="input_CantidadR">Tipo Perfil: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {setidTipoPerfil(target.value);setNumBoton(1);}}
              >
                <option value="">Todos</option>
                {listTipoPerfil.map((valor) => (
                  <option
                  selected={(valor.idTipoPerfil === idTipoPerfil ? "selected" : "")}
                  value={valor.idTipoPerfil}
                >
                  {valor.nomTipoPerfil}
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
          </div>
        
          <InsertarEmpTipoPerfil
            isActiveEmpTipoPerfil={isActiveInsertEmpTipoPerfil}
            cambiarEstado={setIsActiveInsertEmpTipoPerfil}
            EmpTipoPerfil={EmpTipoPerfil}
          ></InsertarEmpTipoPerfil>

          <EditarEmpTipoPerfil
            isActiveEditEmpTipoPerfil={isActiveEditEmpTipoPerfil}
            cambiarEstado={setIsActiveEditEmpTipoPerfil}
            idEmpTipoPerfil={idEmpTipoPerfil}
            setEmpTipoPerfil={setEmpTipoPerfil}
            EmpTipoPerfil={EmpTipoPerfil}
            nombreTabla={nombreTabla}
          ></EditarEmpTipoPerfil>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo perfil</th>
                <th>Colaborador</th>

                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {EmpTipoPerfil.map((EmpTipoPerfil) => (
                <tr key={EmpTipoPerfil.idEmpTipoPerfil}>
                  <td>{EmpTipoPerfil.idEmpTipoPerfil}</td>
                  <td>{EmpTipoPerfil.nomTipoPerfil}</td>
                  <td>{EmpTipoPerfil.nomEmpleado}</td>

                  <td>
                    <button
                      data-title="Editar perfil de colaborador"
                      id="OperationBtns"
                      onClick={() => editarEmpTipoPerfil(EmpTipoPerfil.idEmpTipoPerfil)}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    <button
                      data-title="Desactivar perfil de colaborador"
                      onClick={() => desactivar(EmpTipoPerfil.idEmpTipoPerfil)}
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
