import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { HiEye } from "react-icons/hi";
import "../TablasStyles.css";
import InsertarContacto from "../../../templates/forms/Insertar/InsertarContacto";
import EditarContacto from "../../../templates/forms/Editar/EditarContacto";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoContacto() {
  const [, params] = useRoute("/listadoContacto/:params"); 
  const [contacto, setContacto] = useState([""]);
  const [isActiveInsertContacto, setIsActiveInsertContacto] = useState(false);
  const [idContacto, setidContacto] = useState(null);
  const [isActiveEditContacto, setIsActiveEditContacto] = useState(false);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "contacto";

  const [idCliente, setidCliente] = useState("");
  const [idServicio, setidServicio] = useState(params.params);

  const [listCliente, setlistCliente] = useState([""]);
  const [listServicio, setlistServicio] = useState([""]);
  function obtenerCliente() {
    const url = "pages/auxiliares/listadoClienteForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCliente(response)
    );
  }
  function obtenerServicio() {
    const url = "pages/auxiliares/listadoServicioForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistServicio(response)
    );
  }
  function insertarContacto() {
    setIsActiveInsertContacto(!isActiveInsertContacto);
  }
  function editarContacto(ID) {
    setIsActiveEditContacto(!isActiveEditContacto);
    setidContacto(ID);
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
      obtenerCliente();
      obtenerServicio();
    },
    [num_boton, cantidadPorPagina,idServicio,idCliente]
  );

  //PAGINADOR ---------------------
  function handleChangePaginador() {
    var url = "pages/listados/listadoContactos.php";
    var operationUrl = "listadoContactos";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idServicio:idServicio,
      idCliente:idCliente
    };console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setContacto(datos.datos);console.log(data);
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
          <h1 id="TitlesPages">Listado de contactos</h1>
          <h6 style={{color:'gray'}}>Factory Devops {'->'} Listado de contactos</h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarContacto}>
              Crear Contacto
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
              <label htmlFor="input_CantidadR">Clientes: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {setidCliente(target.value);setNumBoton(1);}}
              >
                <option value="">Todos</option>
                {listCliente.map((valor) => (
                  <option
                  selected={(valor.idCliente === idCliente ? "selected" : "")}
                  value={valor.idCliente}
                >
                  {valor.nomCliente}
                </option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadR">Servicios: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {setidServicio(target.value);setNumBoton(1);}}
              >
                <option value="">Todos</option>
                {listServicio.map((valor) => (
                  <option
                  selected={(valor.idServicio === idServicio ? "selected" : "")}
                  value={valor.idServicio}
                >
                  {valor.nomServicio}
                </option>
              ))}
              </select>
            </div>
          </div>

          <InsertarContacto
            isActiveContacto={isActiveInsertContacto}
            cambiarEstado={setIsActiveInsertContacto}
            contacto={contacto}
          ></InsertarContacto>

          <EditarContacto
            isActiveEditContacto={isActiveEditContacto}
            cambiarEstado={setIsActiveEditContacto}
            idContacto={idContacto}
            setContacto={setContacto}
            contacto={contacto}
            nombreTabla={nombreTabla}
          ></EditarContacto>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Servicio</th>
                <th>Cliente</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {contacto.map((contacto) => (
                <tr key={contacto.idContacto}>
                  <td>{contacto.idContacto}</td>
                  <td>{contacto.nomContacto}</td>
                  <td>{contacto.correoContacto}</td>
                  <td>{contacto.telefonoContacto}</td>
                  <td>{contacto.fechaIni}</td>
                  <td>{contacto.fechaFin}</td>
                  <td>{contacto.nomServicio}</td>
                  <td>{contacto.nomCliente}</td>

                  <td>
                    <button
                      data-title="Editar contacto"
                      id="OperationBtns"
                      onClick={() => editarContacto(contacto.idContacto)}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    {/* <button data-title="Examinar contacto" id="OperationBtns">
                      <HiEye id="icons" />
                    </button> */}
                    <button
                      data-title="Desactivar contacto"
                      onClick={() => desactivar(contacto.idContacto)}
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
