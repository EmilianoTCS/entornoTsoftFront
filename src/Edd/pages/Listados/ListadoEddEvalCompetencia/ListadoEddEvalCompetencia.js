import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Navigate } from "react-router-dom";

import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";

import "../TablasStyles.css";
import InsertarEddEvalCompetencia from "../../templates/form/Insertar/InsertarEddEvalCompetencia";
import EditarEddEvalCompetencia from "../../templates/form/Editar/EditarEddEvalCompetencia";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import AuthorizationError from "../../../../templates/alerts/AuthorizationErrorAlert";

export default function ListadoEddEvalCompetencia() {
  const [EddEvalCompetencia, setEddEvalCompetencia] = useState([""]);
  const [
    isActiveInsertEddEvalCompetencia,
    setIsActiveInsertEddEvalCompetencia,
  ] = useState(false);
  const [isActiveEditEddEvalCompetencia, setIsActiveEditEddEvalCompetencia] =
    useState(false);
  const [idEDDEvalCompetencia, setidEDDEvalCompetencia] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "eddevalcompetencia";

  function insertarEddEvalCompetencia() {
    setIsActiveInsertEddEvalCompetencia(!isActiveInsertEddEvalCompetencia);
  }
  function editarEddEvalCompetencia(ID) {
    setIsActiveEditEddEvalCompetencia(!isActiveEditEddEvalCompetencia);
    setidEDDEvalCompetencia(ID);
  }

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/edd_desactivarCompetencia.php";
        var operationUrl = "edd_desactivarCompetencia";
        var data = {
          idCompetencia: ID,
          usuarioModificacion: userData.usuario,
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
    },
    [num_boton, cantidadPorPagina]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoEddEvalCompetencia.php";
    var operationUrl = "listadoEddEvalCompetencia";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEddEvalCompetencia(datos.datos);
    });
  }

  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ? (
      <>
        <Header></Header>
        <br></br>
        <br></br>
        <div id="fondoTabla">
          <div id="containerTablas">
            <h1 id="TitlesPages">Listado de competencias de preguntas</h1>
            <h6 style={{ color: "gray" }}>
              Eval desempeño {"->"} Competencias
            </h6>
            <br></br>

            <div id="selectPaginador">
              {userData.nomRol === "administrador" ? (
                <Button id="btn" onClick={insertarEddEvalCompetencia}>
                  Crear Competencia
                </Button>
              ) : null}

              <div style={{ width: "10em" }} className="form-group" id="btn2">
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
            </div>

            <InsertarEddEvalCompetencia
              isActiveEddEvalCompetencia={isActiveInsertEddEvalCompetencia}
              cambiarEstado={setIsActiveInsertEddEvalCompetencia}
              EddEvalCompetencia={EddEvalCompetencia}
            ></InsertarEddEvalCompetencia>

            <EditarEddEvalCompetencia
              isActiveEditEddEvalCompetencia={isActiveEditEddEvalCompetencia}
              cambiarEstado={setIsActiveEditEddEvalCompetencia}
              idEDDEvalCompetencia={idEDDEvalCompetencia}
              setEddEvalCompetencia={setEddEvalCompetencia}
              EddEvalCompetencia={EddEvalCompetencia}
              nombreTabla={nombreTabla}
            ></EditarEddEvalCompetencia>

            <Table id="mainTable" hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Competencia</th>
                  {userData.nomRol === "administrador" ? (
                    <th>Operaciones</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {EddEvalCompetencia.map((EddEvalCompetencia) => (
                  <tr key={EddEvalCompetencia.idEDDEvalCompetencia}>
                    <td>{EddEvalCompetencia.idEDDEvalCompetencia}</td>
                    <td>{EddEvalCompetencia.nomCompetencia}</td>
                    <td>
                      {userData.nomRol === "administrador" ? (
                        <>
                          <button
                            data-title="Editar competencia"
                            id="OperationBtns"
                            onClick={() =>
                              editarEddEvalCompetencia(
                                EddEvalCompetencia.idEDDEvalCompetencia
                              )
                            }
                          >
                            <RiEditBoxFill id="icons" />
                          </button>

                          <button
                            data-title="Desactivar competencia"
                            onClick={() =>
                              desactivar(
                                EddEvalCompetencia.idEDDEvalCompetencia
                              )
                            }
                            id="OperationBtns"
                          >
                            <BsFillTrashFill id="icons" />
                          </button>
                        </>
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
      <AuthorizationError></AuthorizationError>
    )
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
