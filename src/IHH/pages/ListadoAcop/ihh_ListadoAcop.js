import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";

import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";

import "../../../Edd/pages/Listados/TablasStyles.css";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import { MdAccessTimeFilled, MdCalendarMonth } from "react-icons/md";
import { FaLink, FaCloudDownloadAlt } from "react-icons/fa";
import InsertarAcop from "../../forms/insertar/InsertarAcop";
import EditarAcop from "../../forms/editar/EditarAcop";
import EditarMesAcop from "../../forms/editar/EditarMesAcop";

import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import InsertarAcopDoc from "../../forms/insertar/InsertarAcopDoc";
import GestorArchivosAcop from "../../forms/editar/GestorAchivosAcop";

export default function IHH_ListadoAcop() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "ihhacop";

  const [datosMesesAcop, setDatosMesesAcop] = useState([""]);
  const [isActiveFormularioPresupuesto, setisActiveFormularioPresupuesto] =
    useState(false);

  const [isActiveBooleans, setIsActiveBooleans] = useState({
    editarAcop: false,
    insertarAcop: false,
  });

  const [isActiveMesesAcop, setIsActiveMesesAcop] = useState(false);
  const [isActiveInsertarDoc, setIsActiveInsertarDoc] = useState(false);
  const [isActiveGestorDoc, setIsActiveGestorDoc] = useState(false);
  const [AcopGestor, setAcopGestor] = useState(null);
  const [Registro, setRegistro] = useState(0);

  const [mainList, setMainList] = useState({
    acops: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoAcop.php";
    var operationUrl = "ihh_listadoAcop";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ acops: datos.datos });
    });
  };

  const obtenerMesesAcop = (idAcop) => {
    var url = "pages/auxiliares/ihh_listadoMesesAcop.php";
    var operationUrl = "listados";
    var data = {
      idAcop: idAcop,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      if (response) {
        console.log("response", response);

        setDatosMesesAcop(response);
        setIsActiveMesesAcop(true);
      }
    });
  };

  const activarFormulario = (Registro, nomOperacion) => {
    setRegistro(Registro);
    if (nomOperacion === "editar") {
      setIsActiveBooleans((prevDatos) => ({
        ...prevDatos,
        editarAcop: true,
      }));
    }
  };

  const obtenerProyectosAfectados = async (ID) => {
    var datosProyectos = [];
    var url = "pages/listados/ihh_listadoAcopProy.php";
    var operationUrl = "ihh_listadoAcopProy";
    var data = {
      idProyecto: 0,
      idAcop: ID,
      num_boton: 1,
      cantidadPorPagina: 999999999,
    };
    const response = await SendDataService(url, operationUrl, data);
    const { paginador, ...datos } = response;
    if (datos) {
      datosProyectos = datos.datos;
    }
    return datosProyectos;
  };

  function MensajeError(text) {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "No es posible realizar esta acción. ",
      html: text,
      icon: "error",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: true,
      confirmButtonText: "Aceptar",
      timerProgressBar: true,
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        // history.back();
      }
    });
  }

  // ELIMINAR
  async function desactivar(ID) {
    const proyectosAfectados = await obtenerProyectosAfectados(ID);
    let text = `<b>Esta acción no se puede deshacer.</b>
    <br>`;
    if (proyectosAfectados[0].idacopproy !== "empty / vacio") {
      let errorText = `Este ACOP cuenta con proyectos relacionados y no puede ser desactivado. <br>`;
      proyectosAfectados.forEach((item) => {
        errorText += ` <br> Los proyectos afectados son: <br>
         <h6>-${item.nomProyecto} </h6> <br>`;
      });
      errorText += `<h5> Para poder desactivar un ACOP se deben desasociar los proyectos relacionados </h5> `;
      MensajeError(errorText);
    } else {
      const response = await ConfirmAlert(text);
      if (response === true) {
        var url = "pages/desactivar/ihh_desactivarAcop.php";
        var operationUrl = "ihh_desactivarAcop";
        var data = {
          idAcop: ID,
          usuarioModificacion: userData.usuario,
        };
        const desactivarResponse = await SendDataService(
          url,
          operationUrl,
          data
        );
        const { OUT_CODRESULT, OUT_MJERESULT } = desactivarResponse[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        obtenerDatos();
      }
    }
  }

  useEffect(
    function () {
      obtenerDatos();
    },
    [num_boton, cantidadPorPagina]
  );

  return userData.statusConected || userData !== null ? (
    <>
      {isActiveMesesAcop ? (
        <EditarMesAcop
          cambiarEstado={setIsActiveMesesAcop}
          mesesAcop={datosMesesAcop}
          isActiveFormulario={isActiveMesesAcop}
        />
      ) : null}

      {isActiveGestorDoc ? (
        <GestorArchivosAcop
          cambiarEstado={setIsActiveGestorDoc}
          acop={AcopGestor}
          isActiveFormulario={isActiveGestorDoc}
        />
      ) : null}

      {isActiveInsertarDoc ? (
        <InsertarAcopDoc
          cambiarEstado={setIsActiveInsertarDoc}
          isActive={isActiveInsertarDoc}
        />
      ) : null}

      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de ACOPS</h1>
          <h6 style={{ color: "gray" }}>
            Impugnación de Horas {"->"} Listado de ACOPS
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              onClick={() => {
                setIsActiveBooleans((prevDatos) => ({
                  ...prevDatos,
                  insertarAcop: true,
                }));
              }}
            >
              Insertar ACOP
            </Button>
            <Button
              id="btn"
              onClick={() => {
                setIsActiveInsertarDoc(true);
              }}
            >
              Insertar documento
            </Button>

            <InsertarAcop
              isActive={isActiveBooleans.insertarAcop}
              cambiarEstado={setIsActiveBooleans}
            />

            <EditarAcop
              isActive={isActiveBooleans.editarAcop}
              cambiarEstado={setIsActiveBooleans}
              nombreTabla={nombreTabla}
              Registro={Registro}
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
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>Nombre ACOP</th>
                <th>Número ACOP</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Valor USD</th>
                <th>Presup Total (USD)</th>
                <th>Presup Total (CLP)</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.acops.map((item) => (
                <tr key={item.idAcop}>
                  <td style={{ maxWidth: "350px" }}>{item.nomAcop}</td>
                  <td style={{ width: "80px" }}>{item.numAcop}</td>
                  <td style={{ width: "110px" }}>{item.fechaIni}</td>
                  {item.fechaFin === null ? (
                    <td>INDEFINIDA </td>
                  ) : (
                    <td style={{ width: "110px" }}> {item.fechaFin} </td>
                  )}
                  <td style={{ width: "80px" }}>
                    {parseFloat(item.valorUSD).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ width: "120px" }}>
                    {parseFloat(item.presupuestoTotal).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ width: "130px" }}>
                    {parseFloat(item.presupuestoTotalPesos).toLocaleString(
                      "es-CL",
                      {
                        style: "currency",
                        currency: "CLP",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }
                    )}
                  </td>
                  <td>
                    <button
                      data-title="Editar acop"
                      id="OperationBtns"
                      onClick={() => activarFormulario(item, "editar")}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    <button
                      data-title="Gestor archivos"
                      id="OperationBtns"
                      onClick={() => {
                        setAcopGestor(item);
                        setIsActiveGestorDoc(true);
                      }}
                    >
                      <FaCloudDownloadAlt id="icons" />
                    </button>
                    <button
                      data-title="Editar meses acop"
                      id="OperationBtns"
                      onClick={() => obtenerMesesAcop(item.idAcop)}
                    >
                      <MdCalendarMonth id="icons" />
                    </button>

                    <Link to={`/ihh/listado_acop_proy/0/${item.idAcop}`}>
                      <button
                        data-title="Detalle proyecto - ACOP"
                        id="OperationBtns"
                      >
                        <FaLink id="icons" />
                      </button>
                    </Link>
                    <Link to={`/ihh/listado_mes_acop/${item.idAcop}`}>
                      <Button
                        data-title="Detalle de meses"
                        id="OperationBtns"
                        style={{ color: "black" }}
                      >
                        <MdAccessTimeFilled id="icons" />
                      </Button>
                    </Link>

                    <button
                      data-title="Desactivar acop"
                      onClick={() => desactivar(item.idAcop)}
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
