import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillProject } from "react-icons/ai";

import "../TablasStyles.css";
import InsertarEddProyecto from "../../templates/form/Insertar/InsertarEddProyecto";
import EditarEDDProyecto from "../../templates/form/Editar/EditarEddProyecto";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoEddProyecto() {
  const [, params] = useRoute("/listadoEddProyecto/:params");

  const [EDDProyecto, setEDDProyecto] = useState([""]);
  const [isActiveInsertEDDProyecto, setIsActiveInsertEDDProyecto] =
    useState(false);
  const [isActiveEditEDDProyecto, setIsActiveEditEDDProyecto] = useState(false);
  const [idEDDProyecto, setidEDDProyecto] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "eddproyecto";

  const [idServicio, setidServicio] = useState(params.params);

  const [listServicio, setlistServicio] = useState([""]);

  // function obtenerServicio() {
  //   const url = "pages/auxiliares/listadoServicioForms.php";
  //   const operationUrl = "listados";
  //   getDataService(url, operationUrl).then((response) =>
  //     setlistServicio(response)
  //   );
  // }

  function obtenerServicio() {
    const url = "pages/auxiliares/listadoServicioForms.php";
    const operationUrl = "listados";
    var data = {
      idCliente: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setlistServicio(data);
    });
  }

  function insertarEDDProyecto() {
    setIsActiveInsertEDDProyecto(!isActiveInsertEDDProyecto);
  }
  function editarEDDProyecto(ID) {
    setIsActiveEditEDDProyecto(!isActiveEditEDDProyecto);
    setidEDDProyecto(ID);
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
      obtenerServicio();
    },
    [num_boton, cantidadPorPagina, idServicio]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoEddProyecto.php";
    var operationUrl = "listadoEddProyecto";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idServicio: idServicio,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEDDProyecto(datos.datos);
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
          <h1 id="TitlesPages">Listado de proyectos</h1>
          <h6 style={{ color: "gray" }}>Eval desempeño {"->"} Proyectos</h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarEDDProyecto}>
              Crear proyecto
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
              <label htmlFor="input_CantidadR">Servicios del cliente: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidServicio(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {listServicio.map((valor) => (
                  <option
                    selected={valor.idServicio === idServicio ? "selected" : ""}
                    value={valor.idServicio}
                  >
                    {valor.nomServicio}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InsertarEddProyecto
            isActiveEDDProyecto={isActiveInsertEDDProyecto}
            cambiarEstado={setIsActiveInsertEDDProyecto}
            EDDProyecto={EDDProyecto}
          ></InsertarEddProyecto>

          <EditarEDDProyecto
            isActiveEditEDDProyecto={isActiveEditEDDProyecto}
            cambiarEstado={setIsActiveEditEDDProyecto}
            idEDDProyecto={idEDDProyecto}
            setEDDProyecto={setEDDProyecto}
            EDDProyecto={EDDProyecto}
            nombreTabla={nombreTabla}
          ></EditarEDDProyecto>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Proyecto</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Tipo Proyecto</th>
                <th>Servicio del cliente</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {EDDProyecto.map((EDDProyecto) => (
                <tr key={EDDProyecto.idEDDProyecto}>
                  <td>{EDDProyecto.idEDDProyecto}</td>
                  <td>{EDDProyecto.nomProyecto}</td>
                  <td>{EDDProyecto.fechaIni}</td>
                  <td>{EDDProyecto.fechaFin}</td>
                  <td>{EDDProyecto.tipoProyecto}</td>
                  <td>{EDDProyecto.nomServicio}</td>
                  <td>
                    <button
                      data-title="Editar proyecto"
                      id="OperationBtns"
                      onClick={() =>
                        editarEDDProyecto(EDDProyecto.idEDDProyecto)
                      }
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    <Link
                      to={`/listadoEDDProyEmp/${EDDProyecto.idEDDProyecto}`}
                    >
                      <button
                        data-title="Proy. colaborador relacionados"
                        id="OperationBtns"
                      >
                        <AiFillProject id="icons" />
                      </button>
                    </Link>
                    <button
                      data-title="Desactivar proyecto"
                      onClick={() => desactivar(EDDProyecto.idEDDProyecto)}
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
