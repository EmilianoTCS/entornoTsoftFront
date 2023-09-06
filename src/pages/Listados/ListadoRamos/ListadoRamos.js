import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { RiEditBoxFill } from "react-icons/ri";
import { IoIosMegaphone } from "react-icons/io";
import { BsPenFill } from "react-icons/bs";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BsFillTrashFill } from "react-icons/bs";

import { useRoute } from "wouter";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import "../TablasStyles.css";

import InsertarRamo from "../../../templates/forms/Insertar/InsertarRamo";
import EditarRamo from "../../../templates/forms/Editar/EditarRamo";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import "../InsertarCursoListadoCursosYRamos.css";
import Button from "react-bootstrap/Button";
import Paginador from "../../../templates/Paginador/Paginador";

export default function ListadoRamos() {
  const [, params] = useRoute("/listadoRamos/:params");
  const [ramos, setRamos] = useState([""]);
  const [isActiveInsertRamo, setIsActiveInsertRamo] = useState(false);
  const [isActiveEditRamo, setIsActiveEditRamo] = useState(false);
  const [idRamo, setidRamo] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [num_boton, setNumBoton] = useState(1);
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  const [idCurso, setidCurso] = useState(params.params);

  const [listCurso, setlistCurso] = useState([""]);

  const nombreTabla = "ramo";

  function obtenerCurso() {
    const url = "pages/auxiliares/listadoCursoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCurso(response)
    );
  }

  function editarRamo(ID) {
    setIsActiveEditRamo(!isActiveEditRamo);
    setidRamo(ID);
  }
  function insertarRamo() {
    setIsActiveInsertRamo(!isActiveInsertRamo);
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
      obtenerCurso();
    },
    [num_boton, cantidadPorPagina, idCurso]
  );

  function handleChangePaginador() {
    var url = "pages/listados/listadoRamos.php";
    var operationUrl = "listadoRamos";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idCurso: idCurso,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setRamos(datos.datos);
      console.log(data);
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
          <h1 id="TitlesPages">Listado de ramos</h1>
          <h6 style={{ color: "gray" }}>
            Factory Devops {"->"} Listado de Ramos
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn1" onClick={insertarRamo}>
              Crear Ramo
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
              <label htmlFor="input_CantidadR">Cursos: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidCurso(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {listCurso.map((valor) => (
                  <option
                    selected={valor.idCurso === idCurso ? "selected" : ""}
                    value={valor.idCurso}
                  >
                    {valor.nomCurso}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <InsertarRamo
            isActiveRamo={isActiveInsertRamo}
            cambiarEstado={setIsActiveInsertRamo}
            ramos={ramos}
          ></InsertarRamo>
          <EditarRamo
            isActiveEditRamo={isActiveEditRamo}
            cambiarEstado={setIsActiveEditRamo}
            idRamo={idRamo}
            setRamos={setRamos}
            ramos={ramos}
            nombreTabla={nombreTabla}
          ></EditarRamo>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Ramo</th>
                <th>Tipo</th>
                <th>Tipo horario</th>
                <th>Duración</th>
                <th>Cant sesiones</th>
                <th>Curso</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {ramos.map((ramos) => (
                <tr key={ramos.idRamo}>
                  <td align="right" width={1}>
                    {ramos.idRamo}
                  </td>
                  <td>{ramos.codRamo}</td>
                  <td>{ramos.nomRamo}</td>
                  <td>{ramos.tipoRamo}</td>
                  <td>{ramos.tipoRamoHH}</td>
                  <td align="right" width={1}>
                    {ramos.duracionRamoHH}
                  </td>
                  <td align="right" width={30}>
                    {ramos.cantSesionesRamo}
                  </td>
                  <td>{ramos.nomCurso}</td>
                  <td>
                    <button
                      data-title="Editar ramo"
                      id="OperationBtns"
                      onClick={() => editarRamo(ramos.idRamo)}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>

                    <Link to={`/listadoSesiones/${ramos.idRamo}`}>
                      <button data-title="Sesiones relacionados" id="OperationBtns">
                        <IoIosMegaphone id="icons" />
                      </button>
                    </Link>

                    <Link to={`/listadoRamoExamen/${ramos.idRamo}`}>
                      <button data-title="Examen relacionados" id="OperationBtns">
                        <BsPenFill id="icons" />
                      </button>
                    </Link>

                    <Link to={`/listadoRelatorRamo/${ramos.idRamo}`}>
                      <button data-title="Relatores relacionados" id="OperationBtns">
                        <BsFillPersonLinesFill id="icons" />
                      </button>
                    </Link>

                    <button
                      data-title="Desactivar curso"
                      id="OperationBtns"
                      onClick={() => desactivar(ramos.idRamo)}
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
