import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import InsertarFormulario from "./Formularios/InsertarFormulario";
import EditarFormulario from "./Formularios/EditarFormulario";

export default function OI_listadoFormulario() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [booleanos, setBooleanos] = useState({
    isActiveInsertar: false,
    isActiveEditar: false,
  });

  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [datosFila, setDatosFila] = useState([]);

  const [mainList, setMainList] = useState({
    listadoFormulario: [""],
  });
  const [num_boton, setNumBoton] = useState(1);
  const obtenerFormularios = () => {
    var url = "pages/listados/oi_listadoFormulario.php";
    var operationUrl = "oi_listadoFormulario";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ listadoFormulario: datos.datos });
    });
  };
  const desactivar = (ID) => {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/oi_desactivarFormulario.php";
        var operationUrl = "oi_desactivarFormulario";
        var data = {
          idFormulario: ID,
          usuarioModificacion: userData.usuario,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        });
      }
    });
  };

  const descargarArchivo = (archivoBase64) => {
    if (!archivoBase64) return;

    const byteCharacters = window.atob(archivoBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "imagen.png";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(
    function () {
      obtenerFormularios();
    },
    [num_boton, cantidadPorPagina]
  );

  return userData.statusConected || userData !== null ? (
    <>
      {booleanos.isActiveInsertar && (
        <InsertarFormulario
          cambiarEstado={setBooleanos}
          isActive={booleanos.isActiveInsertar}
        />
      )}
      {booleanos.isActiveEditar && (
        <EditarFormulario
          cambiarEstado={setBooleanos}
          datosFila={datosFila}
          isActive={booleanos.isActiveEditar}
        ></EditarFormulario>
      )}
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de formularios</h1>
          <h6 style={{ color: "gray" }}>
            Operaciones internas {"->"} Listado de formularios
          </h6>
          <br></br>

          <div id="selectPaginador" style={{ maxWidth: "1300px" }}>
            <Button
              id="btn"
              style={{ whiteSpace: "nowrap", height: "60px" }}
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
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Logo</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.listadoFormulario.map((item) => (
                <tr key={item.idFormulario}>
                  <td>{item.nomFormulario}</td>
                  <td>{item.descFormulario}</td>
                  <td>
                    {item.logoFormulario ? (
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          descargarArchivo(item.logoFormulario);
                        }}
                      >
                        Descargar imagen
                      </button>
                    ) : (
                      "SIN LOGO"
                    )}
                  </td>
                  <td>
                    <button
                      data-title="Editar formulario"
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
                      data-title="Desactivar formulario"
                      onClick={() => desactivar(item.idFormulario)}
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
