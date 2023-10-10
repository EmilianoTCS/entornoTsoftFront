import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate,Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillKeyFill,BsFillTrashFill } from "react-icons/bs";

import "../TablasStyles.css";
import InsertarEddEvalCompetencia from "../../templates/form/Insertar/InsertarEddEvalCompetencia";
import EditarEddEvalCompetencia from "../../templates/form/Editar/EditarEddEvalCompetencia";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoEddEvalCompetencia() {
  const [EddEvalCompetencia, setEddEvalCompetencia] = useState([""]);
  const [isActiveInsertEddEvalCompetencia, setIsActiveInsertEddEvalCompetencia] = useState(false);
  const [isActiveEditEddEvalCompetencia, setIsActiveEditEddEvalCompetencia] = useState(false);
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
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de competencias de preguntas</h1>
          <h6 style={{color:'gray'}}>Eval desempeño {'->'} Competencias</h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarEddEvalCompetencia}>
              Crear Competencia
            </Button>

            <div   style={{width:'10em'}} className="form-group" id="btn2">
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
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {EddEvalCompetencia.map((EddEvalCompetencia) => (
                <tr key={EddEvalCompetencia.idEDDEvalCompetencia}>
                  <td>{EddEvalCompetencia.idEDDEvalCompetencia}</td>
                  <td>{EddEvalCompetencia.nomCompetencia}</td>
                  <td>
                    <button
                      data-title="Editar competencia"
                      id="OperationBtns"
                      onClick={() => editarEddEvalCompetencia(EddEvalCompetencia.idEDDEvalCompetencia)}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>


                    <button
                      data-title="Desactivar competencia"
                      onClick={() => desactivar(EddEvalCompetencia.idEDDEvalCompetencia)}
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
