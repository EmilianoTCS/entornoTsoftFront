import React, { useState, useEffect } from "react";

//Servicios
import { Navigate, Link } from "react-router-dom";
import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import { useRoute } from "wouter";

//Componentes
import Header from "../../../templates/Header/Header";
import InsertarEmpleado from "../../../templates/forms/Insertar/InsertarEmpleado";
import EditarEmpleados from "../../../templates/forms/Editar/EditarEmpleados";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import { Table } from "react-bootstrap";

//CSS
import "../../Listados/BtnInsertar.css";
import "../TablasStyles.css";

//Iconos
import { BsFillTrashFill, BsBookmarksFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { AiFillProject } from "react-icons/ai";
import { FaFlipboard } from "react-icons/fa";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";
import TopAlertsError from "../../../templates/alerts/TopAlerts";

export default function ListadoEmpleados() {
  const [empleado, setEmpleado] = useState([""]);
  const [isActiveInsertEmpleado, setIsActiveInsertEmpleado] = useState(false);
  const [isActiveEditEmpleado, setIsActiveEditEmpleado] = useState(false);
  const [, params] = useRoute("/listadoEmpleados/:idEmpleado");

  const [idEmpleado, setIDEmpleado] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  // const [idServicio, setidServicio] = useState("");
  const [idPais, setidPais] = useState("");
  const [idArea, setidArea] = useState("");
  const [idCargo, setidCargo] = useState("");
  const [idEmpleadoFiltro, setidEmpleadoFiltro] = useState(params.idEmpleado);

  const [listPais, setlistPais] = useState([""]);
  const [listCargo, setlistCargo] = useState([""]);
  const [listArea, setlistArea] = useState([""]);
  const [listEmpleado, setlistEmpleado] = useState([""]);

  // const [listServicio, setlistServicio] = useState([""]);

  const nombreTabla = "empleado";

  function insertarEmpleado() {
    setIsActiveInsertEmpleado(!isActiveInsertEmpleado);
  }
  function editarEmpleado(ID) {
    setIsActiveEditEmpleado(!isActiveEditEmpleado);
    setIDEmpleado(ID);
  }
  function obtenerPais() {
    const url = "pages/auxiliares/listadoPaisForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistPais(response));
  }
  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setlistEmpleado(response);
    });
  }
  function obtenerCargo() {
    const url = "pages/auxiliares/listadoCargoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCargo(response)
    );
  }
  function obtenerArea() {
    const url = "pages/auxiliares/listadoAreaForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistArea(response));
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
          const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        });
      }
    });
  }

  useEffect(
    function () {
      handleChangePaginador();
      obtenerPais();
      obtenerCargo();
      obtenerArea();
      obtenerEmpleado();
    },
    [num_boton, cantidadPorPagina, idArea, idCargo, idPais, idEmpleadoFiltro]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoEmpleados.php";
    var operationUrl = "listadoEmpleados";

    if (
      userData.nomRol === "alumno" ||
      userData.nomRol === "relator" ||
      userData.nomRol === "referente" ||
      userData.nomRol === "colaborador"
    ) {
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idPais: idPais,
        idArea: idArea,
        idCargo: idCargo,
        idEmpleado: userData.idEmpleado,
      };
    } else {
      var data = {
        num_boton: num_boton,
        cantidadPorPagina: cantidadPorPagina,
        idPais: idPais,
        idArea: idArea,
        idCargo: idCargo,
        idEmpleado: idEmpleadoFiltro,
      };
    }
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEmpleado(datos.datos);
    });
  }

  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ||
    userData.nomRol === "referente" ||
    userData.nomRol === "colaborador" ||
    userData.nomRol === "alumno" ||
    userData.nomRol === "relator" ? (
      <>
        <Header></Header>
        <br></br>
        <br></br>
        <div id="fondoTabla">
          <div id="containerTablas">
            <h1 id="TitlesPages">Listado de Colaboradores</h1>
            <h6 style={{ color: "gray" }}>
              Factory Devops {"->"} Listado de Colaboradores
            </h6>
            <br></br>
            <div id="selectPaginador">
              {userData.nomRol === "administrador" ? (
                <Button id="btn" onClick={insertarEmpleado}>
                  Insertar Colaborador
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
                <label htmlFor="input_CantidadR">País: </label>
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    setidPais(target.value);
                    setNumBoton(1);
                  }}
                >
                  <option hidden value="" selected>
                    Desplegar lista
                  </option>
                  <option value="">Todos</option>
                  {listPais.map((valor) => (
                    <option value={valor.idPais}>{valor.nomPais}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" id="btn2">
                <label htmlFor="input_CantidadR">Área:</label>
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    setidArea(target.value);
                    setNumBoton(1);
                  }}
                >
                  <option selected hidden value="">
                    Desplegar lista
                  </option>
                  <option value="">Todos</option>
                  {listArea.map((valor) => (
                    <option value={valor.idArea}>{valor.nomArea}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" id="btn2">
                <label htmlFor="input_CantidadR">Cargo:</label>
                <select
                  required
                  type="text"
                  className="form-control"
                  // style={{borderColor:'red'}}
                  onChange={({ target }) => {
                    setidCargo(target.value);
                    setNumBoton(1);
                  }}
                >
                  <option selected hidden value="">
                    Desplegar lista
                  </option>
                  <option value="">Todos</option>
                  {listCargo.map((valor) => (
                    <option value={valor.idCargo}>{valor.nomCargo}</option>
                  ))}
                </select>
              </div>

              {userData.nomRol === "administrador" ||
              userData.nomRol === "gerencia" ||
              userData.nomRol === "people" ? (
                <div className="form-group" id="btn2">
                  <label htmlFor="input_CantidadR">Colaborador: </label>
                  <select
                    required
                    type="text"
                    className="form-control"
                    onChange={({ target }) => {
                      setidEmpleadoFiltro(target.value);
                      setNumBoton(1);
                    }}
                  >
                    <option value="">Todos</option>
                    {listEmpleado.map((valor) => (
                      <option
                        selected={
                          valor.idEmpleado === idEmpleadoFiltro
                            ? "selected"
                            : ""
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

            <InsertarEmpleado
              isActiveEmpleado={isActiveInsertEmpleado}
              cambiarEstado={setIsActiveInsertEmpleado}
              empleado={empleado}
            ></InsertarEmpleado>

            <EditarEmpleados
              isActiveEditEmpleado={isActiveEditEmpleado}
              cambiarEstado={setIsActiveEditEmpleado}
              idEmpleado={idEmpleado}
              nombreTabla={nombreTabla}
              setEmpleado={setEmpleado}
              empleado={empleado}
            ></EditarEmpleados>

            <Table id="mainTable" hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>País</th>
                  <th>Área</th>
                  <th>Cargo</th>
                  <th>Cliente</th>
                  <th>Operaciones</th>
                  {/* <th>Usuario</th> */}
                </tr>
              </thead>
              <tbody>
                {empleado.map((empleado) => (
                  <tr key={empleado.idEmpleado}>
                    <td>{empleado.idEmpleado}</td>
                    <td>{empleado.nomEmpleado}</td>
                    <td>{empleado.correoEmpleado}</td>
                    <td>{empleado.telefonoEmpleado}</td>
                    <td>{empleado.nomPais}</td>
                    <td>{empleado.nomArea}</td>
                    <td width={260}>{empleado.nomCargo}</td>
                    {/* <td>{empleado.usuario}</td> */}
                    <td width={260}>{empleado.nomCliente}</td>

                    <td align="right" width={235}>
                      {userData.nomRol === "administrador" ? (
                        <button
                          data-title="Editar empleado"
                          id="OperationBtns"
                          onClick={() => editarEmpleado(empleado.idEmpleado)}
                        >
                          <RiEditBoxFill id="icons" />
                        </button>
                      ) : null}

                      {userData.nomRol === "administrador" ||
                      userData.nomRol === "gerencia" ||
                      userData.nomRol === "people" ||
                      userData.nomRol === "relator" ? (
                        <Link
                          to={`/listadoRelatorRamo/${empleado.idEmpleado}/0`}
                        >
                          <button
                            data-title="Relator Ramo relacionados"
                            id="OperationBtns"
                          >
                            <BsBookmarksFill id="icons" />
                          </button>
                        </Link>
                      ) : null}

                      {userData.nomRol === "administrador" ||
                      userData.nomRol === "gerencia" ||
                      userData.nomRol === "people" ||
                      userData.nomRol === "referente" ||
                      userData.nomRol === "colaborador" ? (
                        <Link
                          to={`/listadoEDDProyEmp/0/${empleado.idEmpleado}`}
                        >
                          <button
                            data-title="Proy. Colaboradores relacionados"
                            id="OperationBtns"
                          >
                            <AiFillProject id="icons" />
                          </button>
                        </Link>
                      ) : null}

                      {userData.nomRol === "administrador" ||
                      userData.nomRol === "gerencia" ||
                      userData.nomRol === "people" ? (
                        <Link to={`/listadoEmpSubsist/${empleado.idEmpleado}`}>
                          <button
                            data-title="Subsistemas relacionados"
                            id="OperationBtns"
                          >
                            <FaFlipboard id="icons" />
                          </button>
                        </Link>
                      ) : null}

                      {userData.nomRol === "administrador" ? (
                        <button
                          data-title="Desactivar colaborador"
                          onClick={() => desactivar(empleado.idEmpleado)}
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
