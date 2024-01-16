import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";

import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
// import TopAlertsError from "../../../templates/alerts/TopAlerts";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillProject } from "react-icons/ai";
// import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import InsertarAcop from "../../forms/insertar/InsertarAcop";
import EditarAcop from "../../forms/editar/EditarAcop";

export default function IHH_ListadoAcop() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [idProyecto, setidProyecto] = useState("");
  const nombreTabla = "ihhacop";

  const [isActiveBooleans, setIsActiveBooleans] = useState({
    editarAcop: false,
    insertarAcop: false,
  });

  const [idRegistro, setIdRegistro] = useState(0);

  const [mainList, setMainList] = useState({
    proyectos: [""],
  });
  const [auxList, setAuxList] = useState({
    proyectos: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoAcop.php";
    var operationUrl = "ihh_listadoAcop";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idProyecto: idProyecto,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ proyectos: datos.datos });
    });
  };
  const obtenerProyecto = () => {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    var data = {
      idServicio: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setAuxList({ proyectos: data });
    });
  };

  const activarFormulario = (idRegistro, nomOperacion) => {
    setIdRegistro(idRegistro);
    if (nomOperacion === "editar") {
      setIsActiveBooleans((prevDatos) => ({
        ...prevDatos,
        editarAcop: true,
      }));
    }
  };

  useEffect(
    function () {
      obtenerProyecto();
      obtenerDatos();
    },
    [num_boton, idProyecto, cantidadPorPagina]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de ACOPS</h1>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              onClick={() => {
                setIsActiveBooleans({
                  insertarAcop: true,
                });
              }}
            >
              Crear acop
            </Button>

            <InsertarAcop
              isActive={isActiveBooleans.insertarAcop}
              cambiarEstado={setIsActiveBooleans}
            />

            <EditarAcop
              isActive={isActiveBooleans.editarAcop}
              cambiarEstado={setIsActiveBooleans}
              nombreTabla={nombreTabla}
              idRegistro={idRegistro}
            />

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
              <label htmlFor="input_CantidadR">Proyectos activos: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidProyecto(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.proyectos.map((valor) => (
                  <option value={valor.idEDDProyecto}>
                    {valor.nomProyecto}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Proyecto</th>
                <th>Fecha Inicio Proyecto</th>
                <th>Fecha Fin Proyecto</th>
                <th>Presupuesto Total</th>
                <th>Presupuesto Mensual</th>
                <th>Cant. Total Meses</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.proyectos.map((EDDProyecto) => (
                <tr key={EDDProyecto.idAcop}>
                  <td>{EDDProyecto.idAcop}</td>
                  <td>{EDDProyecto.nomProyecto}</td>
                  <td>{EDDProyecto.fechaIniProy}</td>

                  {EDDProyecto.fechaFinProy === null ? (
                    <td>INDEFINIDA </td>
                  ) : (
                    <td> {EDDProyecto.fechaFinProy} </td>
                  )}

                  <td>{EDDProyecto.presupuestoTotal}</td>
                  <td>{EDDProyecto.presupuestoMen}</td>
                  <td>{EDDProyecto.cantTotalMeses}</td>
                  <td>
                    <button
                      data-title="Editar acop"
                      id="OperationBtns"
                      onClick={() =>
                        activarFormulario(EDDProyecto.idAcop, "editar")
                      }
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    {/* <Link to={`/listadoEDDProyEmp/${EDDProyecto.idEDDProyecto}`}>
                    <button
                      data-title="Proy. colaborador relacionados"
                      id="OperationBtns"
                    >
                      <AiFillProject id="icons" />
                    </button>
                  </Link> */}
                    <button
                      data-title="Desactivar acop"
                      onClick={() =>
                        desactivar(EDDProyecto.idAcop, "desactivar")
                      }
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
