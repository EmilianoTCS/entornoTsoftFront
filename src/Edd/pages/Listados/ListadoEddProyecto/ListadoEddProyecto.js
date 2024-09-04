import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillProject } from "react-icons/ai";
import { FaMoneyBill, FaLink } from "react-icons/fa";
import "../TablasStyles.css";
import InsertarEddProyecto from "../../templates/form/Insertar/InsertarEddProyecto";
import EditarEDDProyecto from "../../templates/form/Editar/EditarEddProyecto";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import AuthorizationError from "../../../../templates/alerts/AuthorizationErrorAlert";

export default function ListadoEddProyecto() {
  const [, params] = useRoute("/listadoEddProyecto/:params");

  const [EDDProyecto, setEDDProyecto] = useState([""]);
  const [auxListProyecto, setAuxListProyecto] = useState([""]);
  const [auxIdProyecto, setAuxIdProyecto] = useState(null);
  const [isActiveInsertEDDProyecto, setIsActiveInsertEDDProyecto] =
    useState(false);
  const [isActiveEditEDDProyecto, setIsActiveEditEDDProyecto] = useState(false);
  const [idEDDProyecto, setidEDDProyecto] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "eddproyecto";

  const [idServicio, setidServicio] = useState(params.params);

  const [listServicio, setlistServicio] = useState([""]);

  function obtenerServicio() {
    const url = "pages/auxiliares/listadoServicioForms.php";
    const operationUrl = "listados";
    var data = {
      idCliente: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setlistServicio(data);
    });
  }
  function insertarEDDProyecto() {
    setIsActiveInsertEDDProyecto(!isActiveInsertEDDProyecto);
  }
  function editarEDDProyecto(ID) {
    setIsActiveEditEDDProyecto(!isActiveEditEDDProyecto);
    setidEDDProyecto(ID);
  }

  function handleChangePaginador() {
    var url = "pages/listados/listadoEddProyecto.php";
    var operationUrl = "listadoEddProyecto";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idServicio: idServicio,
      idProyecto: auxIdProyecto ? auxIdProyecto : 0,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setEDDProyecto(datos.datos);
    });
  }

  function convertirFecha(fechaString) {
    if (fechaString) {
      // Extraer el año y el mes del string
      const anio = fechaString.slice(0, 4);
      const mesNumero = fechaString.slice(4);

      // Convertir el mes a nombre
      const meses = [
        "ENERO",
        "FEBRERO",
        "MARZO",
        "ABRIL",
        "MAYO",
        "JUNIO",
        "JULIO",
        "AGOSTO",
        "SEPTIEMBRE",
        "OCTUBRE",
        "NOVIEMBRE",
        "DICIEMBRE",
      ];
      const mesNombre = meses[parseInt(mesNumero) - 1];

      // Formatear la fecha en el formato deseado
      const fechaFormateada = mesNombre + " " + anio;

      return fechaFormateada;
    }
  }
  const obtenerRelacionesProy = async (ID) => {
    var datosProyectos = [];
    var url = "pages/auxiliares/validar_rel_proy.php";
    var operationUrl = "validar_rel_proy";
    var data = {
      idProyecto: ID,
    };
    const response = await SendDataService(url, operationUrl, data);
    if (response) {
      datosProyectos = response;
    }
    return datosProyectos;
  };

  function MensajeError(text) {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "No es posible realizar esta acción.",
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
    const datosAfectados = await obtenerRelacionesProy(ID);
    let text = `<b>Esta acción no se puede deshacer.</b>
      <br>`;

    const { idEDDEvalProyEmp, idImpugnacionEmp, nomEvaluacion, mes } =
      datosAfectados[0];
    if (
      idEDDEvalProyEmp !== "empty / vacio" ||
      idImpugnacionEmp !== "empty / vacio" ||
      nomEvaluacion !== "empty / vacio" ||
      mes !== "empty / vacio"
    ) {
      let errorText = `Este proyecto cuenta con impugnaciones y evaluaciones de desempeño (EDD) relacionadas y no puede ser desactivado. <br> <br>
        <div style="display: flex; max-height: 200px; overflow-y: auto;">
        <br>
          <div style="flex: 1; padding-right: 10px; text-align: left;">
            <b>Meses afectados:</b><br>`;
      datosAfectados.forEach((item) => {
        if (item.mes) {
          errorText += `<h6>-${convertirFecha(item.mes)}</h6> <br>`;
        }
      });

      errorText += `</div><div style="flex: 1; padding-left: 10px; text-align: left;">
            <b>Evaluaciones afectadas:</b><br>`;

      datosAfectados.forEach((item) => {
        if (item.nomEvaluacion) {
          errorText += `<h6>-${item.nomEvaluacion}</h6> <br>`;
        }
      });

      errorText += `</div></div><br>
        <h5>Para poder desactivar un proyecto se deben desasociar estos datos</h5>`;
      MensajeError(errorText);
    } else {
      const response = await ConfirmAlert(text);
      if (response === true) {
        var url = "pages/desactivar/ihh_desactivarProyecto.php";
        var operationUrl = "ihh_desactivarProyecto";
        var data = {
          idProyecto: ID,
          usuarioModificacion: userData.usuario,
        };
        const desactivarResponse = await SendDataService(
          url,
          operationUrl,
          data
        );
        const { OUT_CODRESULT, OUT_MJERESULT } = desactivarResponse[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        handleChangePaginador();
      }
    }
  }

  function obtenerProyecto() {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    var data = {
      idServicio: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setAuxListProyecto(data);
    });
  }

  useEffect(
    function () {
      handleChangePaginador();
      obtenerServicio();
      obtenerProyecto();
    },
    [num_boton, cantidadPorPagina, idServicio, auxIdProyecto]
  );

  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    <>
      {userData.nomRol === "administrador" ||
      userData.nomRol === "gerencia" ||
      userData.nomRol === "people" ? (
        <>
          <Header></Header>
          <br></br>
          <br></br>
          <div id="fondoTabla">
            <div id="containerTablas">
              <h1 id="TitlesPages">Listado de proyectos</h1>
              <h6 style={{ color: "gray" }}>Eval desempeño {"->"} Proyectos</h6>
              <br></br>

              <div id="selectPaginador">
                {userData.nomRol === "administrador" ? (
                  <Button id="btn" onClick={insertarEDDProyecto}>
                    Crear proyecto
                  </Button>
                ) : null}

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
                  <label htmlFor="input_CantidadR">
                    Servicios del cliente:{" "}
                  </label>
                  <select
                    required
                    type="text"
                    className="form-control"
                    onChange={({ target }) => {
                      setidServicio(target.value);
                      setNumBoton(1);
                    }}
                  >
                    <option value="">Todos</option>
                    {listServicio.map((valor) => (
                      <option
                        selected={
                          valor.idServicio === idServicio ? "selected" : ""
                        }
                        value={valor.idServicio}
                      >
                        {valor.nomServicio}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" id="btn2">
                  <label htmlFor="buscadorProyectos">
                    Seleccione un proyecto:{" "}
                  </label>
                  <input
                    list="auxProyectos"
                    className="form-control"
                    name="buscadorProyectos"
                    placeholder="Seleccione un proyecto"
                    onChange={(event) => {
                      const selectedProyecto = auxListProyecto.find(
                        (item) => item.nomProyecto === event.target.value
                      );
                      if (selectedProyecto) {
                        setAuxIdProyecto(selectedProyecto.idEDDProyecto);
                      } else {
                        setAuxIdProyecto(0);
                      }
                    }}
                  ></input>
                  <datalist id="auxProyectos">
                    {auxListProyecto.map((item) => (
                      <option
                        key={item.idEDDProyecto} // Asegúrate de tener un key único para cada opción
                        value={item.nomProyecto} // Almacena el nombre del empleado como value
                      ></option>
                    ))}
                  </datalist>
                </div>
              </div>
              {isActiveInsertEDDProyecto ? (
                <InsertarEddProyecto
                  isActiveEDDProyecto={isActiveInsertEDDProyecto}
                  cambiarEstado={setIsActiveInsertEDDProyecto}
                  EDDProyecto={EDDProyecto}
                ></InsertarEddProyecto>
              ) : (
                <></>
              )}
              <EditarEDDProyecto
                isActiveEditEDDProyecto={isActiveEditEDDProyecto}
                cambiarEstado={setIsActiveEditEDDProyecto}
                idEDDProyecto={idEDDProyecto}
                setEDDProyecto={setEDDProyecto}
                EDDProyecto={EDDProyecto}
                nombreTabla={nombreTabla}
              ></EditarEDDProyecto>
              {/* <EditarPresupuestosMensuales /> */}

              <Table id="mainTable" hover responsive>
                <thead>
                  <tr>
                    {/* <th>ID</th> */}
                    <th>Proyecto</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Tipo Proyecto</th>
                    <th>Servicio del cliente</th>
                    <th>Operaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {EDDProyecto.map((EDDProyecto) => (
                    <tr key={EDDProyecto.idEDDProyecto}>
                      {/* <td>{EDDProyecto.idEDDProyecto}</td> */}
                      <td>{EDDProyecto.nomProyecto}</td>
                      <td>{EDDProyecto.fechaIni}</td>
                      <td>{EDDProyecto.fechaFin}</td>
                      <td>{EDDProyecto.tipoProyecto}</td>
                      <td>{EDDProyecto.nomServicio}</td>
                      <td>
                        {userData.nomRol === "administrador" ? (
                          <button
                            data-title="Editar proyecto"
                            id="OperationBtns"
                            onClick={() =>
                              editarEDDProyecto(EDDProyecto.idEDDProyecto)
                            }
                          >
                            <RiEditBoxFill id="icons" />
                          </button>
                        ) : null}
                        <Link
                          to={`/ihh/listado_acop_proy/${EDDProyecto.idEDDProyecto}/0`}
                        >
                          <button
                            data-title="Detalle proyecto - ACOP"
                            id="OperationBtns"
                          >
                            <FaLink id="icons" />
                          </button>
                        </Link>
                        <Link
                          to={`/ihh/detalleProyectos/${EDDProyecto.idEDDProyecto}`}
                        >
                          <button
                            data-title="Detalle presupuesto mensual"
                            id="OperationBtns"
                          >
                            <FaMoneyBill id="icons" />
                          </button>
                        </Link>
                        <Link
                          to={`/listadoEDDProyEmp/${EDDProyecto.idEDDProyecto}/0`}
                        >
                          <button
                            data-title="Proy. colaborador relacionados"
                            id="OperationBtns"
                          >
                            <AiFillProject id="icons" />
                          </button>
                        </Link>

                        {userData.nomRol === "administrador" ? (
                          <button
                            data-title="Desactivar proyecto"
                            onClick={() =>
                              desactivar(EDDProyecto.idEDDProyecto)
                            }
                            id="OperationBtns"
                          >
                            <BsFillTrashFill id="icons" />
                          </button>
                        ) : null}
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
        <AuthorizationError />
      )}
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
