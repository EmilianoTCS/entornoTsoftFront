import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { ImSortNumbericDesc } from "react-icons/im";
import "../TablasStyles.css";
import InsertarRamoExamen from "../../../templates/forms/Insertar/InsertarRamoExamen";
import EditarRamoExamen from "../../../templates/forms/Editar/EditarRamoExamen";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";

export default function ListadoRamoExamen() {
  const [, params] = useRoute("/listadoRamoExamen/:params");
  const [ramoExamen, setRamoExamen] = useState([""]);
  const [isActiveInsertRamoExamen, setIsActiveInsertRamoExamen] =
    useState(false);
  const [idRamoExamen, setidRamoExamen] = useState(null);
  const [isActiveEditRamoExamen, setIsActiveEditRamoExamen] = useState(false);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "ramoexamen";

  const [idRamo, setidRamo] = useState(params.params);

  const [listRamo, setlistRamo] = useState([""]);

  function obtenerRamo() {
    const url = "pages/auxiliares/listadoRamoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistRamo(response));
  }

  function insertarRamoExamen() {
    setIsActiveInsertRamoExamen(!isActiveInsertRamoExamen);
  }
  function editarRamoExamen(ID) {
    setIsActiveEditRamoExamen(!isActiveEditRamoExamen);
    setidRamoExamen(ID);
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
      obtenerRamo();
    },
    [num_boton, cantidadPorPagina, idRamo]
  );

  //PAGINADOR ---------------------
  function handleChangePaginador() {
    var url = "pages/listados/listadoRamoExamen.php";
    var operationUrl = "listadoRamoExamen";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idRamo: idRamo,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setRamoExamen(datos.datos);
    });
  }
  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ||
    userData.nomRol === "relator" ? (
      <>
        <Header></Header>
        <br></br>
        <br></br>
        <div id="fondoTabla">
          <div id="containerTablas">
            <h1 id="TitlesPages">Listado de Ramos Examenes</h1>
            <h6 style={{ color: "gray" }}>
              Factory Devops {"->"} Listado de Ramo Examenes
            </h6>
            <br></br>

            <div id="selectPaginador">
              {userData.nomRol === "administrador" ? (
                <Button id="btn" onClick={insertarRamoExamen}>
                  Crear Examen
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
                <label htmlFor="input_CantidadR">Ramos: </label>
                <select
                  required
                  type="text"
                  className="form-control"
                  onChange={({ target }) => {
                    setidRamo(target.value);
                    setNumBoton(1);
                  }}
                >
                  <option value="">Todos</option>
                  {listRamo.map((valor) => (
                    <option
                      selected={valor.idRamo === idRamo ? "selected" : ""}
                      value={valor.idRamo}
                    >
                      {valor.nomRamo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <InsertarRamoExamen
              isActiveRamoExamen={isActiveInsertRamoExamen}
              cambiarEstado={setIsActiveInsertRamoExamen}
              ramoExamen={ramoExamen}
            ></InsertarRamoExamen>

            <EditarRamoExamen
              isActiveEditRamoExamen={isActiveEditRamoExamen}
              cambiarEstado={setIsActiveEditRamoExamen}
              idRamoExamen={idRamoExamen}
              setRamoExamen={setRamoExamen}
              ramoExamen={ramoExamen}
              nombreTabla={nombreTabla}
            ></EditarRamoExamen>

            <Table id="mainTable" hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Examen</th>
                  <th>Fecha examen</th>
                  <th>Ramo</th>
                  <th>Operaciones</th>
                </tr>
              </thead>
              <tbody>
                {ramoExamen.map((ramoExamen) => (
                  <tr key={ramoExamen.idRamoExamen}>
                    <td>{ramoExamen.idRamoExamen}</td>
                    <td>{ramoExamen.nomExamen}</td>
                    <td>{ramoExamen.fechaExamen}</td>
                    <td>{ramoExamen.nomRamo}</td>
                    <td>
                      {userData.nomRol === "administrador" ? (
                        <button
                          data-title="Editar ramoExamen"
                          id="OperationBtns"
                          onClick={() =>
                            editarRamoExamen(ramoExamen.idRamoExamen)
                          }
                        >
                          <RiEditBoxFill id="icons" />
                        </button>
                      ) : null}

                      <Link
                        to={`/listadoNotaExamen/${ramoExamen.idRamoExamen}`}
                      >
                        <button
                          data-title="Notas relacionadas"
                          id="OperationBtns"
                        >
                          <ImSortNumbericDesc id="icons" />
                        </button>
                      </Link>
                      {userData.nomRol === "administrador" ? (
                        <button
                          data-title="Desactivar ramoExamen"
                          onClick={() => desactivar(ramoExamen.idRamoExamen)}
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
