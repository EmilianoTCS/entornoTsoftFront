import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";


import "../TablasStyles.css";
import InsertarRelatorRamo from "../../../templates/forms/Insertar/InsertarRelatorRamo";
import EditarRelatorRamo from "../../../templates/forms/Editar/EditarRelatorRamo";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoRelatorRamo() {
  const [, paramsRamo] = useRoute("/listadoRelatorRamo/:paramsRamo");
  const [, paramsEmpleado] = useRoute("/listadoRelatorRamo/:paramsEmpleado");
  const [relatorRamo, setRelatorRamo] = useState([""]);
  const [isActiveInsertRelatorRamo, setIsActiveInsertRelatorRamo] =
    useState(false);
  const [idRelatorRamo, setidRelatorRamo] = useState(null);
  const [isActiveEditRelatorRamo, setIsActiveEditRelatorRamo] = useState(false);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  const [idEmpleado, setidEmpleado] = useState(paramsEmpleado.paramsEmpleado);
  const [idRamo, setidRamo] = useState(paramsRamo.paramsRamo);


  const [listEmpleado, setlistEmpleado] = useState([""]);
  const [listRamo, setlistRamo] = useState([""]);


  const nombreTabla = "relatorramo";

  function insertarRelatorRamo() {
    setIsActiveInsertRelatorRamo(!isActiveInsertRelatorRamo);
  }
  function editarRelatorRamo(ID) {
    setIsActiveEditRelatorRamo(!isActiveEditRelatorRamo);
    setidRelatorRamo(ID);
  }

  function obtenerRamo() {
    const url = "pages/auxiliares/listadoRamoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistRamo(response));
  }

  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistEmpleado(response));
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
      obtenerEmpleado();
      obtenerRamo()
        },
    [num_boton, cantidadPorPagina,idEmpleado,idRamo]
  );

  //PAGINADOR ---------------------
  function handleChangePaginador() {
    var url = "pages/listados/listadoRelatorRamo.php";
    var operationUrl = "listadoRelatorRamo";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idEmpleado:idEmpleado,
      idRamo:idRamo
    };console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setRelatorRamo(datos.datos);console.log(data);
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
          <h1 id="TitlesPages">Listado de relatores ramos</h1>
          <h6 style={{color:'gray'}}>Factory Devops {'->'} Listado de relator ramo</h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarRelatorRamo}>
              Crear Relator Ramo
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
              <label htmlFor="input_CantidadR">Relator: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {setidEmpleado(target.value);setNumBoton(1); }}
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
            </div><div className="form-group" id="btn2">
              <label htmlFor="input_CantidadR">Ramo: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {setidRamo(target.value);setNumBoton(1); }}
              >

                <option value="">Todos</option>
                {listRamo.map((valor) => (
                  <option
                  selected={(valor.idRamo === idRamo ? "selected" : "")}
                  value={valor.idRamo}
                >
                  {valor.nomRamo}
                </option>
              ))}
              </select>
            </div>
          </div>
          <InsertarRelatorRamo
            isActiveRelatorRamo={isActiveInsertRelatorRamo}
            cambiarEstado={setIsActiveInsertRelatorRamo}
            relatorRamo={relatorRamo}
          ></InsertarRelatorRamo>

          <EditarRelatorRamo
            isActiveEditRelatorRamo={isActiveEditRelatorRamo}
            cambiarEstado={setIsActiveEditRelatorRamo}
            idRelatorRamo={idRelatorRamo}
            setRelatorRamo={setRelatorRamo}
            relatorRamo={relatorRamo}
            nombreTabla={nombreTabla}
          ></EditarRelatorRamo>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Relator</th>
                <th>Ramo</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {relatorRamo.map((relatorRamo) => (
                <tr key={relatorRamo.idRelator}>
                  <td>{relatorRamo.idRelatorRamo}</td>
                  <td>{relatorRamo.nomEmpleado}</td>
                  <td>{relatorRamo.nomRamo}</td>
                  <td>{relatorRamo.fechaIni}</td>
                  <td>{relatorRamo.fechaFin}</td>
                  <td>
                    <button
                      data-title="Editar relatorRamo"
                      id="OperationBtns"
                      onClick={() =>
                        editarRelatorRamo(relatorRamo.idRelatorRamo)
                      }
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    {/* <button data-title="Examinar relatorRamo" id="OperationBtns">
                      <HiEye id="icons" />
                    </button> */}
                    <button
                      data-title="Desactivar relatorRamo"
                      onClick={() => desactivar(relatorRamo.idRelatorRamo)}
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
   