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
import InsertarFormProyEmp from "./Formularios/InsertarFormProyEmp";
import EditarFormProyEmp from "./Formularios/EditarFormProyEmp";

export default function OI_listadoFormProyEmp() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [filtros, setFiltros] = useState({
    idFormulario: "",
    idEDDProyEmp: "",
  });

  const [booleanos, setBooleanos] = useState({
    isActiveInsertar: false,
    isActiveEditar: false,
  });

  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [datosFila, setDatosFila] = useState([]);

  const [mainList, setMainList] = useState({
    formProyEmp: [""],
  });
  const [auxList, setAuxList] = useState({
    listadoFormularios: [""],
    listadoEddProyEmp: [""],
  });
  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/oi_listadoFormProyEmp.php";
    var operationUrl = "oi_listadoFormProyEmp";
    var data = {
      idFormulario: filtros.idFormulario,
      idEDDProyEmp: filtros.idEDDProyEmp,
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { paginador, ...datos } = response;
      setCantidadPaginas(paginador.cantPaginas);      
      setMainList({ formProyEmp: datos.datos });
    });
  };
  const obtenerFormularios = () => {
    var url = "pages/listados/oi_listadoFormulario.php";
    var operationUrl = "oi_listadoFormulario";
    var data = {
      num_boton: 1,
      cantidadPorPagina: 999999999,
    };
    SendDataService(url, operationUrl, data).then((response) => {      
      const { paginador, ...datos } = response;
      setAuxList((prev) => ({
        ...prev,
        listadoFormularios: datos.datos,
      }));
    });
  };
  const obtenerProyEmp = () => {
    var url = "pages/auxiliares/listadoEddProyEmp.php";
    var operationUrl = "listados";
    var data = {
      idProyecto: 0,
    };

    SendDataService(url, operationUrl, data).then((response) => {
      setAuxList((prev) => ({
        ...prev,
        listadoEddProyEmp: response,
      }));
    });
  };

  const desactivar = (ID) => {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/oi_desactivarFormProyEmp.php";
        var operationUrl = "oi_desactivarFormProyEmp";
        var data = {
          idFormProyEmp: ID,
          usuarioModificacion: userData.usuario,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        });
      }
    });
  };
  useEffect(
    function () {
      obtenerDatos();
      obtenerFormularios();
      obtenerProyEmp();
    },
    [num_boton, cantidadPorPagina, filtros]
  );

  return userData.statusConected || userData !== null ? (
    <>
      {booleanos.isActiveInsertar && (
        <InsertarFormProyEmp
          cambiarEstado={setBooleanos}
          isActive={booleanos.isActiveInsertar}
        />
      )}
      {booleanos.isActiveEditar && (
        <EditarFormProyEmp
          cambiarEstado={setBooleanos}
          datosFila={datosFila}
          isActive={booleanos.isActiveEditar}
        ></EditarFormProyEmp>
      )}
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">
            Listado de formularios de colaboradores y proyectos
          </h1>
          <h6 style={{ color: "gray" }}>
            Operaciones internas {"->"} Listado de formularios de colaboradores
            y proyectos
          </h6>
          <br></br>

          <div id="selectPaginador" style={{ maxWidth: "1300px" }}>
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
              Crear registro
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
                <label htmlFor="lbl_select_acop">Formulario:</label>
                <select
                  value={filtros.idFormulario || ""}
                  className="form-control"
                  name="input_listadoOperacionesInternas"
                  id="input_listadoOperacionesInternas"
                  onChange={({ target }) => {
                    setFiltros((prev) => ({
                      ...prev,
                      idFormulario: target.value,
                    }));
                  }}
                  required
                >
                  <option value="">Todos</option>
                  {auxList.listadoFormularios.map((item) => (
                    <option
                      key={item.idFormulario}
                      selected={
                        filtros.idFormulario === item.idFormulario
                          ? true
                          : false
                      }
                      value={item.idFormulario}
                    >
                      {item.nomFormulario}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="cl_slct_acop">
              <div className="form-group" id="btn2">
                <label htmlFor="input_CantidadRegistros">
                  Proyecto - Colab:
                </label>
                <select
                  value={filtros.idEDDProyEmp || ""}
                  className="form-control"
                  onChange={({ target }) => {
                    setFiltros((prev) => ({
                      ...prev,
                      idEDDProyEmp: target.value,
                    }));
                  }}
                  required
                >
                  <option value="">Todos</option>
                  {auxList.listadoEddProyEmp.map((item) => (
                    <option
                      key={item.idEDDProyEmp}
                      selected={
                        filtros.idEDDProyEmp === item.idEDDProyEmp
                          ? true
                          : false
                      }
                      value={item.idEDDProyEmp}
                    >
                      {item.nomProyEmp}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>Formulario</th>
                <th>Proyecto</th>
                <th>Colaborador</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.formProyEmp.map((item) => (
                <tr key={item.idFormProyEmp}>
                  <td>{item.nomFormulario}</td>
                  <td>{item.nomProyecto}</td>
                  <td>{item.nomEmpleado}</td>
                  <td>
                    <button
                      data-title="Editar registro"
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
                      data-title="Desactivar registro"
                      onClick={() => desactivar(item.idFormEddProyEmp)}
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
