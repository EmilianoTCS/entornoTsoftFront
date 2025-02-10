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
import InsertarAsignacionColab from "./Formularios/InsertarMotivoEstandar";
import EditarMotivoEstandar from "./Formularios/EditarMotivoEstandar";

export default function OI_listadoMotivosEstandar() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [filtros, setFiltros] = useState({
    tipo: "",
  });

  const [booleanos, setBooleanos] = useState({
    isActiveInsertar: false,
    isActiveEditar: false,
  });

  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [datosFila, setDatosFila] = useState([]);

  const [mainList, setMainList] = useState({
    listadoMotivos: [""],
  });
  const [auxList, setAuxList] = useState({
    listadoTipoMotivo: [""],
  });
  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/oi_listadoMotivosEstandar.php";
    var operationUrl = "oi_listadoMotivosEstandar";
    var data = {
      tipo: filtros.tipo,
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ listadoMotivos: datos.datos });
    });
  };

  const obtenerConfDatos = () => {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "OI",
      subTipoConfDato: "TIPO_MOTIVO",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setAuxList({
        listadoTipoMotivo: response,
      });
    });
  };

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/oi_desactivarMotivoEstandar.php";
        var operationUrl = "oi_desactivarMotivoEstandar";
        var data = {
          idMotivo: ID,
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
      obtenerConfDatos();
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
      {
        booleanos.isActiveEditar && (
          <EditarMotivoEstandar 
          cambiarEstado={setBooleanos}
          datosFila={datosFila}
          isActive={booleanos.isActiveEditar}
          />
        )
      }
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de motivos estándar</h1>
          <h6 style={{ color: "gray" }}>
            Operaciones internas {"->"} Listado de motivos estándar
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
              Crear motivo estándar
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
                <label htmlFor="lbl_select_acop">Tipo:</label>
                <select
                  value={filtros.tipo || ""}
                  className="form-control"
                  name="input_listadoOperacionesInternas"
                  id="input_listadoOperacionesInternas"
                  onChange={({ target }) => {
                    setFiltros((prev) => ({
                      ...prev,
                      tipo: target.value,
                    }));
                  }}
                  required
                >
                  <option value="">Todos</option>
                  {auxList.listadoTipoMotivo.map((item) => (
                    <option key={item.datoVisible} value={item.datoVisible}>
                      {item.datoVisible}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>Motivo</th>
                <th>Tipo</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {mainList.listadoMotivos.map((item) => (
                <tr key={item.idMotivo}>
                  <td title={item.nombreMotivo} className="td_con_hover">
                    {item.nombreMotivo}
                  </td>
                  <td>{item.tipo}</td>
                  <td>{item.descripcion}</td>
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
                      onClick={() => desactivar(item.idMotivo)}
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
