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
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import InsertarAsignacionColab from "./Formularios/InsertarMovimientoTsoft";
import EditarMovimientoTsoft from "./Formularios/EditarMovimientoTsoft";

export default function OI_ListadoMovimientoTsoft() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [filtros, setFiltros] = useState({
    idEmpleado: "",
    idMotivo: "",
    fechaIni: "",
    fechaFin: "",
  });

  const [booleanos, setBooleanos] = useState({
    isActiveInsertar: false,
    isActiveEditar: false,
  });

  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [datosFila, setDatosFila] = useState([]);

  const [mainList, setMainList] = useState({
    movimientoTsoft: [""],
  });
  const [auxList, setAuxList] = useState({
    listadoEmpleados: [""],
    listadoMotivos: [""],
  });
  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/oi_listadoMovimientoTsoft.php";
    var operationUrl = "oi_listadoMovimientoTsoft";
    var data = {
      idEmpleado: filtros.idEmpleado,
      idMotivo: filtros.idMotivo,
      fechaIni: filtros.fechaIni,
      fechaFin: filtros.fechaFin,
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    console.log(data);

    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      console.log(datos);

      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ movimientoTsoft: datos.datos });
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
  const obtenerMotivos = () => {
    const url = "pages/listados/oi_listadoMotivosEstandar.php";
    const operationUrl = "oi_listadoMotivosEstandar";
    let data = {
      tipo: "",
      num_boton: 1,
      cantidadPorPagina: "999999999",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoMotivos: response.datos,
      }));
    });
  };

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/oi_desactivarMovimientoTsoft.php";
        var operationUrl = "oi_desactivarMovimientoTsoft";
        var data = {
          idMovimiento: ID,
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
      obtenerMotivos();
    },
    [num_boton, cantidadPorPagina, filtros]
  );

  return userData.statusConected || userData !== null ? (
    <>
      {booleanos.isActiveInsertar && (
        <InsertarAsignacionColab
          cambiarEstado={setBooleanos}
          isActive={booleanos.isActiveInsertar}
        />
      )}
      {booleanos.isActiveEditar && (
        <EditarMovimientoTsoft
          cambiarEstado={setBooleanos}
          isActive={booleanos.isActiveEditar}
          datosFila={datosFila}
        />
      )}
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">
            Listado de movimientos de colaboradores en TSOFT
          </h1>
          <h6 style={{ color: "gray" }}>
            Operaciones internas {"->"} Listado de movimientos de colaboradores
            en TSOFT
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              style={{ whiteSpace: "nowrap", width: "230px" }}
              onClick={() => {
                setBooleanos((prevDatos) => ({
                  ...prevDatos,
                  isActiveInsertar: true,
                }));
              }}
            >
              Crear movimiento
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
                <label htmlFor="lbl_select_acop">Colaborador:</label>
                <select
                  value={filtros.idEmpleado || ""}
                  className="form-control"
                  name="input_listadoOperacionesInternas"
                  id="input_listadoOperacionesInternas"
                  onChange={({ target }) => {
                    setFiltros((prev) => ({
                      ...prev,
                      idEmpleado: target.value,
                    }));
                  }}
                  required
                >
                  <option value="">Todos</option>
                  {auxList.listadoEmpleados.map((item) => (
                    <option
                      key={item.idEmpleado}
                      selected={
                        filtros.idEmpleado === item.idEmpleado ? true : false
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
                <label htmlFor="input_CantidadRegistros">Motivo:</label>
                <select
                  value={filtros.idMotivo || ""}
                  className="form-control"
                  onChange={({ target }) => {
                    setFiltros((prev) => ({ ...prev, motivo: target.value }));
                  }}
                  required
                >
                  <option value="">Todos</option>
                  {auxList.listadoMotivos.map((item) => (
                    <option
                      key={item.idMotivo}
                      selected={
                        filtros.idMotivo === item.idMotivo ? true : false
                      }
                      value={item.idMotivo}
                    >
                      {item.nombreMotivo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="lbl_select_acop">Fecha fin:</label>
              <input
                type="date"
                lang="es-CL"
                value={filtros.fechaIni}
                className="form-control"
                onChange={(e) => {
                  setFiltros((prev) => ({
                    ...prev,
                    fechaIni: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="lbl_select_acop">Fecha fin:</label>
              <input
                type="date"
                lang="es-CL"
                className="form-control"
                value={filtros.fechaFin}
                onChange={(e) => {
                  setFiltros((prev) => ({
                    ...prev,
                    fechaFin: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Motivo</th>
                <th style={{ width: "110px" }} align="right">
                  Fecha inicio
                </th>
                <th style={{ width: "110px" }} align="right">
                  Fecha fin
                </th>
              </tr>
            </thead>
            <tbody>
              {mainList.movimientoTsoft.map((item) => (
                <tr key={item.idEmpleado}>
                  <td>{item.nomEmpleado}</td>
                  <td title={item.nombreMotivo} className="td_con_hover">
                    {item.nombreMotivo}
                  </td>
                  <td>{item.fechaIni}</td>
                  <td>{item.fechaFin}</td>

                  <td>
                    <button
                      data-title="Editar motivo"
                      id="OperationBtns"
                      onClick={() => {
                        setDatosFila(item);
                        setBooleanos((prev) => ({
                          ...prev,
                          isActiveEditar: true,
                        }));
                      }}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    <button
                      data-title="Desactivar motivo"
                      onClick={() => desactivar(item.idMovimientoColabTsoft)}
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
