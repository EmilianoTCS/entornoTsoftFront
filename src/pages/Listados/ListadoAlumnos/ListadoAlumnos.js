import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { AiFillBook } from "react-icons/ai";
import "../TablasStyles.css";
import InsertarAlumno from "../../../templates/forms/Insertar/InsertarAlumno";
import EditarAlumno from "../../../templates/forms/Editar/EditarAlumno";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

export default function ListadoAlumno() {
  const [alumno, setAlumno] = useState([""]);
  const [isActiveInsertAlumno, setIsActiveInsertAlumno] = useState(false);
  const [idAlumno, setidAlumno] = useState(null);
  const [isActiveEditAlumno, setIsActiveEditAlumno] = useState(false);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  const [idServicio, setidServicio] = useState("");
  const [idPais, setidPais] = useState("");
  const [idArea, setidArea] = useState("");
  const [idCargo, setidCargo] = useState("");
  const [idCurso, setidCurso] = useState("");

  const [listPais, setlistPais] = useState([""]);
  const [listCargo, setlistCargo] = useState([""]);
  const [listArea, setlistArea] = useState([""]);
  const [listServicio, setlistServicio] = useState([""]);
  const [listCurso, setlistCurso] = useState([""]);

  const nombreTabla = "alumno";

  function obtenerCurso() {
    const url = "pages/auxiliares/listadoCursoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCurso(response)
    );
  }

  function obtenerPais() {
    const url = "pages/auxiliares/listadoPaisForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistPais(response));
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

  function obtenerServicio() {
    const url = "pages/auxiliares/listadoServicioForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistServicio(response)
    );
  }
  function insertarAlumno() {
    setIsActiveInsertAlumno(!isActiveInsertAlumno);
  }
  function editarAlumno(ID) {
    setIsActiveEditAlumno(!isActiveEditAlumno);
    setidAlumno(ID);
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
      obtenerPais();
      obtenerCargo();
      obtenerArea();
      obtenerServicio();
      obtenerCurso();
    },
    [num_boton, cantidadPorPagina, idServicio, idArea, idCargo, idPais]
  );

  //PAGINADOR ---------------------
  function handleChangePaginador() {
    var url = "pages/listados/listadoAlumnos.php";
    var operationUrl = "listadoAlumnos";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idPais: idPais,
      idServicio: idServicio,
      idArea: idArea,
      idCargo: idCargo,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setAlumno(datos.datos);
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
          <h1 id="TitlesPages">Listado de alumno</h1>
          <h6 style={{ color: "gray" }}>
            Factory Devops {"->"} Listado de alumno
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={insertarAlumno}>
              Crear Alumno
            </Button>

            <div className="form-group" id="btn2">
              <label htmlFor="input_Cantidad Registros">Cant registros:</label>
              <select
                value={cantidadPorPagina || ""}
                className="form-control"
                name="input_Cantidad Registros"
                id="input_Cantidad Registros"
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
            </div> <div className="form-group" id="btn2">
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
              <label htmlFor="input_CantidadR">Servicios: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidServicio(target.value);
                  setNumBoton(1);
                }}
              >
                <option hidden value="" selected>
                  Desplegar lista
                </option>
                <option value="">Todos</option>
                {listServicio.map((valor) => (
                  <option value={valor.idServicio}>{valor.nomServicio}</option>
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

            
          </div>
          <InsertarAlumno
            isActiveAlumno={isActiveInsertAlumno}
            cambiarEstado={setIsActiveInsertAlumno}
            alumno={alumno}
          ></InsertarAlumno>

          <EditarAlumno
            isActiveEditAlumno={isActiveEditAlumno}
            cambiarEstado={setIsActiveEditAlumno}
            idAlumno={idAlumno}
            nombreTabla={nombreTabla}
            setAlumno={setAlumno}
            alumno={alumno}
          ></EditarAlumno>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Alumno</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>País</th>
                <th>Servicio</th>
                <th>Área</th>

                <th>Cargo</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {alumno.map((alumno) => (
                <tr key={alumno.idAlumno}>
                  <td>{alumno.idAlumno}</td>
                  <td>{alumno.nomAlumno}</td>
                  <td>{alumno.correoAlumno}</td>
                  <td>{alumno.telefonoAlumno}</td> 
                  <td>{alumno.nomPais}</td>
                  <td>{alumno.nomServicio}</td>
                  <td>{alumno.nomArea}</td>
                  <td>{alumno.nomCargo}</td>
                  <td align="right" width={150}>
                    <button
                      title="Editar alumno"
                      id="OperationBtns"
                      onClick={() => editarAlumno(alumno.idAlumno)}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>

                    <Link to={`/listadoCursoAlumnos/${alumno.idAlumno}`}>
                      <button title="Cursos relacionados" id="OperationBtns">
                        <AiFillBook id="icons" />
                      </button>
                    </Link>
                    <button
                      title="Desactivar alumno"
                      onClick={() => desactivar(alumno.idAlumno)}
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
