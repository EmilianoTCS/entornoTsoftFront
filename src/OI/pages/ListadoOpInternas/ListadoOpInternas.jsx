import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import InsertarEstadoColab from "./Formularios/InsertarEstadoColab";
import EditarEstadoColab from "./Formularios/EditarEstadoColab ";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import DetalleColaborador from "./Formularios/DetalleColaborador/DetalleColaborador";
import { HiEye } from "react-icons/hi";

export default function OI_listadoOpInternas() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [filtros, setFiltros] = useState({
    usuario: "",
    cargo: "",
    disponibilidad: "",
  });

  const [booleanos, setBooleanos] = useState({
    isActiveInsertarEstado: false,
    isActiveEditarEstado: false,
    isActiveDetalleColaborador: false,
  });

  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [datosFila, setDatosFila] = useState([]);

  const [mainList, setMainList] = useState({
    operacionesInternas: [""],
  });
  const [auxList, setAuxList] = useState({
    listadoEmpleados: [""],
    listadoCargos: [""],
  });
  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/oi_listadoOperacionesInternas.php";
    var operationUrl = "oi_listadoOperacionesInternas";
    var data = {
      usuario: filtros.usuario,
      cargo: filtros.cargo,
      disponibilidad: filtros.disponibilidad,
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    console.log(data);
    
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ operacionesInternas: datos.datos });
    });
  };
  const obtenerEmpleados = () => {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoEmpleados: data,
      }));
    });
  };
  const obtenerCargo = () => {
    const url = "pages/auxiliares/listadoCargoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoCargos: response,
      }));
    });
  };

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/oi_desactivarEstadoColab.php";
        var operationUrl = "oi_desactivarEstadoColab";
        var data = {
          idEstadoColaborador: ID,
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
      obtenerDatos();
      obtenerEmpleados();
      obtenerCargo();
    },
    [num_boton, cantidadPorPagina, filtros]
  );

  return userData.statusConected || userData !== null ? (
    <>
      {booleanos.isActiveInsertarEstado && (
        <InsertarEstadoColab
          isActive={booleanos.isActiveInsertarEstado}
          cambiarEstado={setBooleanos}
        />
      )}
      {booleanos.isActiveEditarEstado && (
        <EditarEstadoColab
          cambiarEstado={setBooleanos}
          datosFila={datosFila}
          isActive={booleanos.isActiveEditarEstado}
        />
      )}
      {booleanos.isActiveDetalleColaborador && (
        <DetalleColaborador
          cambiarEstado={setBooleanos}
          datosFila={datosFila}
          isActive={booleanos.isActiveDetalleColaborador}
        />
      )}
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de operaciones internas</h1>
          <h6 style={{ color: "gray" }}>
            Operaciones internas {"->"} Listado de operaciones internas
          </h6>
          <br></br>

          <div id="selectPaginador" style={{maxWidth: "1300px"}}>
            <Button
              id="btn"
              style={{ whiteSpace: "nowrap", width: "230px" }}
              onClick={() => {
                setBooleanos((prevDatos) => ({
                  ...prevDatos,
                  isActiveInsertarEstado: true,
                }));
              }}
            >
              Crear estado
            </Button>
            <div
              className="form-group"
              id="btn2"
              style={{ whiteSpace: "nowrap", width: "230px" }}
            >
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

            <div className="cl_slct_acop">
              <div className="form-group" id="btn2">
                <label htmlFor="lbl_select_acop">
                  Seleccione un colaborador:
                </label>
                <select
                  value={filtros.usuario || ""}
                  className="form-control"
                  name="input_listadoOperacionesInternas"
                  id="input_listadoOperacionesInternas"
                  onChange={({ target }) => {
                    setFiltros((prev) => ({ ...prev, usuario: target.value }));
                  }}
                  required
                >
                  <option value="">Todos</option>
                  {auxList.listadoEmpleados.map((item) => (
                    <option
                      key={item.idEmpleado}
                      selected={
                        filtros.usuario === item.idEmpleado ? true : false
                      }
                      value={item.idEmpleado}
                    >
                      {item.nomEmpleado}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="cl_slct_acop">
              <div className="form-group" id="btn2">
                <label htmlFor="input_CantidadRegistros">
                  Seleccione un cargo:
                </label>
                <select
                  value={filtros.cargo || ""}
                  className="form-control"
                  onChange={({ target }) => {
                    setFiltros((prev) => ({ ...prev, cargo: target.value }));
                  }}
                  required
                >
                  <option value="">Todos</option>
                  {auxList.listadoCargos.map((item) => (
                    <option
                      key={item.idCargo}
                      selected={filtros.cargo === item.idCargo ? true : false}
                      value={item.idCargo}
                    >
                      {item.nomCargo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="cl_slct_acop">
              <div className="form-group" id="btn2">
                <label htmlFor="input_CantidadRegistros">
                  Seleccione disponibilidad:
                </label>
                <select
                  value={filtros.disponibilidad || ""}
                  className="form-control"
                  onChange={({ target }) => {
                    setFiltros((prev) => ({
                      ...prev,
                      disponibilidad: target.value,
                    }));
                  }}
                  required
                >
                  <option value="">Todos</option>
                  <option value="SÍ">SÍ</option>
                  <option value="NO">NO</option>
                </select>
              </div>
            </div>
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Cargo</th>
                <th>Último cliente</th>
                <th style={{ width: "70px" }} align="right">
                  % EDD
                </th>
                <th>Disp</th>
                <th>Licencia</th>
                <th style={{ width: "110px" }} align="right">
                  Fecha inicio
                </th>
                <th style={{ width: "110px" }} align="right">
                  Fecha fin
                </th>
                <th>Observaciones</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.operacionesInternas.map((item) => (
                <tr key={item.idEmpleado}>
                  <td>{item.nomEmpleado}</td>
                  <td title={item.nomCargo} className="td_con_hover">
                    {item.nomCargo}
                  </td>
                  <td title={item.nomCliente} className="td_con_hover">
                    {item.nomCliente}
                  </td>
                  <td>{item.porcAprobEDD}</td>
                  <td>{item.disponibilidad}</td>
                  <td title={item.nomElemento} className="td_con_hover">
                    {item.nomElemento}
                  </td>
                  <td>{item.fechaIni}</td>
                  <td>{item.fechaFin}</td>
                  <td title={item.observaciones} className="td_con_hover">
                    {item.observaciones}
                  </td>

                  <td>
                    <button
                      data-title="Editar estado"
                      id="OperationBtns"
                      onClick={() => {
                        setDatosFila(item);
                        setBooleanos((prev) => ({
                          ...prev,
                          isActiveEditarEstado: true,
                        }));
                      }}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    <button
                      data-title="Desactivar estado"
                      onClick={() => desactivar(item.idEstadoColaborador)}
                      id="OperationBtns"
                    >
                      <BsFillTrashFill id="icons" />
                    </button>
                    <button
                      data-title="Detalle de colaborador"
                      id="OperationBtns"
                      onClick={() => {
                        setDatosFila(item);
                        setBooleanos((prev) => ({
                          ...prev,
                          isActiveDetalleColaborador: true,
                        }));
                      }}
                    >
                      <HiEye id="icons" />
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
