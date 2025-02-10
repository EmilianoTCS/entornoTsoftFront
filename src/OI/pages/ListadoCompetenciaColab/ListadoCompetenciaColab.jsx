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
import InsertarAsignacionColab from "./Formularios/InsertarCompetenciaColab";
import EditarAsignacionColab from "./Formularios/EditarCompetenciaColab";

export default function OI_listadoCompetenciaColab() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [filtros, setFiltros] = useState({
    idEmpleado: "",
    idCompetencia: "",
  });

  const [booleanos, setBooleanos] = useState({
    isActiveInsertar: false,
    isActiveEditar: false,
  });

  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [datosFila, setDatosFila] = useState([]);

  const [mainList, setMainList] = useState({
    competenciasColab: [""],
  });
  const [auxList, setAuxList] = useState({
    listadoEmpleados: [""],
    listadoCompetencias: [""],
  });
  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/oi_listadoCompetenciaColab.php";
    var operationUrl = "oi_listadoCompetenciaColab";
    var data = {
      idEmpleado: filtros.idEmpleado,
      idCompetencia: filtros.idCompetencia,
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      console.log(datos);

      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ competenciasColab: datos.datos });
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
  const obtenerCompetencias = () => {
    const url = "pages/auxiliares/listadoEddEvalCompetencia.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoCompetencias: response,
      }));
    });
  };

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/oi_desactivarCompetenciaColab.php";
        var operationUrl = "oi_desactivarCompetenciaColab";
        var data = {
          idCompetenciaColab: ID,
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
      obtenerCompetencias();
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
        <EditarAsignacionColab
          cambiarEstado={setBooleanos}
          datosFila={datosFila}
          isActive={booleanos.isActiveEditar}
        ></EditarAsignacionColab>
      )}
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de competencias de colaboradores</h1>
          <h6 style={{ color: "gray" }}>
            Operaciones internas {"->"} Listado de competencias de colaboradores
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              style={{ whiteSpace: "nowrap" }}
              onClick={() => {
                setBooleanos((prevDatos) => ({
                  ...prevDatos,
                  isActiveInsertar: true,
                }));
              }}
              
            >
              Crear competencia - colaborador
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
                <label htmlFor="input_CantidadRegistros">Competencia:</label>
                <select
                  value={filtros.idCompetencia || ""}
                  className="form-control"
                  onChange={({ target }) => {
                    setFiltros((prev) => ({
                      ...prev,
                      idCompetencia: target.value,
                    }));
                  }}
                  required
                >
                  <option value="">Todas</option>
                  {auxList.listadoCompetencias.map((item) => (
                    <option
                      key={item.idEDDEvalCompetencia}
                      selected={
                        filtros.idCompetencia === item.idEDDEvalCompetencia
                      }
                      value={item.idEDDEvalCompetencia}
                    >
                      {item.nomCompetencia}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Competencia</th>
                <th style={{ width: "110px" }} align="right">
                  Porcentaje
                </th>
              </tr>
            </thead>
            <tbody>
              {mainList.competenciasColab.map((item) => (
                <tr key={item.idCompetenciaColab}>
                  <td>{item.nomEmpleado}</td>
                  <td>{item.nomCompetencia}</td>
                  <td>{item.porcentaje}</td>
                  <td>
                    <button
                      data-title="Editar competencia - colab"
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
                      data-title="Desactivar competencia - colab"
                      onClick={() => desactivar(item.idCompetenciaColab)}
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
