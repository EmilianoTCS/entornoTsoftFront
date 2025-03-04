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

import InsertarDocColab from "./Formularios/InsertarDocColab";
import EditarDocColab from "./Formularios/EditarDocColab";

export default function OI_listadoDocColab() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [filtros, setFiltros] = useState({
    idEmpleado: "",
  });

  const [booleanos, setBooleanos] = useState({
    isActiveInsertar: false,
    isActiveEditar: false,
  });

  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [datosFila, setDatosFila] = useState([]);

  const [mainList, setMainList] = useState({
    documentosColab: [""],
  });
  const [auxList, setAuxList] = useState({
    listadoEmpleados: [""],
  });
  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/oi_listadoDocColaborador.php";
    var operationUrl = "oi_listadoDocColaborador";
    var data = {
      idEmpleado: filtros.idEmpleado,
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      console.log(datos.datos);

      setMainList({ documentosColab: datos.datos });
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

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/oi_desactivarDocColab.php";
        var operationUrl = "oi_desactivarDocColab";
        var data = {
          idDocumento: ID,
          usuarioModificacion: userData.usuario,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        });
      }
    });
  }

  const descargarArchivo = (archivo) => {

    if (!archivo) return;

    const byteCharacters = atob(archivo.archivo);
    const byteArray = new Uint8Array(
      byteCharacters.split("").map((char) => char.charCodeAt(0))
    );
    const blob = new Blob([byteArray], { type: `application/${archivo.tipo}` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${archivo.nombreArchivo}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(
    function () {
      obtenerDatos();
      obtenerEmpleados();
    },
    [num_boton, cantidadPorPagina, filtros]
  );

  return userData.statusConected || userData !== null ? (
    <>
      {booleanos.isActiveInsertar && (
        <InsertarDocColab
          cambiarEstado={setBooleanos}
          isActive={booleanos.isActiveInsertar}
        />
      )}
      {booleanos.isActiveEditar && (
        <EditarDocColab
          cambiarEstado={setBooleanos}
          datosFila={datosFila}
          isActive={booleanos.isActiveEditar}
        ></EditarDocColab>
      )}
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de documentos de colaboradores</h1>
          <h6 style={{ color: "gray" }}>
            Operaciones internas {"->"} Listado de documentos de colaboradores
          </h6>
          <br></br>

          <div id="selectPaginador" style={{maxWidth: "1300px"}}>
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
              Crear documento de colaborador
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
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Nombre archivo</th>
                <th>Tipo archivo</th>
                <th>Archivo</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.documentosColab.map((item) => (
                <tr key={item.idDocColaborador}>
                  <td>{item.nomEmpleado}</td>
                  <td>{item.nombreArchivo}</td>
                  <td>{item.tipo}</td>
                  <td>
                    <button
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        descargarArchivo(item);
                      }}
                    >
                      Descargar archivo
                    </button>
                  </td>
                  <td>
                    <button
                      data-title="Editar documento"
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
                      data-title="Desactivar documento"
                      onClick={() => desactivar(item.idDocColaborador)}
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
